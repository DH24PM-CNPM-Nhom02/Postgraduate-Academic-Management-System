/**
 * types/ — OpenAPI TypeScript codegen output
 *
 * Đồng bộ type với Swagger backend bằng openapi-typescript.
 *
 * Chạy codegen:
 *   npx openapi-typescript http://localhost:8080/v3/api-docs -o src/types/api.ts
 */

// Placeholder types — sẽ được generate từ OpenAPI spec

// ==========================================
// 1. MỐC VÀ TIẾN TRÌNH ĐÀO TẠO (Luồng 9 mốc)
// ==========================================

/** Trạng thái của một mốc đào tạo (tienTrinh.trangThai) */
export type MilestoneStatus =
  | "LOCKED"
  | "UNLOCKED"
  | "PENDING_REVIEW"
  | "REJECTED"
  | "PASSED"
  | "PENDING"; // Alias hỗ trợ backward compatibility

/** Trạng thái của một lần nộp minh chứng (minhChungs[].trangThai) */
export type MinhChungStatus = "PENDING_REVIEW" | "PASSED" | "REJECTED";

/** Thông tin định nghĩa mốc đào tạo (1 đến 9) */
export interface Moc {
  id?: string;
  thuTu: number; // 1 đến 9
  tenMoc: string;
  moTa?: string;
  yeuCauDiem: boolean; // Mốc 2, 4, 5 yêu cầu điểm
}

/** Chi tiết một lần nộp minh chứng mốc */
export interface MinhChung {
  id: string; // minhChungId
  lanNop: number;
  fileId: string;
  ghiChuNcs?: string;
  trangThai: MinhChungStatus;
  diemTrungBinh?: number | string | null;
  lyDoTuChoi?: string | null;
  ngayNop: string;
  ngayDuyet?: string | null;
}

/** Tiến trình của một mốc đối với NCS */
export interface TienTrinh {
  id: string; // tienTrinhId
  trangThai: MilestoneStatus;
  openedAt?: string | null;
  submittedAt?: string | null;
  passedAt?: string | null;
  moc: Moc;
  coTheNop: boolean;
  minhChungs: MinhChung[];
}

/** Thông tin cơ bản của NCS */
export interface NcsProfile {
  id: string;
  mshv: string;
  hoTen: string;
  lop?: string;
  trangThai?: string;
}

/** Response từ GET /progress/me */
export interface ProgressMeResponse {
  ncs: NcsProfile;
  tienTrinhs: TienTrinh[];
}

/** Dòng trong hàng chờ duyệt mốc: GET /progress/pending */
export interface PendingProgressItem {
  id: string; // tienTrinhId
  submittedAt: string;
  ncs: NcsProfile;
  moc: Moc;
  minhChungMoiNhat: {
    id: string; // minhChungId
    lanNop: number;
    fileId: string;
    ghiChuNcs?: string;
    ngayNop: string;
    _count?: {
      phieuNhanXets: number;
    };
  };
}

// ==========================================
// 2. PHIẾU NHẬN XÉT & ĐIỂM (Mốc 2, 4, 5)
// ==========================================

export interface PhieuNhanXet {
  id: string;
  tenNguoiCham: string;
  donViNguoiCham?: string;
  diem: number | string;
  nhanXet?: string;
  nhapBoiId?: string;
  createdAt: string;
}

export interface TongHopDiem {
  soPhieu: number;
  soPhieuToiThieu: number; // tối thiểu 3
  diemTrungBinh: number | string | null;
  duPhieu: boolean;
}

export interface EvaluationsResponse {
  phieus: PhieuNhanXet[];
  tongHop: TongHopDiem;
}

export interface CreateEvaluationInput {
  tenNguoiCham: string;
  donViNguoiCham?: string;
  diem: number;
  nhanXet?: string;
  xacNhanTrung?: boolean;
}

// ==========================================
// 3. QUYẾT ĐỊNH HỌC VỤ & DUYỆT MỐC
// ==========================================

export type DecisionType =
  | "GIAO_DE_TAI"
  | "PHAN_CONG_GVHD"
  | "THANH_LAP_TIEU_BAN"
  | "CAN_CU_DUYET_MOC"
  | "CONG_NHAN_TOT_NGHIEP"
  | "GIA_HAN"
  | "BAO_LUU"
  | "NGUNG_HOC"
  | "BUOC_THOI_HOC"
  | "KHAC";

export type DecisionStatus = "HIEU_LUC" | "DEACTIVATE";

export interface QuyetDinh {
  id: string;
  ncsId?: string | null;
  loai: DecisionType;
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  fileId?: string | null;
  ghiChu?: string | null;
  trangThai?: DecisionStatus;
  hanMoi?: string | null;
  ncs?: NcsProfile;
}

export interface CreateDecisionInput {
  loai: DecisionType;
  soQuyetDinh: string;
  ngayQuyetDinh: string;
  ncsIds?: string[];
  fileId?: string;
  ghiChu?: string;
  hanMoi?: string;
}

export interface CreateDecisionResponse {
  quyetDinhs: QuyetDinh[];
  canhBao?: string[];
}

export interface ApproveMilestoneRequest {
  quyetDinhId: string;
}

export interface ApproveMilestoneResponse {
  tienTrinhId: string;
  trangThai: "PASSED";
  diemTrungBinh?: number | null;
  mocKeTiep?: number | null;
}

export interface RejectMilestoneRequest {
  lyDo: string;
}

export interface RejectMilestoneResponse {
  tienTrinhId: string;
  trangThai: "REJECTED";
}

// ==========================================
// 4. TÀI LIỆU & FILE UPLOAD
// ==========================================

export type DocumentType = "MINH_CHUNG_MOC" | "QUYET_DINH" | "KHAC";

export interface UploadDocumentResponse {
  id: string; // fileId
  filename?: string;
  originalName?: string;
  documentType: DocumentType;
  fileSize?: number;
  uploadedAt?: string;
}

// ==========================================
// 5. CÁC KIỂU DỮ LIỆU CŨ (DUY TRÌ TƯƠNG THÍCH)
// ==========================================

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

/** Thông tin mốc đào tạo tương thích cũ */
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

