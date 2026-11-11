import type { EvidenceStatus, MilestoneProgressItem } from "./progress";
import type {
  CandidateSupervisorOption,
  ChangeRequestAttachment,
  ChangeRequestDecision,
  ChangeRequestStatus,
  SupervisorOpinionItem,
} from "./change-request";

/**
 * UI Types cho phân hệ Giảng viên Hướng dẫn (GVHD - Supervisor).
 * Quy chuẩn tách biệt khỏi cổng Giáo vụ `(academic)` và không phụ thuộc `src/types/api/`.
 */

export type SupervisorRole = "HUONG_DAN_CHINH" | "DONG_HUONG_DAN";

export const SUPERVISOR_ROLE_WEIGHTS: Record<SupervisorRole, number> = {
  HUONG_DAN_CHINH: 1.0,
  DONG_HUONG_DAN: 0.5,
};

export type QuotaWarningLevel = "SAFE" | "WARNING" | "FULL" | "EXCEEDED";

export type SupervisedStudentStatus =
  | "DANG_THUC_HIEN"
  | "CHO_DUYET"
  | "CAN_HOAN_THIEN"
  | "TOT_NGHIEP"
  | "TAM_DUNG";

/**
 * Hồ sơ định mức hướng dẫn của Giảng viên (Quy chế BR-09: Chính = 1.0, Phụ = 0.5)
 */
export interface SupervisorQuota {
  hanMucToiDa: number;
  soLuongHuongDanChinh: number;
  soLuongDongHuongDan: number;
  trongSoChinh: number;
  trongSoPhu: number;
  tongTrongSo: number;
  trongSoConLai: number;
  tyLeSuDungPhanTram: number;
  mucCanhBao: QuotaWarningLevel;
  ghiChuCanhBao?: string;
}

/**
 * Thông tin hồ sơ cơ bản của Giảng viên Hướng dẫn
 */
export interface SupervisorProfile {
  id: string;
  hoTen: string;
  hocHamHocVi: string;
  maCanBo: string;
  donVi: string;
  chuyenMon: string;
  email: string;
  soDienThoai: string;
}

/**
 * Thông tin mốc bị từ chối cần NCS hoàn thiện lại (tóm tắt trên bảng & drawer)
 */
export interface SupervisedStudentRejectedInfo {
  mocSo: number;
  tenMoc: string;
  lyDoTuChoi: string;
  nguoiDuyet: string;
  ngayDuyet: string;
}

/**
 * Bản ghi Nghiên cứu sinh đang được GVHD phụ trách
 */
export interface SupervisedStudent {
  id: string;
  mshv: string;
  hoTen: string;
  lop: string;
  nganh: string;
  chuyenNganh: string;
  khoaDaoTao: string;
  tenDeTai: string;
  trangThaiHocTap: SupervisedStudentStatus;
  mocHienTai: number;
  tenMocHienTai: string;
  soMocHoanThanh: number;
  tongSoMoc: number;
  tienDoPhanTram: number;
  vaiTro: SupervisorRole;
  trongSo: number;
  gvhdDongHuongDan?: string;
  soQuyetDinhPhanCong: string;
  ngayPhanCong: string;
  ngayNhapHoc: string;
  soThangConLai: number;
  coMocCanHoanThien: boolean;
  thongTinMocTuChoi?: SupervisedStudentRejectedInfo;
  milestones: MilestoneProgressItem[];
}

/**
 * Kịch bản mẫu định mức hướng dẫn để kiểm thử giao diện theo ngưỡng
 */
export interface QuotaScenarioOption {
  id: string;
  label: string;
  description: string;
  quota: SupervisorQuota;
}

export interface QuotaBarProps {
  quota: SupervisorQuota;
  compact?: boolean;
  showDetails?: boolean;
  isLoading?: boolean;
  className?: string;
}

export interface SupervisorStatsBannerProps {
  profile: SupervisorProfile;
  quota: SupervisorQuota;
  students: SupervisedStudent[];
  isLoading?: boolean;
}

export interface StudentListTableProps {
  students: SupervisedStudent[];
  selectedStudentId?: string | null;
  onSelectStudent: (student: SupervisedStudent) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  title?: string;
  subtitle?: string;
}

export interface StudentProgressDrawerProps {
  student: SupervisedStudent | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface SupervisorDashboardContainerProps {
  profile?: SupervisorProfile;
  quota?: SupervisorQuota;
  students?: SupervisedStudent[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export interface SupervisorStudentsWorkspaceProps {
  students: SupervisedStudent[];
  quota: SupervisorQuota;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export interface SupervisorQuotaWorkspaceProps {
  profile: SupervisorProfile;
  quota: SupervisorQuota;
  students: SupervisedStudent[];
  scenarios?: QuotaScenarioOption[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}


/**
 * Bản ghi báo cáo tiến độ / minh chứng mốc đào tạo do NCS đã nộp để GVHD theo dõi
 */
export interface SupervisorProgressReportItem {
  id: string;
  studentId: string;
  mshv: string;
  hoTenNcs: string;
  khoaDaoTao: string;
  tenDeTai: string;
  vaiTro: SupervisorRole;
  mocSo: number;
  tenMoc: string;
  lanNop: number;
  ngayNop: string;
  ngayDuyet?: string;
  nguoiDuyet?: string;
  diemTrungBinh?: string | number;
  trangThai: EvidenceStatus;
  ghiChuNcs?: string;
  nhanXetGvhd?: string;
  lyDoTuChoi?: string;
  fileName: string;
  fileSize?: number;
  fileUrl?: string;
}

export interface SupervisorProgressReportsWorkspaceProps {
  reports: SupervisorProgressReportItem[];
  students?: SupervisedStudent[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export type SupervisorExtensionDecisionAction = "DONG_Y" | "TU_CHOI";

/**
 * Bản ghi đơn xin gia hạn học tập của NCS gửi qua GVHD thẩm định chuyên môn
 */
export interface SupervisorExtensionRequestItem {
  id: string;
  maDon: string;
  studentId: string;
  mshv: string;
  hoTenNcs: string;
  khoaDaoTao: string;
  tenDeTai: string;
  vaiTroCuaToi: SupervisorRole;
  trangThai: ChangeRequestStatus;
  ngayGui: string;
  soThangGiaHan: number;
  hanHienTai: string;
  hanMoiDuKien: string;
  tongThangDaGiaHanTruocDo: number;
  mocHienTai: number;
  tenMocHienTai: string;
  tienDoPhanTram: number;
  lyDo: string;
  tepDinhKem: ChangeRequestAttachment;
  xacNhanGvhds: SupervisorOpinionItem[];
  yKienCuaToi?: SupervisorOpinionItem | null;
  nhanXetGvhd?: string | null;
  thoiGianPhanHoiCuaToi?: string | null;
  quyetDinh?: ChangeRequestDecision | null;
  lyDoTuChoi?: string | null;
}

export interface SupervisorExtensionsWorkspaceProps {
  requests: SupervisorExtensionRequestItem[];
  currentSupervisorId?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onReviewExtension?: (
    requestId: string,
    action: SupervisorExtensionDecisionAction,
    comment: string
  ) => void | Promise<void>;
}

export type SupervisorProxyRequestType = "DOI_DE_TAI" | "DOI_GVHD";

/**
 * Bản ghi đơn đề xuất thay đổi đề tài / đổi GVHD do GVHD tạo thay NCS
 */
export interface SupervisorProxyRequestItem {
  id: string;
  maDon: string;
  loaiDon: SupervisorProxyRequestType;
  trangThai: ChangeRequestStatus;
  studentId: string;
  mshv: string;
  hoTenNcs: string;
  khoaDaoTao: string;
  nguoiDeXuat: string;
  vaiTroCuaToi: SupervisorRole;
  ngayGui: string;
  ngayCapNhat?: string;
  lyDo: string;
  batKhaKhang?: boolean;
  tenDeTaiCu?: string;
  tenDeTaiMoi?: string;
  vaiTroGvhdCanThay?: SupervisorRole;
  tenGvhdCu?: string;
  gvhdMoiId?: string;
  tenGvhdMoi?: string;
  donViGvhdMoi?: string;
  lyDoTuChoi?: string | null;
  tepDinhKem?: ChangeRequestAttachment | null;
  quyetDinh?: ChangeRequestDecision | null;
}

export interface SupervisorProxyRequestFormValues {
  studentId: string;
  loaiDon: SupervisorProxyRequestType;
  lyDo: string;
  batKhaKhang: boolean;
  tenDeTaiMoi?: string;
  vaiTroGvhdCanThay?: SupervisorRole;
  tenGvhdCu?: string;
  gvhdMoiId?: string;
  tepDinhKemFile: File | null;
}

export interface SupervisorRequestsWorkspaceProps {
  requests: SupervisorProxyRequestItem[];
  students: SupervisedStudent[];
  candidateSupervisors: CandidateSupervisorOption[];
  supervisorProfile?: SupervisorProfile;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCreateRequest?: (values: SupervisorProxyRequestFormValues) => void | Promise<void>;
  onWithdrawRequest?: (requestId: string) => void | Promise<void>;
}
