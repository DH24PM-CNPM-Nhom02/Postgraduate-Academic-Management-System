import { auth } from "@/src/auth";
import { NextResponse } from "next/server";
import type { UserRole } from "@/src/lib/auth/constants";
import type { IUser } from "@/types/next-auth";

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|$).*)",
  ],
};

// ──────────────────────────────────────────────────────────────────────
// Trang công khai: Chỉ login & forgot-password + trang chủ landing "/"
// Tất cả các route còn lại đều yêu cầu đăng nhập.
// ──────────────────────────────────────────────────────────────────────
const AUTH_PAGES = ["/login", "/forgot-password"];

// ──────────────────────────────────────────────────────────────────────
// RBAC — Ánh xạ URL prefix → danh sách vai trò được phép truy cập.
//
// Quy ước Next.js Route Group: thư mục (admin)/ không xuất hiện trong
// URL, nên /users, /system, /audit-log thuộc nhóm (admin).
//
// Thứ tự mảng rất quan trọng: route cụ thể hơn phải đứng TRƯỚC route
// tổng quát hơn (ví dụ "/students/" trước "/student") để tránh match
// sai do startsWith.
//
// Hệ thống 4 vai trò chính:
//   ADMIN    — toàn quyền, bao gồm quản trị user, hệ thống, audit log
//   GIAO_VU  — giáo vụ/phòng đào tạo: quản lý NCS, duyệt mốc, quyết định
//   GVHD     — giảng viên hướng dẫn: xem NCS, xem mốc, duyệt đơn đề nghị
//   NCS      — nghiên cứu sinh: nộp mốc, xem tiến trình, nộp đơn đề nghị
// ──────────────────────────────────────────────────────────────────────
const ROUTE_RBAC: { prefix: string; roles: UserRole[] }[] = [
  // ── Nhóm (admin): Chỉ ADMIN ────────────────────────────────────────
  { prefix: "/admin",      roles: ["ADMIN"] },
  { prefix: "/users",      roles: ["ADMIN"] },
  { prefix: "/system",     roles: ["ADMIN"] },
  { prefix: "/audit-log",  roles: ["ADMIN"] },

  // ── Nhóm (academic): GIAO_VU (và ADMIN cho tiện vận hành) ─────────
  { prefix: "/academic-affairs", roles: ["GIAO_VU", "ADMIN"] },
  { prefix: "/academic",        roles: ["GIAO_VU", "ADMIN"] },
  { prefix: "/review-queue",    roles: ["GIAO_VU", "ADMIN"] },
  { prefix: "/blind-review",    roles: ["GIAO_VU", "ADMIN"] },
  { prefix: "/committees",      roles: ["GIAO_VU", "ADMIN"] },
  { prefix: "/graduation-check",roles: ["GIAO_VU", "ADMIN"] },
  { prefix: "/publications",    roles: ["GIAO_VU", "ADMIN"] },
  { prefix: "/supervisors",     roles: ["GIAO_VU", "ADMIN"] },

  // ── Nhóm (committee): Hội đồng đánh giá (GVHD, GIAO_VU, ADMIN) ────
  { prefix: "/review-forms", roles: ["GVHD", "GIAO_VU", "ADMIN"] },
  { prefix: "/voting",       roles: ["GVHD", "GIAO_VU", "ADMIN"] },

  // ── Nhóm (supervisor): GVHD ───────────────────────────────────────
  // Lưu ý: "/students/" (có slash cuối hoặc path con) cũng thuộc cả
  // academic (chi tiết NCS: /students/[id]) nên cho cả GIAO_VU vào.
  { prefix: "/supervisor",       roles: ["GVHD", "ADMIN"] },
  { prefix: "/progress-reports", roles: ["GVHD", "ADMIN"] },
  { prefix: "/quota",            roles: ["GVHD", "GIAO_VU", "ADMIN"] },
  { prefix: "/students",         roles: ["GVHD", "GIAO_VU", "ADMIN"] },

  // ── Nhóm (student): NCS ────────────────────────────────────────────
  { prefix: "/student",      roles: ["NCS", "ADMIN"] },
  { prefix: "/dashboard",    roles: ["NCS", "ADMIN"] },
  { prefix: "/milestones",   roles: ["NCS", "ADMIN"] },
  { prefix: "/my-publications", roles: ["NCS", "ADMIN"] },
  { prefix: "/defense",      roles: ["NCS", "ADMIN"] },
  { prefix: "/extensions",   roles: ["NCS", "ADMIN"] },
  { prefix: "/graduation",   roles: ["NCS", "ADMIN"] },
];

// ──────────────────────────────────────────────────────────────────────
// Trang mặc định sau đăng nhập cho mỗi vai trò trong 4 role chính.
// Dùng khi đăng nhập thành công hoặc bị từ chối truy cập (redirect
// về "nhà" của role thay vì 403 cứng — UX thân thiện hơn).
// ──────────────────────────────────────────────────────────────────────
const ROLE_HOME: Record<UserRole, string> = {
  NCS: "/student/progress",
  GVHD: "/supervisor",
  GIAO_VU: "/academic",
  ADMIN: "/admin",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  // Lấy error do hàm jwt bên auth.ts ghi đè (nếu refreshToken hết hạn/lỗi)
  const authError = req.auth?.error;

  // ── 1. REFRESH TOKEN THẤT BẠI ──────────────────────────────────────
  if (authError === "RefreshTokenError") {
    if (!isAuthPage) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── 2. CHƯA ĐĂNG NHẬP ─────────────────────────────────────────────
  if (!isLoggedIn) {
    // Trang auth (login, forgot-password) và trang chủ "/" → cho qua
    if (isAuthPage || pathname === "/") {
      return NextResponse.next();
    }
    // Còn lại → về login kèm callback URL để quay lại sau khi đăng nhập
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. ĐÃ ĐĂNG NHẬP MÀ TRUY CẬP TRANG AUTH ──────────────────────
  const user = req.auth?.user;
  const userRole = user?.role;

  if (isAuthPage) {
    const home = userRole ? ROLE_HOME[userRole] : "/";
    return NextResponse.redirect(new URL(home, req.nextUrl.origin));
  }

  // ── 4. TRANG CHỦ "/" → REDIRECT VỀ TRANG MẶC ĐỊNH CỦA ROLE ───────
  if (pathname === "/") {
    const home = userRole ? ROLE_HOME[userRole] : "/student/progress";
    return NextResponse.redirect(new URL(home, req.nextUrl.origin));
  }

  // ── 5. KIỂM TRA QUYỀN TRUY CẬP (RBAC) ────────────────────────────
  // Tìm rule đầu tiên khớp với pathname hiện tại
  const matchedRule = ROUTE_RBAC.find((rule) => pathname.startsWith(rule.prefix));

  if (matchedRule) {
    // Nếu có rule nhưng role không nằm trong danh sách cho phép → chặn
    if (!userRole || !matchedRule.roles.includes(userRole)) {
      // Redirect về trang chủ của role (hoặc "/" nếu không xác định role)
      const home = userRole ? ROLE_HOME[userRole] : "/login";
      return NextResponse.redirect(new URL(home, req.nextUrl.origin));
    }
  }

  // Route không nằm trong ROUTE_RBAC (ví dụ: API routes khác, ...)
  // → cho qua, để backend tự kiểm tra permission chi tiết
  return NextResponse.next();
});
