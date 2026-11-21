import { apiClient, throwApiError } from "@/src/lib/api";
import type {
  ChangeRequestApiItem,
  CreateChangeRequestApiPayload,
  ListChangeRequestsApiResponse,
} from "@/src/types/api/change-request";

export const ChangeRequestService = {
  /**
   * Lấy danh sách đơn đề nghị điều chỉnh / gia hạn của người dùng (NCS)
   */
  async list(params?: {
    trangThai?: string;
    loai?: string;
    page?: number;
    limit?: number;
  }): Promise<ListChangeRequestsApiResponse> {
    try {
      const response = await apiClient.get<ListChangeRequestsApiResponse>(
        "/change-request",
        { params }
      );
      return response.data;
    } catch (err) {
      throwApiError(err);
    }
  },

  /**
   * Xem chi tiết 1 đơn đề nghị
   */
  async getDetail(id: string): Promise<ChangeRequestApiItem> {
    try {
      const response = await apiClient.get<ChangeRequestApiItem>(
        `/change-request/${id}`
      );
      return response.data;
    } catch (err) {
      throwApiError(err);
    }
  },

  /**
   * Tạo đơn đề nghị mới (Đổi đề tài, Đổi GVHD, Gia hạn học tập)
   */
  async create(
    payload: CreateChangeRequestApiPayload
  ): Promise<ChangeRequestApiItem> {
    try {
      const response = await apiClient.post<ChangeRequestApiItem>(
        "/change-request",
        payload
      );
      return response.data;
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
        `/change-request/${id}/cancel`
      );
      return response.data;
    } catch (err) {
      throwApiError(err);
    }
import { apiClient } from "@/src/lib/api";
import type {
  ApproveChangeRequestPayload,
  ChangeRequestDetail,
  ChangeRequestListQuery,
  ChangeRequestListResponse,
} from "@/src/types/api/change-request";

const path = "/change-request";

export const ChangeRequestService = {
  async list(params: ChangeRequestListQuery, signal?: AbortSignal) {
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
};
