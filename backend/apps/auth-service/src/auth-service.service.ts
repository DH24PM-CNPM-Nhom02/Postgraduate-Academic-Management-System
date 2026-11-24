// auth/auth.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';
import { isEmail } from 'class-validator';
import { createHash, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from './prisma/prisma.service.js';
import { ChangePasswordDto, CreateUsersDto, ForgotPasswordDto, ListForgotPasswordQueryDto, ListUsersQueryDto, LoginDto, type UpdateMyAccountProfileDto } from '../../../lib/contracts/src/dto/auth.dto.js';
import { Prisma, TrangThaiQuenMatKhau } from './generated/prisma/index.js';
import { paginatePrisma } from './helpers/pagination.util.js';
import type { StringValue } from 'ms';
import { ROLES } from '../../../lib/contracts/src/permissions.js';
type TokenPair = { access_token: string; refresh_token: string };

const WITH_ROLES = { roles: { include: { role: true } } } as const;
const WITH_RBAC = {
  roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
} as const;

const hashToken = (t: string) => createHash('sha256').update(t).digest('hex');
const unauthorized = (message: string) => new RpcException({ statusCode: 401, message });
const toUserView = (u: any) => ({ ...u, roles: u.roles.map((r: any) => r.role.name) });
@Injectable()
export class AuthService {
  // Grace period: nhiều request cùng lúc mang cùng 1 refresh token sẽ nhận chung kết quả
  private refreshCache = new Map<string, { promise: Promise<TokenPair>; expiresAt: number; userId?: string }>();

  private clearUserRefreshCache(userId: string) {
    for (const [hash, item] of this.refreshCache.entries()) {
      if (item.userId === userId) {
        this.refreshCache.delete(hash);
      }
    }
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    @Inject('NOTIFICATION_SERVICE') private readonly notifClient: ClientProxy,
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
        email: user.email,
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
    this.refreshCache.set(tokenHash, { promise, expiresAt: Date.now() + 15_000, userId: payload.sub });
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
      const tokenHash = hashToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      this.refreshCache.delete(tokenHash);
      try {
        const payload = this.jwt.decode(refreshToken) as { sub?: string };
        if (payload?.sub) {
          this.clearUserRefreshCache(payload.sub);
        }
      } catch {
        // ignore decoding errors
      }
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
    if (!user.isActive) throw new RpcException({ statusCode: 400, message: 'Tài khoản của bạn đã bị khóa' });
    return this.toProfile(user);
  }

  async updateMyProfile(userId: string, dto: UpdateMyAccountProfileDto) {
    const data: UpdateMyAccountProfileDto = {};
    if (dto?.fullName !== undefined) {
      const fullName = typeof dto.fullName === 'string' ? dto.fullName.trim() : '';
      if (!fullName || fullName.length > 191) {
        throw new RpcException({ statusCode: 400, message: 'Họ và tên phải có từ 1 đến 191 ký tự' });
      }
      data.fullName = fullName;
    }
    if (dto?.email !== undefined) {
      const email = typeof dto.email === 'string' ? dto.email.trim() : '';
      if (email.length > 191 || !isEmail(email)) {
        throw new RpcException({ statusCode: 400, message: 'Email tài khoản không hợp lệ hoặc dài quá 191 ký tự' });
      }
      data.email = email.toLowerCase();
    }
    if (Object.keys(data).length === 0) {
      throw new RpcException({ statusCode: 400, message: 'Không có thông tin nào để sửa' });
    }

    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
          deletedAt: null,
          isActive: true,
          roles: { some: { role: { name: { in: [ROLES.ADMIN, ROLES.GIAO_VU] } } } },
        },
        data,
        include: WITH_RBAC,
      });
      return this.toProfile(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new RpcException({ statusCode: 409, message: 'Email đã được sử dụng bởi tài khoản khác' });
        }
        if (error.code === 'P2025') {
          throw new RpcException({ statusCode: 403, message: 'Tài khoản không được phép cập nhật hồ sơ này' });
        }
      }
      throw error;
    }
  }

  private toProfile(user: Prisma.UserGetPayload<{ include: typeof WITH_RBAC }>) {
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
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
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
        deletedAt: null,
        isActive: true
      }
    });
    if (!user) {
      throw new RpcException({ statusCode: 400, message: 'Không tìm thấy tài khoản' });
    }
    if (!(await bcrypt.compare(dto.oldPassword, user.password))) {
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
    this.clearUserRefreshCache(userId);

    try {
      this.notifClient.emit('notification.create', {
        userIds: [userId],
        loai: 'TAI_KHOAN_DOI_MAT_KHAU',
        khoaTrung: `DOI_MK:${userId}:${Date.now()}`,
      }).subscribe({ error: () => { } });
    } catch {
      // ignore notification errors
    }

    return { message: 'Đổi mật khẩu thành công' };
  }

  async createUsers(dto: CreateUsersDto, actorId?: string, actorRoles?: string[]) {
    // Không cho phép Giáo vụ tạo tài khoản ADMIN (ngăn chặn leo thang đặc quyền)
    const hasAdminOrStaff = dto.users.some(
      (u) => u.role === ROLES.ADMIN || u.role === ROLES.GIAO_VU,
    );

    if (hasAdminOrStaff) {
      let isActorAdmin = actorRoles?.includes(ROLES.ADMIN);
      if (!isActorAdmin && actorId) {
        const actor = await this.prisma.user.findFirst({
          where: { id: actorId, deletedAt: null, isActive: true },
          include: WITH_ROLES,
        });
        isActorAdmin = actor?.roles.some((r) => r.role.name === ROLES.ADMIN) ?? false;
      }

      const hasAdmin = dto.users.some((u) => u.role === ROLES.ADMIN);
      if (hasAdmin && !isActorAdmin) {
        throw new RpcException({
          statusCode: 403,
          message: 'Không được phép tạo tài khoản có vai trò ADMIN. Chỉ Admin mới có quyền tạo tài khoản Quản trị viên',
        });
      }

      if (!isActorAdmin) {
        throw new RpcException({
          statusCode: 403,
          message: 'Giáo vụ chỉ được phép tạo tài khoản cho NCS hoặc GVHD. Chỉ Admin mới có quyền tạo tài khoản Giáo vụ hoặc Admin',
        });
      }
    }
    //validate duplicate data in payload
    const usernames = dto.users.map((u) => u.username);

    //vd: usernames = ['a','b','a','c']
    //filter((u, i) => usernames.indexOf(u) !== i)
    //khi i = 0, usernames.indexOf('a') = 0, vì 0 == 0 nên 'a' không bị lọc
    //khi i = 1, usernames.indexOf('b') = 1, vì 1 == 1 nên 'b' không bị lọc
    //khi i = 2, usernames.indexOf('a') = 0, vì 0 != 2 nên 'a' bị lọc
    //khi i = 3, usernames.indexOf('c') = 3, vì 3 == 3 nên 'c' không bị lọc
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

    //check email trùng trong danh sách hoặc đã tồn tại 
    await this.assertEmailsAvailable(dto.users);

    const prepared = await Promise.all(
      dto.users.map(async (u) => {
        const plain =
          u.password ?? (u.role === ROLES.NCS ? u.username : randomBytes(6).toString('base64url'));
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
              email: this.normalizeEmail(u.email),
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

  // ---------- Find users by usernames (dùng nội bộ cho phd-service) ----------
  async findUsers(usernames: string[]) {
    const users = await this.prisma.user.findMany({
      where: {
        username: { in: usernames },
        deletedAt: null,
      },
      include: WITH_ROLES,
    });
    return users.map((u) => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      isActive: u.isActive,
      roles: u.roles.map((r: any) => r.role.name),
    }));
  }

  // ---------- Find users by IDs (dùng nội bộ cho audit-logs / phd-service) ----------
  async findUsersByIds(ids: string[]) {
    if (!ids || ids.length === 0) return [];
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      include: WITH_ROLES,
    });
    return users.map((u) => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      isActive: u.isActive,
      roles: u.roles.map((r: any) => r.role.name),
    }));
  }

  // ---------- Find user list (Hybrid pagination) ----------
  async listUsers(q?: ListUsersQueryDto) {
    const where: any = { deletedAt: null };
    if (q?.role) where.roles = { some: { role: { name: q.role } } };
    if (q?.status === 'active') where.isActive = true;
    if (q?.status === 'locked') where.isActive = false;
    if (q?.keyword) {
      where.OR = [
        { username: { contains: q.keyword } },
        { fullName: { contains: q.keyword } },
        { email: { contains: q.keyword } },
      ];
    }

    return paginatePrisma(this.prisma.user, {
      page: q?.page,
      limit: q?.limit,
      where,
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      transform: toUserView,
    });
  }

  // ---------- Get detail user ---------
  async getUser(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true, username: true, fullName: true, email: true,
        isActive: true, mustChangePassword: true, createdAt: true,
        roles: {
          select: {
            role: {
              select: {
                name: true
              }
            }
          }
        },
      },
    });
    if (!user) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy tài khoản' });
    return toUserView(user);
  }

  // ---------- Set user status --------
  async setUserStatus(actorId: string, targetId: string, isActive: boolean) {
    if (actorId === targetId && !isActive) throw new RpcException({ statusCode: 400, message: 'Không thể tự khóa tài khoản của mình' });

    const target = await this.getUser(targetId);
    if (target.roles.includes(ROLES.NCS) || target.roles.includes(ROLES.GVHD)) {
      throw new RpcException({ statusCode: 400, message: 'Tài khoản NCS/GVHD: hãy đổi trạng thái ở hồ sơ NCS/GVHD' });
    }
    return this.setActive(targetId, isActive);
  }

  // ---------- Reset pass ------------
  async resetPassword(actorRoles: string[], targetId: string) {
    const target = await this.getUser(targetId);

    // Giáo vụ chỉ được reset NCS/GVHD
    const targetIsStaff = target.roles.includes(ROLES.ADMIN) || target.roles.includes(ROLES.GIAO_VU);
    if (targetIsStaff && !actorRoles.includes(ROLES.ADMIN)) {
      throw new RpcException({ statusCode: 403, message: 'Chỉ admin mới được reset mật khẩu admin/giáo vụ' });
    }

    const plain = randomBytes(6).toString('base64url');
    const hash = await bcrypt.hash(plain, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: targetId },
        data: {
          password: hash,
          mustChangePassword: true
        },
      }),
      // thu hồi mọi phiên cũ
      this.prisma.refreshToken.updateMany({
        where: { userId: targetId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    this.clearUserRefreshCache(targetId);

    // Chỉ trả một lần, giống createUsers
    return { username: target.username, initialPassword: plain };
  }

  // ---------- Set active  ----------
  async setActive(userId: string, isActive: boolean) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
    if (!user) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy tài khoản' });
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { isActive } });
      if (!isActive) {
        // khóa thì thu hồi mọi phiên để refresh không dùng lại được
        await tx.refreshToken.updateMany({
          where: { userId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
    });
    if (!isActive) {
      this.clearUserRefreshCache(userId);
    }
    return { id: userId, isActive };
  }

  //Tìm chủ sở hữu email
  async findEmailOwners(emails: string[]) {
    if (emails.length === 0) return [];
    const users = await this.prisma.user.findMany({
      where: { email: { in: emails } },
      select: { email: true, username: true },
    });
    return users.map((u) => ({ email: u.email as string, username: u.username }));
  }

  // ---------- Helpers ----------
  private generateTokenPair(user: { id: string; username: string; roles: { role: { name: string } }[]; mustChangePassword?: boolean }): TokenPair {
    const access_token = this.jwt.sign(
      {
        sub: user.id,
        username: user.username,
        roles: user.roles.map((r) => r.role.name),
        mustChangePassword: user.mustChangePassword ?? false,
      },
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

  // Chuẩn hóa email: bỏ khoảng trắng, chữ thường. Rỗng thì coi như không có email.
  private normalizeEmail(email?: string): string | undefined {
    const cleaned = email?.trim().toLowerCase();
    return cleaned ? cleaned : undefined;
  }

  // Kiểm tra email của danh sách tài khoản sắp tạo:
  //  - định dạng email hợp lệ
  //  - không được nhập 2 lần trong cùng danh sách
  //  - không được trùng với tài khoản đã có trong DB
  private async assertEmailsAvailable(users: { username: string; email?: string }[]) {
    // 1. Kiểm tra định dạng email
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidFormat: string[] = [];
    for (const user of users) {
      const email = user.email?.trim();
      if (email && !EMAIL_REGEX.test(email)) {
        invalidFormat.push(`${email} (tài khoản: ${user.username})`);
      }
    }
    if (invalidFormat.length > 0) {
      throw new RpcException({
        statusCode: 400,
        message: `Email không đúng định dạng: ${invalidFormat.join(', ')}`,
      });
    }

    // gom các email có nhập khi tạo 
    const emails: string[] = [];
    for (const user of users) {
      const email = this.normalizeEmail(user.email);
      if (email) emails.push(email);
    }
    if (emails.length === 0) return; // không nhập email thì khỏi kiểm

    // tìm email bị nhập 2 lần trong danh sách
    const seen = new Set<string>();
    const repeated = new Set<string>();
    for (const email of emails) {
      if (seen.has(email)) repeated.add(email);
      seen.add(email);
    }
    if (repeated.size > 0) {
      throw new RpcException({
        statusCode: 400,
        message: `Email bị lặp trong danh sách: ${[...repeated].join(', ')}`,
      });
    }

    // Tìm email đã có trong DB
    const taken = await this.prisma.user.findMany({
      where: {
        email: {
          in: emails
        }
      },
      select: {
        email: true,
        username: true
      },
    });
    if (taken.length > 0) {
      const names = taken.map((t) => `${t.email} (${t.username})`);
      throw new RpcException({
        statusCode: 409,
        message: `Email đã được dùng: ${names.join(', ')}`,
      });
    }
  }

  // ---------- Danh sách người dùng theo vai trò (Role) ----------
  async getUsersByRole(role: string) {
    return this.prisma.user.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        roles: {
          some: {
            role: {
              name: role,
            },
          },
        },
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
      },
    });
  }

  //--- Xử lý quên mật khẩu ----
  async createForgotPasswordRequest(dto: ForgotPasswordDto) {
    const result = {
      message:
        'Yêu cầu đã được ghi nhận. Vui lòng liên hệ Giáo vụ (hoặc Admin nếu bạn là Giáo vụ) để được xác nhận và cấp lại mật khẩu.',
    };

    const username = dto.username.trim();
    const user = await this.prisma.user.findFirst({
      where: { username, deletedAt: null },
      include: WITH_ROLES,
    });

    if (!user || !user.isActive) return result;
    if (user.roles.some((r) => r.role.name === ROLES.ADMIN)) return result;

    // Mỗi tài khoản chỉ có 1 yêu cầu đang chờ
    const pending = await this.prisma.passwordResetRequest.findFirst({
      where: { userId: user.id, trangThai: TrangThaiQuenMatKhau.CHO_XU_LY },
    });
    if (pending) return result;

    const req = await this.prisma.passwordResetRequest.create({
      data: {
        userId: user.id,
        ghiChuLienHe: dto.ghiChuLienHe?.trim() || null
      },
    });
    await this.notifyForgotPasswordRequest(req.id, user, dto.ghiChuLienHe);
    return result;
  }

  // Báo cho người xử lý biết có yêu cầu mới. Lỗi thông báo không được làm hỏng yêu cầu
  private async notifyForgotPasswordRequest(
    requestId: string,
    user: { username: string; fullName: string; roles: { role: { name: string } }[] },
    ghiChuLienHe?: string,
  ) {
    try {
      const userRoles = user.roles.map((r) => r.role.name);
      const isGiaoVu = userRoles.includes(ROLES.GIAO_VU);

      // Giáo vụ gửi yêu cầu thì báo admin, còn lại báo giáo vụ
      const handlers = await this.getUsersByRole(isGiaoVu ? ROLES.ADMIN : ROLES.GIAO_VU);
      if (handlers.length === 0) return;

      this.notifClient
        .emit('notification.create', {
          userIds: handlers.map((h) => h.id),
          loai: 'YEU_CAU_QUEN_MAT_KHAU',
          duLieu: {
            yeuCauId: requestId,
            username: user.username,
            hoTen: user.fullName,
            vaiTro: isGiaoVu ? ROLES.GIAO_VU : userRoles[0],
            ghiChuLienHe: ghiChuLienHe?.trim() || undefined,
          },
          khoaTrung: `QUEN_MK:${requestId}`,
        })
        .subscribe({ error: () => { } });
    } catch {
      // lỗi thông báo thì bỏ qua, yêu cầu vẫn được ghi nhận
    }
  }

  //--- Danh sách các yêu cầu quên mật khẩu -----
  async listForgotPasswordRequests(actorRoles: string[], dto?: ListForgotPasswordQueryDto) {
    const handleRoles = this.handledRoles(actorRoles);

    const where: any = {
      user: {
        roles: {
          some: {
            role: {
              name: {
                in: handleRoles
              }
            }
          }
        }
      }
    }

    if (dto?.trangThai) {
      where.trangThai = dto.trangThai
    }

    return paginatePrisma(this.prisma.passwordResetRequest, {
      page: dto?.page,
      limit: dto?.limit,
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
            roles: {
              select: {
                role: {
                  select: {
                    name: true
                  }
                }
              }
            },
          },
        }
      },
      orderBy: { createdAt: 'desc' },
      transform: (r: any) => ({ ...r, user: toUserView(r.user) })
    })

  }

  //role mà người xử lý đc phép xử lý yêu cầu
  private handledRoles(actorRoles: string[]) {
    return actorRoles.includes(ROLES.ADMIN) ? [ROLES.GIAO_VU] : [ROLES.NCS, ROLES.GVHD];
  }

  // Lấy yêu cầu đang chờ và kiểm tra người xử lý có quyền với yêu cầu này không
  private async getHandleableRequest(actorRoles: string[], requestId: string) {
    const req = await this.prisma.passwordResetRequest.findUnique({
      where: {
        id: requestId
      },
      include: {
        user: {
          include: WITH_ROLES
        }
      }
    })
    if (!req) {
      throw new RpcException({
        statusCode: 404,
        message: `Không tìm thấy yêu cầu`,
      });
    }
    if (req.trangThai != TrangThaiQuenMatKhau.CHO_XU_LY) {
      throw new RpcException({
        statusCode: 400,
        message: `Yêu cầu này đã được xử lý`,
      });
    }

    const userRoles = req.user.roles.map((r: any) => r.role.name);
    const canHandle = this.handledRoles(actorRoles).some((r) => userRoles.includes(r));
    if (!canHandle) {
      throw new RpcException({ statusCode: 403, message: 'Bạn không có quyền xử lý yêu cầu này' });
    }

    return req;
  }

  //---- Duyệt yêu cầu ---- 
  async approveForgotPasswordRequest(actorId: string, actorRoles: string[], reqId: string) {
    const request = await this.getHandleableRequest(actorRoles, reqId);

    // Dùng lại hàm reset đã có: tạo mật khẩu tạm, bắt đổi lần đầu, thu hồi phiên cũ
    const result = await this.resetPassword(actorRoles, request.userId);

    await this.prisma.passwordResetRequest.update({
      where: { id: reqId },
      data: {
        trangThai: TrangThaiQuenMatKhau.DA_XU_LY,
        nguoiXuLyId: actorId,
        ngayXuLy: new Date(),
      },
    });
    return result; // { username, initialPassword }: chỉ trả một lần
  }

  //--- Từ chối yêu cầu ---- 
  async rejectForgotPasswordRequest(
    actorId: string,
    actorRoles: string[],
    requestId: string,
    lyDoTuChoi?: string,
  ) {
    await this.getHandleableRequest(actorRoles, requestId); // kiểm tra tồn tại, còn chờ, đúng quyền

    await this.prisma.passwordResetRequest.update({
      where: { id: requestId },
      data: {
        trangThai: TrangThaiQuenMatKhau.TU_CHOI,
        lyDoTuChoi: lyDoTuChoi?.trim() || null,
        nguoiXuLyId: actorId,
        ngayXuLy: new Date(),
      },
    });
    return { id: requestId, trangThai: TrangThaiQuenMatKhau.TU_CHOI };
  }
}
