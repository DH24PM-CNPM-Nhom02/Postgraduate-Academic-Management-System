import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClientProxy } from "@nestjs/microservices";
import { PERMISSIONS_KEY } from "../../common/decorators/require-permissions.decorator.js";
import { AuthUser } from "../../common/interface/auth-user.interface.js";
import { firstValueFrom, timeout } from "rxjs";

@Injectable()
export class PermissionGuard implements CanActivate {
  private cache = new Map<string, { perms: string[]; exp: number }>();

  constructor(
    private reflector: Reflector,
    @Inject('AUTH_SERVICE') private auth: ClientProxy,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (!required?.length) return true;

    const user: AuthUser | undefined = ctx.switchToHttp().getRequest().user;
    if (!user?.id) throw new UnauthorizedException();

    const perms = await this.getPermissions(user.id);
    if (!required.every((p) => perms.includes(p))) {
      throw new ForbiddenException('Bạn không có quyền truy cập vào tài nguyên này');
    }
    return true;
  }

  private async getPermissions(userId: string): Promise<string[]> {
    const hit = this.cache.get(userId);
    if (hit && hit.exp > Date.now()) return hit.perms;
    const perms = await firstValueFrom(
      this.auth.send<string[]>({ cmd: 'auth.permissions' }, { userId }).pipe(timeout(5000)),
    );
    this.cache.set(userId, { perms, exp: Date.now() + 60_000 });
    return perms;
  }
}