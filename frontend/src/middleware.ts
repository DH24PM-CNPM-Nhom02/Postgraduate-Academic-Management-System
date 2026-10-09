/**
 * middleware.ts — RBAC Route Protection
 *
 * Chặn route theo role decoded từ JWT.
 * Không chỉ ẩn menu — phải chặn cả URL trực tiếp.
 *
 * RBAC 6 role: NCS, GVHD, GIAO_VU, DON_VI_CHUYEN_MON, HOI_DONG, ADMIN
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route group → allowed roles mapping
 */
const ROUTE_GROUP_ROLES: Record<string, string[]> = {
  "(student)": ["NCS"],
  "(supervisor)": ["GVHD"],
  "(academic)": ["GIAO_VU", "DON_VI_CHUYEN_MON"],
  "(committee)": ["HOI_DONG"],
  "(admin)": ["ADMIN"],
};

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = ["/login", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // TODO: Decode JWT from HttpOnly cookie and check role
  // const token = request.cookies.get("access_token")?.value;
  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // TODO: Verify role against route group
  // const userRole = decodeJWT(token).role;
  // const routeGroup = getRouteGroup(pathname);
  // if (routeGroup && !ROUTE_GROUP_ROLES[routeGroup]?.includes(userRole)) {
  //   return NextResponse.redirect(new URL("/unauthorized", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
