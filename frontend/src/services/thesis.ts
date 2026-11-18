import { apiClient } from "@/src/lib/api";
import type { BackendThesisNcsMeResponse } from "@/src/types/api/thesis";

/**
 * Service giao tiếp với API Gateway cho phân hệ Đề tài Luận án
 */
export class ThesisService {
  /**
   * Lấy thông tin đề tài luận án hiện tại và lịch sử thay đổi của chính NCS (GET /thesis/ncs/me)
   */
  static async getMyThesis(): Promise<BackendThesisNcsMeResponse> {
    const response = await apiClient.get<BackendThesisNcsMeResponse>("/thesis/ncs/me");
    return response.data;
  }
}
