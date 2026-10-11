import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout } from "rxjs";
import { Public } from "../common/decorators/public.decorator.js";
import { RequirePermissions } from "../common/decorators/require-permissions.decorator.js";
import {
  LoginDto,
  RefreshDto,
  ChangePasswordDto,
  CreateUsersDto,
} from '../../../../lib/contracts/src/dto/auth.dto.js';
import { PERMISSIONS } from '../../../../lib/contracts/src/permissions.js';
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import type { AuthUser } from "../common/interface/auth-user.interface.js";

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private auth: ClientProxy) {}

  private send<T>(cmd: string, payload: unknown) {
    return firstValueFrom(this.auth.send<T>({ cmd }, payload).pipe(timeout(5000)));
  }

  @Public() 
  @Post('login')
  login(@Body() dto: LoginDto) { 
    return this.send('auth.login', dto); 
  }

  @Public() 
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) { 
    return this.send('auth.refresh', dto); 
  }

  @Public() 
  @Post('logout')
  logout(@Body() dto: RefreshDto) { return this.send('auth.logout', dto); }

  @Get('me')
  me(@CurrentUser() u: AuthUser) { return this.send('auth.me', { userId: u.id }); }

  @Post('change-password')
  changePassword(@CurrentUser() u: AuthUser, @Body() dto: ChangePasswordDto) {
    return this.send('auth.change-password', { userId: u.id, ...dto });
  }

  @Post('users')
  @RequirePermissions(PERMISSIONS.USER_CREATE)
  createUsers(@Body() dto: CreateUsersDto) { return this.send('auth.create-users', dto); }
}