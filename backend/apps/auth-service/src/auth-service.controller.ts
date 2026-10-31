import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth-service.service.js';
import { ChangePasswordDto, CreateUsersDto, LoginDto, RefreshDto } from './dto/auth.dto.js';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) { }

  @MessagePattern({ cmd: 'auth.login' })
  login(@Payload() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @MessagePattern({ cmd: 'auth.refresh' })
  refresh(@Payload() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @MessagePattern({ cmd: 'auth.logout' })
  logout(@Payload() dto: Partial<RefreshDto>) {
    return this.auth.logout(dto.refreshToken);
  }

  @MessagePattern({ cmd: 'auth.me' })
  me(@Payload() d: { userId: string }) {
    return this.auth.getMe(d.userId);
  }

  @MessagePattern({ cmd: 'auth.permissions' })
  permissions(@Payload() d: { userId: string }) {
    return this.auth.getPermissions(d.userId);
  }

  @MessagePattern({ cmd: 'auth.change-password' })
  changePassword(@Payload() d: { userId: string } & ChangePasswordDto) {
    const { userId, ...dto } = d;
    return this.auth.changePassword(userId, dto);
  }

  @MessagePattern({ cmd: 'auth.create-users' })
  createUsers(@Payload() dto: CreateUsersDto) {
    return this.auth.createUsers(dto);
  }

  @MessagePattern({ cmd: 'auth.find-users' })
  findUsers(@Payload() d: { usernames: string[] }) {
    return this.auth.findUsers(d.usernames);
  }

  @MessagePattern({ cmd: 'auth.set-active' })
  setActive(@Payload() d: { userId: string; isActive: boolean }) {
    return this.auth.setActive(d.userId, d.isActive);
  }

  @MessagePattern({ cmd: 'auth.find-emails' })
  findEmails(@Payload() d: { emails: string[] }) {
    return this.auth.findEmailOwners(d.emails);
  }

  @MessagePattern({ cmd: 'auth.get-users-by-role' })
  getUsersByRole(@Payload() d: { role: string }) {
    return this.auth.getUsersByRole(d.role);
  }
}
