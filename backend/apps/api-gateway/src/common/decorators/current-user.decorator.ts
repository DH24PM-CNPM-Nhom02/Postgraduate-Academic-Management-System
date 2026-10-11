import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthUser } from "../interface/auth-user.interface.js";

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser => ctx.switchToHttp().getRequest().user,
);