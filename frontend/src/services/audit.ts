import { apiClient, throwApiError } from "@/src/lib/api";
import type {
  AuditLogApi,
  ListAuditQueryParams,
  PaginatedAuditResponse,
} from "@/src/types/api/audit";

/** Bỏ các tham số rỗng để không gửi `?action=` lên server */
function cleanParams(params: ListAuditQueryParams): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    result[key] = typeof value === "string" ? value.trim() : value;
  }
  return result;
}

/**
 * AuditService — Nhật ký kiểm toán (AuditController, api-gateway).
 */
export const AuditService = {
  /**
   * Danh sách nhật ký (luôn gửi page + limit để nhận dạng phân trang server-side)
   * Endpoint: GET /audit-logs
   */
  getAuditLogs: async (
    params: ListAuditQueryParams
  ): Promise<PaginatedAuditResponse> => {
    try {
      const response = await apiClient.get<
        PaginatedAuditResponse | AuditLogApi[]
      >("/audit-logs", { params: cleanParams(params) });
      const data = response.data;
      // Phòng thủ: nếu server trả mảng thuần (không phân trang) thì tự bọc lại
      if (Array.isArray(data)) {
        return {
          data,
          total: data.length,
          page: 1,
          limit: data.length,
          totalPages: 1,
        };
      }
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },

  /**
   * Chi tiết 1 bản ghi nhật ký
   * Endpoint: GET /audit-logs/:id
   */
  getAuditLogById: async (id: string): Promise<AuditLogApi> => {
    try {
      const response = await apiClient.get<AuditLogApi>(`/audit-logs/${id}`);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },
};
