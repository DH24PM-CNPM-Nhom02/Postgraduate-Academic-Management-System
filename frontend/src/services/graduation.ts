import { apiClient, parseApiErrorAsync, throwApiError } from "@/src/lib/api";
import type {
  GraduatedNcsRecord,
  GraduationCheckApiResponse,
  GraduationConfirmation,
  GraduationConfirmationResponse,
  GraduationDecision,
  GraduationDetail,
  GraduationEvidenceUpdate,
} from "@/src/types/api/graduation";

export const GraduationService = {
  /**
   * Xem kết quả 6 điều kiện xét tốt nghiệp của một NCS từ Backend
   */
  async checkGraduation(ncsId: string): Promise<GraduationCheckApiResponse | null> {
    try {
      const response = await apiClient.get<GraduationCheckApiResponse>(
        `/graduation/ncs/${ncsId}`
      );
      return response.data;
    } catch {
      // Nếu không có quyền GRADUATION_CHECK (vai trò NCS), trả về null để fallback sang tính toán từ hồ sơ thật
      return null;
    }
  },

  async list() {
    try {
      const { data } = await apiClient.get<GraduationCheckApiResponse[]>("/graduation");
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async listGraduated() {
    try {
      const { data } = await apiClient.get<GraduatedNcsRecord[]>("/graduation/graduated");
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async getMyGraduation() {
    try {
      const response = await apiClient.get<{ data: GraduatedNcsRecord | null }>("/graduation/me");
      return response.data.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async exportGraduated() {
    try {
      const { data } = await apiClient.get<Blob>("/graduation/graduated/export", { responseType: "blob" });
      return data;
    } catch (error) {
      throw await parseApiErrorAsync(error);
    }
  },

  async detail(ncsId: string) {
    try {
      const { data } = await apiClient.get<GraduationDetail>(`/graduation/ncs/${ncsId}`);
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async updateEvidence({ kind, ncsId, ...payload }: GraduationEvidenceUpdate) {
    try {
      await apiClient.put(`/graduation/ncs/${ncsId}/${kind}`, payload);
    } catch (error) {
      throwApiError(error);
    }
  },

  async decisions(ncsId: string) {
    try {
      const { data } = await apiClient.get<GraduationDecision[]>(`/graduation/ncs/${ncsId}/quyet-dinh`);
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async confirm(danhSach: GraduationConfirmation[]) {
    try {
      const { data } = await apiClient.post<GraduationConfirmationResponse>("/graduation/confirm", { danhSach });
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },
};
