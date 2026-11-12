/**
 * types/api/document.ts
 *
 * Khai báo kiểu dữ liệu khớp với Backend DocumentController & UploadDocumentDto:
 * - POST /documents/upload
 * - GET /documents/:id
 * - GET /documents/:id/download
 */

export const DOCUMENT_TYPES = [
  "MINH_CHUNG_MOC",
  "QUYET_DINH",
  "MINH_CHUNG_NGOAI_NGU",
  "MINH_CHUNG_CONG_NO",
  "DON_TU",
  "BIEU_MAU",
  "QUY_DINH",
  "KHAC",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

/** Dung lượng tối đa Backend cho phép mỗi file PDF (15MB) */
export const MAX_PDF_SIZE_BYTES = 15 * 1024 * 1024;

/** Dữ liệu đầu vào khi gọi upload file PDF lên Backend */
export interface UploadDocumentRequest {
  file: File;
  /** Với tài khoản NCS, Backend chỉ cho phép MINH_CHUNG_MOC hoặc DON_TU */
  documentType: DocumentType;
  /** Chỉ Giáo vụ cần truyền; NCS để trống để Backend tự lấy từ JWT token */
  ncsId?: string;
  /** Loại thực thể liên kết (tùy chọn, tối đa 50 ký tự) */
  refType?: string;
  /** ID thực thể liên kết (tùy chọn, tối đa 100 ký tự) */
  refId?: string;
  /** Callback theo dõi tiến trình upload (%) trên giao diện */
  onUploadProgress?: (percent: number) => void;
}

/** Dữ liệu Backend trả về sau khi upload thành công hoặc gọi GET /documents/:id */
export interface DocumentMetadataResponse {
  id: string;
  documentType: DocumentType;
  ncsId: string | null;
  refType: string | null;
  refId: string | null;
  originalName: string;
  mimeType: string;
  size: number;
  checksum: string;
  status: string;
  createdAt: string;
}

/** Kết quả tiện ích khi tạo URL xem trước PDF từ Blob đã xác thực */
export interface DocumentPreviewResult {
  blob: Blob;
  objectUrl: string;
}
