// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { AUTH_SERVICE } from '../common/constants/service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { AuthController } from './auth.controller.js';
import { PermissionGuard } from '../common//guards/permission.guard.js';
import { PermissionsService } from './services/permissions.service.js';
import { MustChangePasswordGuard } from '../common/guards/mustChangePassword.guard.js';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppThrottlerGuard } from '../common/guards/app-throttler.guard.js';


@Module({
  imports: [
    PassportModule,
    ThrottlerModule.forRoot([
      // Quy tắc 1: mọi API được 100 lần/phút
      { name: 'default', ttl: 60_000, limit: 100 },
      // Quy tắc 2: API ghi dữ liệu (không phải GET) chỉ được 30 lần/phút
      {
        name: 'write',
        ttl: 60_000,
        limit: 30,
        skipIf: (ctx) => ctx.switchToHttp().getRequest().method === 'GET',
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        inject: [ConfigService],
        useFactory: (c: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: c.get('AUTH_SERVICE_HOST', '127.0.0.1'),
            port: Number(c.get('AUTH_SERVICE_PORT', 3001)),
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    PermissionsService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },            // 1. Xác thực JWT (gán req.user)
    { provide: APP_GUARD, useClass: AppThrottlerGuard },       // 2. Giới hạn số lần gọi API
    { provide: APP_GUARD, useClass: MustChangePasswordGuard }, // 3. Chặn ngay nếu chưa đổi mật khẩu
    { provide: APP_GUARD, useClass: PermissionGuard },         // 4. Phân quyền chi tiết (sau khi user đã hợp lệ)
  ],
})
export class AuthModule {}