import { apiClient, throwApiError } from "@/src/lib/api";
import { DocumentService } from "@/src/services/document";
import type {
  ApproveChangeRequestPayload,
  ChangeRequestDetailApi,
  ChangeRequestListResponse,
  CreateChangeRequestPayload,
  ListChangeRequestParams,
  SupervisorReviewPayload,
} from "@/src/types/api/change-request";
import type { MilestoneDecisionApi } from "@/src/types/api/progress";

/** Bỏ các trường rỗng / undefined khỏi body JSON */
function compact<T extends object>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    (out as Record<string, unknown>)[key] =
      typeof value === "string" ? value.trim() : value;
  }
  return out;
}

/**
 * ChangeRequestService — Đơn đề nghị điều chỉnh (Đổi đề tài / Đổi GVHD / Gia hạn).
 * Endpoint gốc: /change-request (api-gateway ChangeRequestController).
 * Backend tự giới hạn phạm vi dữ liệu theo token (NCS chỉ thấy đơn của mình, GVHD thấy đơn liên quan).
 */
export const ChangeRequestService = {
  /** GET /change-request (luôn trả `{ data, total, page, limit }`) */
  list: async (
    params: ListChangeRequestParams = {}
  ): Promise<ChangeRequestListResponse> => {
    try {
      const response = await apiClient.get<ChangeRequestListResponse>(
        "/change-request",
        { params: compact(params) }
      );
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /** GET /change-request/:id */
  detail: async (id: string): Promise<ChangeRequestDetailApi> => {
    try {
      const response = await apiClient.get<ChangeRequestDetailApi>(
        `/change-request/${id}`
      );
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /** POST /change-request (đã có sẵn fileId hoặc không đính kèm) */
  create: async (payload: CreateChangeRequestPayload): Promise<unknown> => {
    try {
      const response = await apiClient.post("/change-request", compact(payload));
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * Quy trình 2 bước: upload PDF (`DON_TU`) → lấy `fileId` → POST /change-request.
   * Trả về `fileId` đã upload để UI cho phép "Thử lại" mà không phải upload lại.
   */
  uploadAttachment: async (
    file: File,
    onUploadProgress?: (percent: number) => void
  ): Promise<string> => {
    const uploaded = await DocumentService.uploadPdf({
      file,
      documentType: "DON_TU",
      onUploadProgress,
    });
    return uploaded.id;
  },

  /** PATCH /change-request/:id/cancel (người tạo đơn, khi đang chờ xử lý) */
  cancel: async (id: string): Promise<{ id: string; trangThai: string }> => {
    try {
      const response = await apiClient.patch<{ id: string; trangThai: string }>(
        `/change-request/${id}/cancel`
      );
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /** PATCH /change-request/:id/supervisor-review (GVHD xác nhận đơn GIA_HAN) */
  supervisorReview: async (
    id: string,
    payload: SupervisorReviewPayload
  ): Promise<unknown> => {
    try {
      const response = await apiClient.patch(
        `/change-request/${id}/supervisor-review`,
        compact(payload)
      );
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /** PATCH /change-request/:id/approve (Giáo vụ / Admin) */
  approve: async (
    id: string,
    payload: ApproveChangeRequestPayload
  ): Promise<unknown> => {
    try {
      const response = await apiClient.patch(
        `/change-request/${id}/approve`,
        compact(payload)
      );
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * Quyết định hiệu lực của đúng NCS dùng để duyệt đơn (backend `kiemTraQuyetDinh` bắt buộc qd.ncsId === đơn.ncsId).
   * DOI_DE_TAI → GIAO_DE_TAI, DOI_GVHD → PHAN_CONG_GVHD, GIA_HAN → GIA_HAN.
   * Endpoint: GET /decisions?loai=&trangThai=HIEU_LUC&ncsId=
   */
  getApprovalDecisions: async (
    ncsId: string,
    loai: "GIAO_DE_TAI" | "PHAN_CONG_GVHD" | "GIA_HAN"
  ): Promise<MilestoneDecisionApi[]> => {
    try {
      const response = await apiClient.get<
        MilestoneDecisionApi[] | { data: MilestoneDecisionApi[] }
      >("/decisions", { params: { loai, trangThai: "HIEU_LUC", ncsId } });
      const data = response.data;
      return Array.isArray(data) ? data : data?.data ?? [];
    } catch (error) {
      throwApiError(error);
    }
  },

  /** PATCH /change-request/:id/reject (Giáo vụ / Admin, lyDoTuChoi 1..2000) */
  reject: async (id: string, lyDoTuChoi: string): Promise<unknown> => {
    try {
      const response = await apiClient.patch(`/change-request/${id}/reject`, {
        lyDoTuChoi: lyDoTuChoi.trim(),
      });
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },
};
