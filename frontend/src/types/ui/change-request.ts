import type {
  SupervisorAssignmentItem,
  SupervisorRoleType,
} from "./thesis";
import type { UploadStatus } from "./upload";

/**
 * UI Types cho phân hệ "Đơn đề nghị điều chỉnh & Gia hạn học tập" (NCS).
 * Tách riêng khỏi DTO backend để phục vụ render thuần UI và mock data.
 */

export type ChangeRequestType = "DOI_DE_TAI" | "DOI_GVHD" | "GIA_HAN";

export type ChangeRequestStatus =
  | "CHO_GVHD_XAC_NHAN"
  | "CHO_DUYET"
  | "DA_DUYET"
  | "TU_CHOI"
  | "DA_HUY";

export interface SupervisorOpinionItem {
  id: string;
  giangVienId: string;
  /** Họ và tên giảng viên hướng dẫn */
  tenGvhd: string;
  /** Học hàm, học vị (vd: "PGS.TS.", "TS.") */
  hocHamHocVi?: string;
  /** Vai trò hướng dẫn */
  vaiTro: SupervisorRoleType;
  /** Trạng thái đồng ý của GVHD (null = chưa phản hồi) */
  dongY: boolean | null;
  /** Nhận xét của giảng viên (nếu có) */
  nhanXet?: string | null;
  /** Thời gian phản hồi (ISO string) */
  thoiGianPhanHoi?: string | null;
}

export interface TrainingTimeSummary {
  /** Hạn đào tạo chính quy ban đầu (48 tháng, ISO string) */
  hanChinhQuy: string;
  /** Hạn sau khi đã gia hạn trước đó (nếu có, ISO string) */
  hanGiaHan?: string | null;
  /** Hạn hiện tại đang áp dụng (`hanGiaHan ?? hanChinhQuy`, ISO string) */
  hanHienTai: string;
  /** Hạn buộc thôi học / tối đa 72 tháng (ISO string) */
  hanBuocThoiHoc: string;
  /** Tổng số tháng đã được gia hạn tích lũy trước đây */
  tongThangDaGiaHan: number;
  /** Trần gia hạn tích lũy tối đa theo quy chế (mặc định 24 tháng) */
  toiDaThangTichLuy: number;
  /** Số tháng tối đa còn được phép xin ở thời điểm hiện tại */
  soThangToiDaConDuocXin: number;
  /** Đã hoàn thành Mốc 2 (Bảo vệ Đề cương nghiên cứu) */
  daDatMoc2: boolean;
  /** Còn trước hạn hiện tại tối thiểu 2 tháng */
  conTruocHanToiThieu2Thang: boolean;
  /** Đã đạt Mốc 8 (ảnh hưởng điều kiện bất khả kháng khi đổi đề tài) */
  daDatMoc8: boolean;
  /** Thời gian khóa học còn lại dưới 12 tháng (ảnh hưởng đổi GVHD) */
  conDuoi12ThangKhoaHoc: boolean;
}

export interface CandidateSupervisorOption {
  giangVienId: string;
  hoTen: string;
  hocHamHocVi: string;
  donViCongTac: string;
  linhVucNghienCuu?: string;
  /** Hạn ngạch hướng dẫn còn trống tham khảo */
  slotConLai?: number;
}

export interface ChangeRequestAttachment {
  fileName: string;
  fileUrl: string;
  fileSize?: number;
}

export interface ChangeRequestDecision {
  soQuyetDinh: string;
  ngayKy: string;
  coQuanBanHanh?: string;
  fileName: string;
  fileUrl: string;
}

export interface ChangeRequestItem {
  id: string;
  /** Mã đơn hiển thị (vd: "DN-2026-004") */
  maDon: string;
  loaiDon: ChangeRequestType;
  trangThai: ChangeRequestStatus;
  /** Thời điểm gửi đơn (ISO string) */
  ngayGui: string;
  /** Thời điểm cập nhật gần nhất (ISO string) */
  ngayCapNhat?: string;
  /** Lý do đề nghị */
  lyDo: string;
  /** Cờ xác nhận trường hợp bất khả kháng */
  batKhaKhang?: boolean;
  /** Lý do từ chối từ Phòng ĐT-SĐH / Lãnh đạo (khi status === "TU_CHOI") */
  lyDoTuChoi?: string | null;
  nguoiXuLy?: string;
  ngayXuLy?: string;

  /** Trường thông tin cho đơn DOI_DE_TAI */
  tenDeTaiCu?: string;
  tenDeTaiMoi?: string;

  /** Trường thông tin cho đơn DOI_GVHD */
  phanCongCuId?: string;
  tenGvhdCu?: string;
  vaiTroGvhdCu?: SupervisorRoleType;
  gvhdMoiId?: string;
  tenGvhdMoi?: string;
  donViGvhdMoi?: string;

  /** Trường thông tin cho đơn GIA_HAN */
  soThangGiaHan?: number;
  hanHienTaiTaiThoiDiemNop?: string;
  hanMoiDuKien?: string;
  xacNhanGvhds?: SupervisorOpinionItem[];

  /** Tài liệu đính kèm & Quyết định ban hành */
  tepDinhKem?: ChangeRequestAttachment | null;
  quyetDinh?: ChangeRequestDecision | null;
}

export interface ChangeRequestFormValues {
  loaiDon: ChangeRequestType;
  lyDo: string;
  batKhaKhang: boolean;
  tenDeTaiMoi?: string;
  phanCongCuId?: string;
  gvhdMoiId?: string;
  soThangGiaHan?: number;
  hanMoiDuKien?: string;
  tepDinhKemFile: File | null;
}

export interface ChangeRequestUploadState {
  progress: number;
  status: UploadStatus;
  errorMessage?: string;
  onCancel?: () => void;
  onRetry?: () => void;
}

export interface ChangeRequestFormProps {
  /** Tên đề tài luận án hiện tại của NCS */
  currentThesisTitle: string;
  /** Danh sách GVHD hiện tại của NCS */
  currentSupervisors: SupervisorAssignmentItem[];
  /** Danh sách GVHD ứng viên có thể đề xuất thay thế */
  candidateSupervisors: CandidateSupervisorOption[];
  /** Thông tin tổng hợp thời gian đào tạo & các cờ điều kiện quy chế */
  trainingSummary: TrainingTimeSummary;
  /** Loại đơn mặc định khi mở form */
  initialType?: ChangeRequestType;
  /** Đang có 1 đơn chờ xử lý (khóa gửi thêm đơn mới) */
  hasPendingRequest?: boolean;
  /** Trạng thái upload tệp đính kèm (tùy chọn, dùng với UploadProgress) */
  uploadState?: ChangeRequestUploadState | null;
  /** Callback gửi đơn hợp lệ */
  onSubmit: (values: ChangeRequestFormValues) => void | Promise<void>;
  /** Callback đóng/hủy form */
  onCancel?: () => void;
  /** Đang xử lý gửi đơn */
  isSubmitting?: boolean;
  /** Lỗi tổng quát trả về từ tầng trên */
  error?: string | null;
  className?: string;
}

export interface ChangeRequestTableProps {
  requests: ChangeRequestItem[];
  /** Nếu bỏ trống sẽ tự suy ra từ danh sách có đơn CHO_GVHD_XAC_NHAN hoặc CHO_DUYET */
  hasPendingRequest?: boolean;
  onCreateNew?: () => void;
  onSelectDetail: (request: ChangeRequestItem) => void;
  onCancelRequest?: (request: ChangeRequestItem) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export interface ChangeRequestDetailProps {
  request: ChangeRequestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelRequest?: (request: ChangeRequestItem) => void;
  className?: string;
}

export interface CancelRequestDialogProps {
  request: ChangeRequestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (request: ChangeRequestItem) => void | Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  variant?: "warning" | "destructive";
}

export interface StudentChangeRequestsOverview {
  ncsId: string;
  hoTenNcs: string;
  mshv: string;
  tenDeTaiHienTai: string;
  danhSachGvhdHienTai: SupervisorAssignmentItem[];
  danhSachGvhdDeXuat: CandidateSupervisorOption[];
  thongTinThoiGian: TrainingTimeSummary;
  danhSachDon: ChangeRequestItem[];
}
