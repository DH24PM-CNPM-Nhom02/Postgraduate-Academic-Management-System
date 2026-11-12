/**
 * UI Types cho màn hình "Xét tốt nghiệp cá nhân" (/student/graduation).
 * Tách riêng khỏi DTO backend để phục vụ render thuần UI và mock data.
 */

export type GraduationConditionCode =
  | "HOAN_THANH_MOC"
  | "TRANG_THAI_HOC_TAP"
  | "THOI_HAN"
  | "NGOAI_NGU"
  | "CONG_NO"
  | "DE_NGHI_CHO_DUYET";

export interface GraduationConditionAttachment {
  /** Tên tệp PDF minh chứng / chứng chỉ / xác nhận */
  fileName: string;
  /** Đường dẫn xem tệp PDF qua PdfViewer */
  fileUrl: string;
  /** Mô tả phụ hiển thị trên tiêu đề hộp thoại xem PDF */
  subtitle?: string;
}

export interface GraduationConditionItem {
  /** Mã điều kiện tốt nghiệp chuẩn hóa */
  maDieuKien: GraduationConditionCode;
  /** Thứ tự hiển thị (1..6) */
  thuTu: number;
  /** Tên hiển thị của điều kiện */
  tenHienThi: string;
  /** Mô tả chi tiết yêu cầu theo quy chế */
  moTaYeuCau: string;
  /** Trạng thái đạt điều kiện */
  dat: boolean;
  /** Giá trị thực tế hiện tại của NCS (vd: "9/9 mốc", "B2 Vstep - Hợp lệ") */
  giaTriThucTe: string;
  /** Mức độ cảnh báo khi chưa đạt ("warning" | "error") */
  mucDo?: "warning" | "error";
  /** Ghi chú hoặc lý do chưa đạt */
  ghiChu?: string;
  /** Liên kết điều hướng xử lý (vd: /student/extensions, /student/progress) */
  actionHref?: string;
  /** Nhãn liên kết điều hướng */
  actionLabel?: string;
  /** Tài liệu chứng minh / chứng chỉ PDF (nếu có) */
  taiLieuChungMinh?: GraduationConditionAttachment | null;
}

export interface StudentGraduationOverview {
  ncsId: string;
  hoTenNcs: string;
  mshv: string;
  chuyenNganh: string;
  khoaHoc: string;
  /** Trạng thái đủ điều kiện xét tốt nghiệp chung (đạt đủ 6/6 điều kiện) */
  duDieuKien: boolean;
  /** Số điều kiện đã đạt */
  daDatCount: number;
  /** Tổng số điều kiện quy định (6) */
  tongDieuKien: number;
  /** Ngày kiểm tra điều kiện gần nhất (ISO string) */
  ngayKiemTraGanNhat: string;
  /** Nhận xét hoặc lưu ý tổng hợp từ Phòng ĐT-SĐH / Hội đồng */
  ghiChuHoiDong: string;
  /** Danh sách 6 điều kiện xét tốt nghiệp */
  dieuKienList: GraduationConditionItem[];
}

export interface GraduationOverviewCardProps {
  overview: StudentGraduationOverview;
  className?: string;
}

export interface GraduationConditionsProps {
  conditions: GraduationConditionItem[];
  onPreviewDocument?: (
    attachment: GraduationConditionAttachment,
    conditionTitle: string
  ) => void;
  className?: string;
}

export interface GraduationScenarioOption {
  id: string;
  label: string;
  data: StudentGraduationOverview;
}

export interface GraduationWorkspaceProps {
  overview: StudentGraduationOverview | null;
  /** Kịch bản phụ tùy chọn để kiểm thử nhanh UI trên trang mock */
  scenarios?: GraduationScenarioOption[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}
