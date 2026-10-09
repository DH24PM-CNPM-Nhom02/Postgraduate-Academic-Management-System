/**
 * lib/auth — JWT helpers & auth utilities
 *
 * - JWT 15 phút lưu trong HttpOnly Cookie — không lưu localStorage
 * - Auto-refresh: route handler /api/auth/refresh gọi ngầm trước khi token hết hạn
 * - RBAC 6 role: NCS, GVHD, GIAO_VU, DON_VI_CHUYEN_MON, HOI_DONG, ADMIN
 */

export type UserRole =
  | "NCS"
  | "GVHD"
  | "GIAO_VU"
  | "DON_VI_CHUYEN_MON"
  | "HOI_DONG"
  | "ADMIN";

/**
 * Role-based route mapping
 * Mỗi route group chỉ cho phép role tương ứng.
 */
export const ROLE_ROUTES: Record<UserRole, string> = {
  NCS: "/(student)",
  GVHD: "/(supervisor)",
  GIAO_VU: "/(academic)",
  DON_VI_CHUYEN_MON: "/(academic)",
  HOI_DONG: "/(committee)",
  ADMIN: "/(admin)",
};

/**
 * Route group → allowed roles mapping (cho middleware)
 */
export const ROUTE_GROUP_ROLES: Record<string, UserRole[]> = {
  "(student)": ["NCS"],
  "(supervisor)": ["GVHD"],
  "(academic)": ["GIAO_VU", "DON_VI_CHUYEN_MON"],
  "(committee)": ["HOI_DONG"],
  "(admin)": ["ADMIN"],
};
