import { auth } from "@/src/auth";
import { NextResponse } from "next/server";


export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico|$).*)",
    ],
};

const PUBLIC_ROUTES = ["/login", "/forgot-password"];

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;
    
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/forgot-password");
    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    // Lấy error do hàm jwt bên auth.ts ghi đè (nếu refreshToken hết hạn/lỗi)
    const authError = (req.auth)?.error;

    // 1. REFRESH TOKEN THẤT BẠI
    if (authError === "RefreshTokenError") {
        if (!isPublicRoute && !isAuthPage) {
            return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
        }
        return NextResponse.next();
    }

    // 2. CHƯA ĐĂNG NHẬP
    if (!isLoggedIn) {
        if (isAuthPage || isPublicRoute) {
            return NextResponse.next();
        }
        // Protected route -> redirect to login
        return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }

    // 3. ĐÃ ĐĂNG NHẬP MÀ TRUY CẬP TRANG LOGIN
    if (isAuthPage) {
        return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }

    // 4. KIỂM TRA QUYỀN (RBAC) DỰA TRÊN ROLE & ROUTE_GROUP
    // Ví dụ, /student/... -> student group
    // TODO: implement strict RBAC matching
    // Object.entries(ROUTE_GROUP_ROLES).forEach(([group, allowedRoles]) => { ... })

    return NextResponse.next();
});
