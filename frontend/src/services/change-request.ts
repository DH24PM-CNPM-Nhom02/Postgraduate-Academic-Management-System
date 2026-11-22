import { apiClient, throwApiError } from "@/src/lib/api";
import type {
  ApproveChangeRequestPayload,
  ChangeRequestApiItem,
  ChangeRequestDetail,
  ChangeRequestListQuery,
  ChangeRequestListResponse,
  CreateChangeRequestApiPayload,
  SupervisorReviewPayload,
} from "@/src/types/api/change-request";

const path = "/change-request";

export const ChangeRequestService = {
  async list(params?: Partial<ChangeRequestListQuery>, signal?: AbortSignal) {
    const { data } = await apiClient.get<ChangeRequestListResponse>(path, { params, signal });
    return data;
  },

  async listForSearch(filters: Omit<ChangeRequestListQuery, "page" | "limit">, signal?: AbortSignal) {
    const limit = 100;
    const first = await ChangeRequestService.list({ ...filters, page: 1, limit }, signal);
    const items = [...first.data];

    for (let page = 2; page <= Math.ceil(first.total / limit); page++) {
      const next = await ChangeRequestService.list({ ...filters, page, limit }, signal);
      items.push(...next.data);
    }

    return [...new Map(items.map((item) => [item.id, item])).values()];
  },

  async detail(id: string, signal?: AbortSignal) {
    const { data } = await apiClient.get<ChangeRequestDetail>(`${path}/${id}`, { signal });
    return data;
  },

  async approve(id: string, payload: ApproveChangeRequestPayload) {
    await apiClient.patch(`${path}/${id}/approve`, payload);
  },

  async reject(id: string, lyDoTuChoi: string) {
    await apiClient.patch(`${path}/${id}/reject`, { lyDoTuChoi });
  },

  /**
   * Tạo đơn đề nghị mới (Đổi đề tài, Đổi GVHD, Gia hạn học tập)
   */
  async create(
    payload: CreateChangeRequestApiPayload
  ): Promise<ChangeRequestApiItem> {
    try {
      const response = await apiClient.post<ChangeRequestApiItem>(
        path,
        payload
      );
      return response.data;
    } catch (err) {
      throwApiError(err);
    }
  },

  /**
   * GVHD xác nhận ý kiến cho đơn GIA_HAN hoặc DOI_DE_TAI (do NCS tự nộp) đang CHO_GVHD_XAC_NHAN.
   * Endpoint: PATCH /change-request/:id/supervisor-review — body { dongY, nhanXet? }
   */
  async supervisorReview(id: string, payload: SupervisorReviewPayload): Promise<void> {
    try {
      const nhanXet = payload.nhanXet?.trim();
      await apiClient.patch(`${path}/${id}/supervisor-review`, {
        dongY: payload.dongY,
        ...(nhanXet ? { nhanXet } : {}),
      });
    } catch (err) {
      throwApiError(err);
    }
  },

  /**
   * Hủy đơn đề nghị đang chờ duyệt (CHO_GVHD_XAC_NHAN hoặc CHO_DUYET)
   */
  async cancel(id: string): Promise<ChangeRequestApiItem> {
    try {
      const response = await apiClient.patch<ChangeRequestApiItem>(
        `${path}/${id}/cancel`
      );
      return response.data;
    } catch (err) {
      throwApiError(err);
    }
  },
};
