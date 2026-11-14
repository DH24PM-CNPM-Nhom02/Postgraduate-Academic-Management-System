import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ALLOW_MUST_CHANGE_KEY } from "../../common/decorators/must-change-password.decorator.js";
import { IS_PUBLIC_KEY } from "../../common/decorators/public.decorator.js";

@Injectable()
export class MustChangePasswordGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        //Cho qua nếu là route Public (không yêu cầu đăng nhập)
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        //Cho qua nếu route hoặc controller có @AllowMustChange()
        const allow = this.reflector.getAllAndOverride<boolean>(ALLOW_MUST_CHANGE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (allow) return true;

        //Kiểm tra cờ mustChangePassword của người dùng trong Access Token
        const user = context.switchToHttp().getRequest().user;
        if (user?.mustChangePassword) {
            throw new ForbiddenException('Bạn cần đổi mật khẩu trước khi sử dụng hệ thống');
        }
        return true;
    }
}