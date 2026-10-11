// auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from './prisma/prisma.service.js';
import { ChangePasswordDto, CreateUsersDto, LoginDto } from './dto/auth.dto.js';
import type { StringValue } from 'ms';
type TokenPair = { access_token: string; refresh_token: string };

const WITH_ROLES = { roles: { include: { role: true } } } as const;
const WITH_RBAC = {
  roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
} as const;

const hashToken = (t: string) => createHash('sha256').update(t).digest('hex');
const unauthorized = (message: string) => new RpcException({ statusCode: 401, message });

@Injectable()
export class AuthService {
  // Grace period: nhiều request cùng lúc mang cùng 1 refresh token sẽ nhận chung kết quả
  private refreshCache = new Map<string, { promise: Promise<TokenPair>; expiresAt: number }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) { }

  // ---------- Đăng nhập ----------
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { username: dto.username, deletedAt: null },
      include: WITH_ROLES,
    });
    const ok = user && (await bcrypt.compare(dto.password, user.password));
    if (!user || !ok) throw unauthorized('Mã số hoặc mật khẩu không chính xác');
    // Kiểm tra khóa SAU khi đúng mật khẩu để không lộ trạng thái tài khoản cho người lạ
    if (!user.isActive) {
      throw new RpcException({ statusCode: 403, message: 'Tài khoản đã bị khóa' });
    }

    const tokens = this.generateTokenPair(user);
    await this.storeRefreshToken(user.id, tokens.refresh_token);
    return {
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        roles: user.roles.map((r) => r.role.name),
        mustChangePassword: user.mustChangePassword,
      },
      ...tokens,
    };
  }

  // ---------- Refresh (rotation + reuse detection + grace cache) ----------
  async refresh(refreshToken: string): Promise<TokenPair> {
    let payload: { sub: string };
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw unauthorized('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    const tokenHash = hashToken(refreshToken);
    const cached = this.refreshCache.get(tokenHash);
    if (cached && cached.expiresAt > Date.now()) return cached.promise;

    const promise = this.rotate(tokenHash, payload.sub);
    this.refreshCache.set(tokenHash, { promise, expiresAt: Date.now() + 15_000 });
    promise.catch(() => this.refreshCache.delete(tokenHash)); // lỗi thì không cache
    setTimeout(() => this.refreshCache.delete(tokenHash), 15_000).unref();
    return promise;
  }

  private async rotate(tokenHash: string, userId: string): Promise<TokenPair> {
    const stored = await this.prisma.refreshToken.findUnique({ 
      where: { tokenHash } 
    });
    if (!stored || stored.userId !== userId || stored.expiresAt < new Date()) {
      throw unauthorized('Refresh token không hợp lệ hoặc đã hết hạn');
    }
    if (stored.revokedAt) {
      // Token cũ bị dùng lại sau grace period => nghi bị đánh cắp, hủy mọi phiên
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw unauthorized('Phiên đăng nhập không an toàn, vui lòng đăng nhập lại');
    }


    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null, isActive: true },
      include: WITH_ROLES,
    });
    if (!user) throw unauthorized('Tài khoản không còn hiệu lực');

    const tokens = this.generateTokenPair(user);
    const { exp } = this.jwt.decode(tokens.refresh_token) as { exp: number };
    await this.prisma.$transaction([
      this.prisma.refreshToken.update({ 
        where: { id: stored.id }, 
        data: { revokedAt: new Date() } 
      }),
      this.prisma.refreshToken.create({
        data: {
          userId,
          tokenHash: hashToken(tokens.refresh_token),
          expiresAt: new Date(exp * 1000)
        },
      }),
    ]);
    return tokens;
  }

  async logout(refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash: hashToken(refreshToken), revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return { message: 'Đăng xuất thành công' };
  }

  // ---------- Thông tin & phân quyền ----------
  async getMe(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: WITH_RBAC,
    });
    if (!user) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy tài khoản' });
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      mustChangePassword: user.mustChangePassword,
      roles: user.roles.map((r) => r.role.name),
      permissions: this.flattenPermissions(user),
    };
  }

  // Gateway gọi pattern này (có cache) để kiểm tra quyền
  async getPermissions(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null, isActive: true },
      include: WITH_RBAC,
    });
    return user ? this.flattenPermissions(user) : [];
  }

  // ---------- Mật khẩu & cấp tài khoản ----------
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(dto.oldPassword, user.password))) {
      throw new RpcException({ statusCode: 400, message: 'Mật khẩu cũ không chính xác' });
    }
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { password: await bcrypt.hash(dto.newPassword, 10), mustChangePassword: false },
      }),
      // đổi mật khẩu thì đăng xuất mọi thiết bị
      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return { message: 'Đổi mật khẩu thành công' };
  }

  async createUsers(dto: CreateUsersDto) {
    //validate duplicate data in payload
    const usernames = dto.users.map((u) => u.username);

    const dupInPayload = usernames.filter((u, i) => usernames.indexOf(u) !== i);
    if (dupInPayload.length) {
      throw new RpcException({
        statusCode: 400,
        message: `Mã số bị lặp trong danh sách: ${[...new Set(dupInPayload)].join(', ')}`,
      });
    }

    const existing = await this.prisma.user.findMany({
      where: { username: { in: usernames } },
      select: { username: true },
    });
    if (existing.length) {
      throw new RpcException({
        statusCode: 409,
        message: `Mã số đã tồn tại: ${existing.map((e) => e.username).join(', ')}`,
      });
    }
    const prepared = await Promise.all(
      dto.users.map(async (u) => {
        const plain = u.password ?? randomBytes(6).toString('base64url');
        return { u, plain, hash: await bcrypt.hash(plain, 10) };
      }),
    );
    try {
      await this.prisma.$transaction(
        prepared.map(({ u, hash }) =>
          this.prisma.user.create({
            data: {
              username: u.username,
              fullName: u.fullName,
              email: u.email,
              password: hash,
              roles: { create: { role: { connect: { name: u.role } } } },
            },
          }),
        ),
      );
    } catch (e: any) {
      if (e.code === 'P2002') throw new RpcException({ statusCode: 409, message: 'Có mã số đã tồn tại' });
      if (e.code === 'P2025') throw new RpcException({ statusCode: 400, message: 'Role không tồn tại' });
      throw e;
    }
    // Trả mật khẩu khởi tạo MỘT LẦN để Giáo vụ phát cho người dùng
    return prepared.map(({ u, plain }) => ({ username: u.username, initialPassword: plain }));
  }

  // ---------- Helpers ----------
  private generateTokenPair(user: { id: string; username: string; roles: { role: { name: string } }[] }): TokenPair {
    const access_token = this.jwt.sign(
      { sub: user.id, username: user.username, roles: user.roles.map((r) => r.role.name) },
      {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: this.config.getOrThrow('JWT_ACCESS_EXPIRES') as StringValue,
      },
    );
    const refresh_token = this.jwt.sign(
      { sub: user.id, username: user.username },
      {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.config.getOrThrow('JWT_REFRESH_EXPIRES') as any,
        jwtid: uuidv4(),
      },
    );
    return { access_token, refresh_token };
  }

  private async storeRefreshToken(userId: string, token: string) {
    const { exp } = this.jwt.decode(token) as { exp: number };
    await this.prisma.refreshToken.create({
      data: { userId, tokenHash: hashToken(token), expiresAt: new Date(exp * 1000) },
    });
  }

  private flattenPermissions(user: any): string[] {
    return [...new Set<string>(
      user.roles.flatMap((r: any) => r.role.permissions.map((p: any) => p.permission.name)),
    )];
  }
}