/**
 * types/ — OpenAPI TypeScript codegen output
 *
 * Đồng bộ type với Swagger backend bằng openapi-typescript.
 *
 * Chạy codegen:
 *   npx openapi-typescript http://localhost:8080/v3/api-docs -o src/types/api.ts
 */

// Placeholder types — sẽ được generate từ OpenAPI spec

/** Trạng thái mốc đào tạo */
export type MilestoneStatus =
  | "LOCKED"
  | "UNLOCKED"
  | "PENDING"
  | "REJECTED"
  | "PASSED";

/** Vai trò người dùng */
export type UserRole =
  | "NCS"
  | "GVHD"
  | "GIAO_VU"
  | "DON_VI_CHUYEN_MON"
  | "HOI_DONG"
  | "ADMIN";

/** Thông tin người dùng cơ bản */
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

/** Thông tin mốc đào tạo */
export interface Milestone {
  id: string;
  name: string;
  order: number;
  status: MilestoneStatus;
  dueDate: string;
  completedDate?: string;
}

/** Thông tin NCS */
export interface Student {
  id: string;
  user: User;
  cohort: string;
  startDate: string;
  maxEndDate: string; // startDate + 72 tháng
  supervisorId: string;
  milestones: Milestone[];
}

/** Thông tin công bố khoa học */
export interface Publication {
  id: string;
  title: string;
  journal: string;
  issn: string;
  year: number;
  link?: string;
  score: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

/** Thông tin GVHD */
export interface Supervisor {
  id: string;
  user: User;
  currentQuota: number;
  maxQuota: number;
}
