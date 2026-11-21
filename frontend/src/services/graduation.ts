import { apiClient } from "@/src/lib/api";
import type { GraduationCheckApiResponse } from "@/src/types/api/graduation";

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
};
