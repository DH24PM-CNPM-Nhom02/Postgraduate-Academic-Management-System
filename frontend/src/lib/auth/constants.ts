/**
 * lib/auth — JWT helpers & auth utilities
 *
 * - JWT 15 phút lưu trong HttpOnly Cookie — không lưu localStorage
 * - Auto-refresh: route handler /api/auth/refresh gọi ngầm trước khi token hết hạn
 * - RBAC 4 role: ADMIN, GIAO_VU, GVHD, NCS
 */

export type UserRole =
  | "ADMIN"
  | "GIAO_VU"
  | "GVHD"
  | "NCS";

/**
 * Role-based route mapping
 * Mỗi route group chỉ cho phép role tương ứng.
 */
export const ROLE_ROUTES: Record<UserRole, string> = {
  NCS: "/(student)",
  GVHD: "/(supervisor)",
  GIAO_VU: "/(academic)",
  ADMIN: "/(admin)",
};

/**
 * Route group → allowed roles mapping (cho middleware)
 */
export const ROUTE_GROUP_ROLES: Record<string, UserRole[]> = {
  "(student)": ["NCS"],
  "(supervisor)": ["GVHD"],
  "(academic)": ["GIAO_VU"],
  "(committee)": ["GIAO_VU"],
  "(admin)": ["ADMIN"],
};
