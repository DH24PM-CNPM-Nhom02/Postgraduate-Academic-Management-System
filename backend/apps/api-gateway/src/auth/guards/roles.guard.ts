import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator.js';
import type { AuthUser } from '../../common/interface/auth-user.interface.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = ctx.switchToHttp().getRequest();
    const user: AuthUser | undefined = request.user;

    if (!user || !user.id) {
      throw new UnauthorizedException('Chưa xác thực người dùng');
    }

    // Role ADMIN luôn có toàn quyền truy cập
    if (user.roles?.includes('ADMIN')) {
      return true;
    }

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        `Bạn không có vai trò phù hợp để thực hiện thao tác này. Yêu cầu một trong các vai trò: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
