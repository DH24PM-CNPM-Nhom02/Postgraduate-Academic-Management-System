"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ApiClientError } from "@/src/lib/api";
import { AuditService } from "@/src/services/audit";
import type {
  AuditLogApi,
  ListAuditQueryParams,
  PaginatedAuditResponse,
} from "@/src/types/api/audit";

export const auditKeys = {
  all: ["audit-logs"] as const,
  list: (params: ListAuditQueryParams) =>
    [...auditKeys.all, "list", params] as const,
  detail: (id: string) => [...auditKeys.all, "detail", id] as const,
};

/** Danh sách nhật ký kiểm toán (server-side pagination) */
export function useAuditLogs(params: ListAuditQueryParams) {
  return useQuery<PaginatedAuditResponse, ApiClientError>({
    queryKey: auditKeys.list(params),
    queryFn: () => AuditService.getAuditLogs(params),
    // Giữ trang cũ trong lúc tải trang mới để bảng không nhấp nháy
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

/** Chi tiết 1 bản ghi nhật ký (chỉ gọi khi mở dialog) */
export function useAuditLogDetail(id: string | null) {
  return useQuery<AuditLogApi, ApiClientError>({
    queryKey: auditKeys.detail(id ?? ""),
    queryFn: () => AuditService.getAuditLogById(id!),
    enabled: Boolean(id),
    // Nhật ký là append-only, không thay đổi sau khi ghi
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}
