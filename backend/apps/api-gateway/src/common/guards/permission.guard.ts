import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../../common/decorators/require-permissions.decorator.js";
import { AuthUser } from "../../common/interface/auth-user.interface.js";
import { ROLES } from "../../../../../lib/contracts/src/permissions.js";
import { PermissionsService } from "../../auth/services/permissions.service.js";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (!required?.length) return true;

    const user: AuthUser | undefined = ctx.switchToHttp().getRequest().user;
    if (!user?.id) throw new UnauthorizedException();

    // Lấy quyền thực tế từ Auth Service (tự động kiểm tra isActive / deletedAt)
    const perms = await this.permissionsService.get(user.id);
    if (!perms || perms.size === 0) {
      throw new ForbiddenException('Bạn không có quyền truy cập vào tài nguyên này');
    }

    // Admin đang hoạt động có toàn quyền truy cập
    if (user.roles?.includes(ROLES.ADMIN)) return true;

    if (!required.every((p) => perms.has(p))) {
      throw new ForbiddenException('Bạn không có quyền truy cập vào tài nguyên này');
    }
    return true;
  }
}