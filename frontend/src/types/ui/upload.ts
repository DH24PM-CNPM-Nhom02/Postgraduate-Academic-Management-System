/**
 * UI Types cho nhóm component Upload & Xem tài liệu PDF (components/upload/).
 */

export type UploadStatus = "uploading" | "success" | "error";

export interface PdfUploaderProps {
  /** ID tùy chỉnh gắn kết label htmlFor và input file */
  id?: string;
  /** Nhãn hiển thị phía trên vùng tải tệp */
  label?: string;
  /** Đánh dấu bắt buộc nhập */
  required?: boolean;
  /** Tệp PDF đang được chọn */
  selectedFile?: File | null;
  /** Dung lượng tối đa cho phép (MB), mặc định 15MB */
  maxSizeMb?: number;
  /** Callback khi người dùng chọn hoặc xóa tệp hợp lệ */
  onFileSelect: (file: File | null) => void;
  /** Callback thông báo lỗi validate phía client (hoặc null khi hợp lệ) */
  onValidationError?: (message: string | null) => void;
  /** Thông báo lỗi từ bên ngoài truyền vào */
  error?: string | null;
  /** Khóa tương tác */
  disabled?: boolean;
  /** Văn bản hướng dẫn bổ sung */
  helperText?: string;
  /** Class CSS bổ sung */
  className?: string;
}

export interface UploadProgressProps {
  /** Tên tệp đang xử lý */
  fileName: string;
  /** Dung lượng tệp (bytes) */
  fileSize?: number;
  /** Phần trăm tiến trình (0 - 100) */
  progress: number;
  /** Trạng thái tải lên */
  status: UploadStatus;
  /** Thông báo lỗi chi tiết khi status === "error" */
  errorMessage?: string;
  /** Callback hủy khi đang tải lên */
  onCancel?: () => void;
  /** Callback thử lại khi thất bại */
  onRetry?: () => void;
  /** Callback gỡ bỏ mục sau khi hoàn tất hoặc lỗi */
  onRemove?: () => void;
  /** Class CSS bổ sung */
  className?: string;
}

export interface PdfViewerProps {
  /** Trạng thái mở/đóng hộp thoại xem trước */
  isOpen: boolean;
  /** Callback đóng hộp thoại */
  onClose: () => void;
  /** Đường dẫn tệp PDF (http(s), blob, hoặc mock://...) */
  fileUrl?: string | null;
  /** Tên tệp PDF hiển thị ở thanh tiêu đề */
  fileName?: string;
  /** Tiêu đề hộp thoại */
  title?: string;
  /** Mô tả phụ dưới tiêu đề (vd: Số QĐ, ngày ký) */
  subtitle?: string;
  /** Trạng thái đang tải tài liệu */
  isLoading?: boolean;
  /** Thông báo lỗi nếu tải tài liệu thất bại */
  error?: string | null;
  /** Callback thử lại khi tải lỗi */
  onRetry?: () => void;
  /** Cho phép tải xuống / mở tab mới (false cho phản biện kín) */
  allowDownload?: boolean;
  /** Class CSS bổ sung cho khung dialog */
  className?: string;
}
