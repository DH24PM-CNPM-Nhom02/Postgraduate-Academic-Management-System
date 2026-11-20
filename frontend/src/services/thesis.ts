import { apiClient } from "@/src/lib/api";
import type {
  BackendThesisNcsMeResponse,
  AcademicThesisListQuery,
  AcademicThesisListResponse,
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

  /**
   * 1. Lấy danh sách đề tài luận án của các NCS theo bộ lọc (GET /thesis)
   */
  static async listTheses(
    params?: AcademicThesisListQuery
  ): Promise<AcademicThesisListResponse> {
    const response = await apiClient.get<AcademicThesisListResponse>("/thesis", {
      params,
    });
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

  /**
   * 5. Lấy danh sách quyết định giao đề tài đang có hiệu lực để chọn khi giao đề tài (GET /decisions?loai=GIAO_DE_TAI&trangThai=HIEU_LUC&ncsId=...)
   */
  static async getAvailableDecisionsForThesis(
    ncsId?: string
  ): Promise<DecisionItem[]> {
    const response = await apiClient.get<DecisionItem[] | { data: DecisionItem[] }>(
      "/decisions",
      {
        params: {
          loai: "GIAO_DE_TAI",
          trangThai: "HIEU_LUC",
          ...(ncsId ? { ncsId } : {}),
        },
      }
    );
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return (response.data as { data?: DecisionItem[] })?.data ?? [];
  }
}

// Named function exports for direct imports
export const listTheses = ThesisService.listTheses;
export const assignThesis = ThesisService.assignThesis;
export const deactivateThesis = ThesisService.deactivateThesis;
export const getAdminThesisDetail = ThesisService.getAdminThesisDetail;
export const getAvailableDecisionsForThesis = ThesisService.getAvailableDecisionsForThesis;
