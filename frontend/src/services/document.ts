import {
  ApiClientError,
  apiClient,
  parseApiErrorAsync,
  throwApiError,
} from "@/src/lib/api";
import {
  MAX_PDF_SIZE_BYTES,
  type DocumentMetadataResponse,
  type DocumentPreviewResult,
  type UploadDocumentRequest,
} from "@/src/types/api/document";

/**
 * Kiểm tra file PDF cơ bản ở phía trình duyệt trước khi gửi lên Backend.
 */
function validatePdfFile(file: File) {
  if (!file) {
    throw new ApiClientError({
      status: 400,
      message: "Vui lòng chọn tệp PDF để tải lên.",
      messages: ["Vui lòng chọn tệp PDF để tải lên."],
    });
  }

  const isPdfExtension = file.name.toLowerCase().endsWith(".pdf");
  const isPdfMime = !file.type || file.type === "application/pdf";
  if (!isPdfExtension || !isPdfMime) {
    throw new ApiClientError({
      status: 400,
      message: "Chỉ chấp nhận tệp định dạng PDF (.pdf).",
      messages: ["Chỉ chấp nhận tệp định dạng PDF (.pdf)."],
    });
  }

  if (file.size === 0) {
    throw new ApiClientError({
      status: 400,
      message: "Tệp PDF bị rỗng, không thể tải lên.",
      messages: ["Tệp PDF bị rỗng, không thể tải lên."],
    });
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    throw new ApiClientError({
      status: 400,
      message: "Dung lượng tệp PDF không được vượt quá 15MB.",
      messages: ["Dung lượng tệp PDF không được vượt quá 15MB."],
    });
  }
}

/**
 * DocumentService
 *
 * Chịu trách nhiệm upload, đọc thông tin và tải file PDF với Backend (`DocumentsController`).
 */
export const DocumentService = {
  /**
   * 1. Upload 1 tệp PDF lên máy chủ
   * Endpoint: POST /documents/upload (multipart/form-data)
   */
  uploadPdf: async (
    payload: UploadDocumentRequest
  ): Promise<DocumentMetadataResponse> => {
    validatePdfFile(payload.file);

    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("documentType", payload.documentType);

    if (payload.ncsId) {
      formData.append("ncsId", payload.ncsId);
    }
    if (payload.refType) {
      formData.append("refType", payload.refType);
    }
    if (payload.refId) {
      formData.append("refId", payload.refId);
    }

    try {
      const response = await apiClient.post<DocumentMetadataResponse>(
        "/documents/upload",
        formData,
        {
          // Ghi đè header mặc định application/json để Axios giữ nguyên FormData
          // và trình duyệt tự gắn boundary chuẩn cho multipart/form-data.
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
          onUploadProgress: (progressEvent) => {
            if (!payload.onUploadProgress || !progressEvent.total) return;
            const percent = Math.min(
              100,
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
            payload.onUploadProgress(percent);
          },
        }
      );
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * 2. Lấy metadata (tên file gốc, dung lượng, ngày tạo...) của tài liệu
   * Endpoint: GET /documents/:id
   */
  getMetadata: async (
    documentId: string
  ): Promise<DocumentMetadataResponse> => {
    try {
      const response = await apiClient.get<DocumentMetadataResponse>(
        `/documents/${documentId}`
      );
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * 3. Tải file PDF về dưới dạng Blob (có tự động gắn Bearer Token qua apiClient)
   * Endpoint: GET /documents/:id/download
   */
  downloadBlob: async (documentId: string): Promise<Blob> => {
    try {
      const response = await apiClient.get<Blob>(
        `/documents/${documentId}/download`,
        {
          responseType: "blob",
          timeout: 60000,
        }
      );
      return response.data;
    } catch (error) {
      throw await parseApiErrorAsync(error);
    }
  },

  /**
   * 4. Helper tạo URL tạm trên trình duyệt để xem PDF trong PdfViewer.
   * Lưu ý: Tầng gọi hàm cần gọi URL.revokeObjectURL(objectUrl) khi đóng modal xem PDF.
   */
  createPreviewUrl: async (
    documentId: string
  ): Promise<DocumentPreviewResult> => {
    const blob = await DocumentService.downloadBlob(documentId);
    const pdfBlob =
      blob.type === "application/pdf"
        ? blob
        : new Blob([blob], { type: "application/pdf" });
    const objectUrl = URL.createObjectURL(pdfBlob);
    return { blob: pdfBlob, objectUrl };
  },
};
