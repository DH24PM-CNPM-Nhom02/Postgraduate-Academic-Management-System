// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { AUTH_SERVICE } from '../common/constants/service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { AuthController } from './auth.controller.js';
import { PermissionGuard } from './guards/permission.guard.js';
import { PermissionsService } from './services/permissions.service.js';
import { MustChangePasswordGuard } from './guards/mustChangePassword.guard.js';


@Module({
  imports: [
    PassportModule,
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
    { provide: APP_GUARD, useClass: MustChangePasswordGuard }, // 2. Chặn ngay nếu chưa đổi mật khẩu
    { provide: APP_GUARD, useClass: PermissionGuard },         // 3. Phân quyền chi tiết (sau khi user đã hợp lệ)
  ],
})
export class AuthModule {}