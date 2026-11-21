import { apiClient } from "@/src/lib/api";
import type {
  BackendThesisNcsMeResponse,
  AcademicThesisNcsItem,
  AssignThesisPayload,
  BackendThesisItem,
  DeactivateThesisPayload,
  AcademicThesisAdminDetailResponse,
} from "@/src/types/api/thesis";
import type { DecisionItem } from "@/src/types/academic";

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

  /** GET /thesis returns the full list when page and limit are omitted. */
  static async listTheses(signal?: AbortSignal): Promise<AcademicThesisNcsItem[]> {
    const response = await apiClient.get<AcademicThesisNcsItem[]>("/thesis", { signal });
    return response.data;
  }

  /**
   * 2. Giao đề tài luận án mới cho NCS gắn với Quyết định phê duyệt (POST /thesis)
   */
  static async assignThesis(
    payload: AssignThesisPayload
  ): Promise<BackendThesisItem> {
    const response = await apiClient.post<BackendThesisItem>("/thesis", payload);
    return response.data;
  }

  /**
   * 3. Vô hiệu hóa/Hủy đề tài luận án (PATCH /thesis/:id/deactivate)
   */
  static async deactivateThesis(
    id: string,
    payload: DeactivateThesisPayload
  ): Promise<BackendThesisItem> {
    const response = await apiClient.patch<BackendThesisItem>(
      `/thesis/${id}/deactivate`,
      payload
    );
    return response.data;
  }

  /**
   * 4. Lấy chi tiết lịch sử đề tài và phân công người hướng dẫn dành cho Giáo vụ/Admin (GET /thesis/admin/:ncsId)
   */
  static async getAdminThesisDetail(
    ncsId: string
  ): Promise<AcademicThesisAdminDetailResponse> {
    const response = await apiClient.get<AcademicThesisAdminDetailResponse>(
      `/thesis/admin/${ncsId}`
    );
    return response.data;
  }

  static async getAvailableDecisionsForThesis(
    ncsId: string,
    signal?: AbortSignal,
  ): Promise<DecisionItem[]> {
    const { data } = await apiClient.get<DecisionItem[]>("/decisions", {
      params: { loai: "GIAO_DE_TAI", trangThai: "HIEU_LUC", ncsId },
      signal,
    });
    return data;
  }
}
