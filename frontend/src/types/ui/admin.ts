/**
 * UI Types cho phân hệ Quản trị Hệ thống (Admin Console - `(admin)`).
 * Phục vụ cho các màn hình:
 * - `/users`: Quản lý người dùng & RBAC
 * - `/system`: Cấu hình tham số đào tạo & Danh mục WoS/Scopus/HĐGSNN
 * - `/audit-log`: Nhật ký kiểm toán hệ thống & Visual Diff
 */

export type SystemRole = "ADMIN" | "GIAO_VU" | "GVHD" | "NCS";

export type AdminUserStatus = "ACTIVE" | "LOCKED";

/**
 * Bản ghi người dùng hiển thị trong bảng Quản lý tài khoản (`/users`)
 */
export interface AdminUserItem {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: SystemRole;
  status: AdminUserStatus;
  /** Đơn vị công tác / Khoa / Phòng ban */
  department?: string;
  /** Học hàm, học vị (dành cho GVHD) */
  academicTitle?: string;
  /** Mã số học viên (dành cho NCS) */
  studentCode?: string;
  /** Thời điểm tạo tài khoản (ISO string) */
  createdAt: string;
  /** Thời điểm đăng nhập gần nhất (ISO string hoặc null nếu chưa đăng nhập) */
  lastLoginAt?: string | null;
  /** Lý do khóa tài khoản (nếu status === "LOCKED") */
  lockedReason?: string | null;
}

/**
 * Thống kê tổng hợp người dùng theo trạng thái & vai trò (`/users`)
 */
export interface UserStatsSummary {
  totalUsers: number;
  activeUsers: number;
  lockedUsers: number;
  byRole: Record<SystemRole, number>;
}

/**
 * Dữ liệu form tạo mới tài khoản người dùng (`/users`)
 */
export interface CreateUserFormValues {
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: SystemRole;
  department?: string;
  academicTitle?: string;
  studentCode?: string;
  temporaryPassword: string;
  sendWelcomeEmail: boolean;
}

export type JournalCategory =
  | "WOS_Q1_Q2"
  | "WOS_SCOPUS_KHAC"
  | "CHUONG_SACH_QUOC_TE"
  | "HDGSNN_075";

export type JournalQuartile = "Q1" | "Q2" | "Q3" | "Q4";

/**
 * Bản ghi danh mục tạp chí / ấn phẩm khoa học chuẩn hóa (`/system`)
 */
export interface JournalCatalogItem {
  id: string;
  issn: string;
  eIssn?: string;
  name: string;
  publisher: string;
  category: JournalCategory;
  quartile?: JournalQuartile | null;
  impactFactor?: number | null;
  /** Điểm quy đổi tối đa theo quy chế (vd: 1.0, 0.75, 0.5) */
  scorePoint: number;
  /** Ngành / Lĩnh vực chuyên môn áp dụng */
  academicField: string;
  /** Năm học / năm ban hành áp dụng danh mục */
  effectiveYear: number;
  isActive: boolean;
  updatedAt: string;
  notes?: string;
}

/**
 * Cấu hình tham số quy chế đào tạo Tiến sĩ mặc định (`/system`)
 */
export interface SystemParametersConfig {
  /** Thời gian đào tạo chuẩn đối với NCS có bằng Thạc sĩ (tháng, mặc định 36) */
  standardDurationMasterHolderMonths: number;
  /** Thời gian đào tạo chuẩn đối với NCS từ trình độ Cử nhân (tháng, mặc định 48) */
  standardDurationBachelorHolderMonths: number;
  /** Thời gian gia hạn tích lũy tối đa (tháng, mặc định 24) */
  maxExtensionMonths: number;
  /** Tổng thời gian đào tạo tối đa không vượt quá (tháng, mặc định 72) */
  maxTotalTrainingMonths: number;
  /** Định mức hướng dẫn tối đa cho Giáo sư (mặc định 5) */
  quotaProfessor: number;
  /** Định mức hướng dẫn tối đa cho Phó Giáo sư (mặc định 4) */
  quotaAssociateProfessor: number;
  /** Định mức hướng dẫn tối đa cho Tiến sĩ (mặc định 3) */
  quotaDoctor: number;
  /** Trọng số quy đổi Hướng dẫn chính (mặc định 1.0) */
  mainSupervisorWeight: number;
  /** Trọng số quy đổi Đồng hướng dẫn (mặc định 0.5) */
  coSupervisorWeight: number;
  /** Điểm công bố khoa học tối thiểu (mặc định 2.0) */
  minPublicationScore: number;
  /** Thời hạn tối thiểu trước khi hết hạn chuẩn để nộp đơn gia hạn (tháng) */
  minRemainingMonthsForExtension: number;
  /** Thời hạn khóa học tối thiểu còn lại để được đổi GVHD (tháng) */
  minRemainingMonthsForSupervisorChange: number;
  updatedAt: string;
  updatedBy?: string;
}

/**
 * Thông tin cơ sở đào tạo & cơ quan ban hành quyết định (`/system`)
 */
export interface InstitutionInfoConfig {
  universityName: string;
  universityCode: string;
  departmentName: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  rectorOrSignerName: string;
  rectorOrSignerTitle: string;
  academicYear: string;
  updatedAt: string;
}

/**
 * Đầy đủ mã hành động kiểm toán trong hệ thống (`/audit-log`)
 */
export type AuditActionType =
  | "NCS_CREATE"
  | "NCS_IMPORT"
  | "NCS_UPDATE"
  | "NCS_STATUS_UPDATE"
  | "THESIS_ASSIGN"
  | "THESIS_CANCEL"
  | "ASSIGNMENT_CREATE"
  | "ASSIGNMENT_DEACTIVATE"
  | "SUBMIT_PROGRESS"
  | "APPROVE_PROGRESS"
  | "REJECT_PROGRESS"
  | "TAO_QUYET_DINH"
  | "VO_HIEU_QUYET_DINH"
  | "CHANGE_REQUEST_CREATE"
  | "CHANGE_REQUEST_GVHD_APPROVE"
  | "CHANGE_REQUEST_APPROVE"
  | "CHANGE_REQUEST_REJECT"
  | "CHANGE_REQUEST_CANCEL"
  | "XAC_NHAN_TOT_NGHIEP";

/**
 * Thông tin người thực hiện thao tác trong nhật ký kiểm toán
 */
export interface AuditActorView {
  id: string;
  username: string;
  fullName: string;
  role: SystemRole;
}

/**
 * Thông tin NCS liên quan đến bản ghi kiểm toán (nếu có)
 */
export interface AuditNcsView {
  id: string;
  mshv: string;
  fullName: string;
  cohort?: string;
}

/**
 * Bản ghi nhật ký thao tác hệ thống (`/audit-log`)
 */
export interface AuditLogItem {
  id: string;
  action: AuditActionType;
  entityType: string;
  entityId: string;
  summary: string;
  actor: AuditActorView;
  ncs?: AuditNcsView | null;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
}
