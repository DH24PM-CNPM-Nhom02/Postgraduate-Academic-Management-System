/**
 * UI Types cho nhóm component dùng chung (components/shared/).
 */

export type ConfirmDialogVariant = "info" | "warning" | "destructive";

export interface ConfirmDialogProps {
  /** Trạng thái hiển thị dialog */
  isOpen: boolean;
  /** Callback đóng dialog */
  onClose: () => void;
  /** Callback xác nhận hành động chính */
  onConfirm: () => void;
  /** Tiêu đề hộp thoại */
  title: string;
  /** Nội dung giải thích chi tiết tác động của hành động */
  description: string;
  /** Biến thể ngữ nghĩa */
  variant?: ConfirmDialogVariant;
  /** Nhãn nút xác nhận */
  confirmLabel?: string;
  /** Nhãn nút hủy */
  cancelLabel?: string;
  /** Bật chế độ bắt buộc tick xác nhận trước khi bấm nút chính */
  requireAcknowledgement?: boolean;
  /** Nội dung checkbox xác nhận */
  acknowledgementLabel?: string;
  /** Trạng thái đang xử lý bất đồng bộ */
  isLoading?: boolean;
  /** Thông báo lỗi hiển thị trong dialog nếu thao tác thất bại */
  error?: string | null;
}

export type DeadlineUrgency = "normal" | "warning" | "critical" | "overdue";

export interface DeadlineCountdownProps {
  /** Ngày hết hạn (ISO string hoặc Date) */
  targetDate: string | Date;
  /** Nhãn ngữ cảnh đi kèm (vd: "Hạn đào tạo 72 tháng") */
  label?: string;
  /** Ngày mốc tham chiếu để tính chênh lệch (tránh lệch SSR/client nếu cần cố định) */
  referenceDate?: string | Date;
  /** Kiểu hiển thị gọn dạng badge hoặc đầy đủ dạng card */
  variant?: "badge" | "card";
  /** Ngưỡng cảnh báo vàng (mặc định 365 ngày / < 12 tháng) */
  warningThresholdDays?: number;
  /** Ngưỡng cảnh báo đỏ (mặc định 90 ngày / < 3 tháng) */
  criticalThresholdDays?: number;
  /** Class CSS bổ sung */
  className?: string;
}

export type DeadlineBannerSeverity = "info" | "warning" | "critical";

export interface DeadlineWarningBannerProps {
  /** Mức độ cảnh báo; nếu bỏ trống có thể tự suy ra từ remainingMonths */
  severity?: DeadlineBannerSeverity;
  /** Số tháng đào tạo còn lại (tự ẩn nếu >= 12 và không bật alwaysShow/severity) */
  remainingMonths?: number;
  /** Tiêu đề cảnh báo */
  title?: string;
  /** Nội dung cảnh báo */
  message: string;
  /** Nhãn thời hạn bổ sung (vd: "Còn 2 tháng 15 ngày") */
  deadlineLabel?: string;
  /** Nhãn nút hành động */
  actionLabel?: string;
  /** Callback khi bấm nút hành động */
  onAction?: () => void;
  /** Đường dẫn điều hướng khi bấm nút hành động */
  actionHref?: string;
  /** Cho phép đóng banner tạm thời */
  dismissible?: boolean;
  /** Callback khi người dùng đóng banner */
  onDismiss?: () => void;
  /** Luôn hiển thị kể cả khi remainingMonths >= 12 */
  alwaysShow?: boolean;
  /** Class CSS bổ sung */
  className?: string;
}
