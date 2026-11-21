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
      throwApiError(err, "Không thể tải danh sách đơn đề nghị.");
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
      throwApiError(err, "Không thể tải chi tiết đơn đề nghị.");
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
      throwApiError(err, "Không thể gửi đơn đề nghị.");
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
      throwApiError(err, "Không thể hủy đơn đề nghị.");
    }
  },
};
