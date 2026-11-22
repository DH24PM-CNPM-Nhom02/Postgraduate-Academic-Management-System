import { BadRequestException, Body, Controller, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout } from "rxjs";
import { Public } from "../common/decorators/public.decorator.js";
import { RequirePermissions } from "../common/decorators/require-permissions.decorator.js";
import {
  LoginDto,
  RefreshDto,
  ChangePasswordDto,
  CreateUsersDto,
  ListUsersQueryDto,
  SetUserStatusDto,
} from '../../../../lib/contracts/src/dto/auth.dto.js';
import { PERMISSIONS, ROLES } from '../../../../lib/contracts/src/permissions.js';
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import type { AuthUser } from "../common/interface/auth-user.interface.js";
import { AllowMustChange } from "../common/decorators/must-change-password.decorator.js";
import { LimitStrict, LimitMedium, SkipAllLimits } from '../common/decorators/rate-limit.decorator.js';
import { PermissionsService } from './services/permissions.service.js';
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private auth: ClientProxy,
    private permissionsService: PermissionsService,
  ) {}

  private send<T>(cmd: string, payload: unknown) {
    return firstValueFrom(this.auth.send<T>({ cmd }, payload).pipe(timeout(5000)));
  }

  @Public() 
  @LimitStrict()
  @Post('login')
  login(@Body() dto: LoginDto) { 
    return this.send('auth.login', dto); 
  }

  @Public() 
  @AllowMustChange()
  @SkipAllLimits()
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) { 
    return this.send('auth.refresh', dto); 
  }

  @Public() 
  @AllowMustChange()
  @SkipAllLimits()
  @Post('logout')
  logout(@Body() dto: RefreshDto) { return this.send('auth.logout', dto); }

  @AllowMustChange()
  @Get('me')
  me(@CurrentUser() u: AuthUser) { return this.send('auth.me', { userId: u.id }); }

  @AllowMustChange()
  @LimitStrict()
  @Post('change-password')
  changePassword(@CurrentUser() u: AuthUser, @Body() dto: ChangePasswordDto) {
    return this.send('auth.change-password', { userId: u.id, ...dto });
  }

  @Post('users')
  @LimitMedium()
  @RequirePermissions(PERMISSIONS.USER_CREATE)
  createUsers(@CurrentUser() u: AuthUser, @Body() dto: CreateUsersDto) {
    if (dto.users.some(({ role }) => role !== ROLES.ADMIN && role !== ROLES.GIAO_VU)) {
      throw new BadRequestException(
        'Chỉ có thể tạo trực tiếp tài khoản Quản trị viên hoặc Giáo vụ. Tài khoản NCS/GVHD được cấp khi nhập hồ sơ.',
      );
    }

    return this.send('auth.create-users', { actorId: u.id, actorRoles: u.roles, users: dto.users });
  }

  @Get('users')
  @RequirePermissions(PERMISSIONS.USER_READ)
  listUsers(@Query() query: ListUsersQueryDto) {
    return this.send('auth.list-users', query);
  }

  @Get('users/:id')
  @RequirePermissions(PERMISSIONS.USER_READ)
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.send('auth.get-user', { id });
  }

  @Patch('users/:id/status')
  @RequirePermissions(PERMISSIONS.USER_UPDATE)
  async setUserStatus(@CurrentUser() u: AuthUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: SetUserStatusDto) {
    const result = await this.send('auth.set-user-status', { actorId: u.id, targetId: id, isActive: dto.isActive });
    this.permissionsService.invalidate(id);
    return result;
  }

  @Patch('users/:id/reset-password')
  @LimitMedium()
  @RequirePermissions(PERMISSIONS.USER_RESET_PASSWORD)
  resetPassword(@CurrentUser() u: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.send('auth.reset-password', { actorRoles: u.roles, targetId: id });
  }
}
