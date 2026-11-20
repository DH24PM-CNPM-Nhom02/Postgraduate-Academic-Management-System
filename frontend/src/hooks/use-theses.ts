"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ThesisService } from "@/src/services/thesis";
import type {
  AcademicThesisListQuery,
  AcademicThesisListResponse,
  AcademicThesisAdminDetailResponse,
  AssignThesisPayload,
  BackendThesisItem,
  DeactivateThesisPayload,
} from "@/src/types/api/thesis";
import type { DecisionItem } from "@/src/types/academic";

/**
 * Query Key Factory chuẩn hóa cho phân hệ Quản lý Đề tài Luận án (/academic/theses)
 */
export const academicThesisKeys = {
  all: ["academic", "theses"] as const,
  lists: () => [...academicThesisKeys.all, "list"] as const,
  list: (params?: AcademicThesisListQuery) =>
    [...academicThesisKeys.lists(), params] as const,
  details: () => [...academicThesisKeys.all, "detail"] as const,
  detail: (ncsId: string | null) =>
    [...academicThesisKeys.details(), ncsId] as const,
  decisions: (ncsId?: string) =>
    [...academicThesisKeys.all, "decisions", ncsId ?? "all"] as const,
};

/**
 * 1. Hook lấy danh sách Đề tài Luận án của toàn bộ NCS (GET /thesis)
 * Kết nối API Backend thật 100%, hỗ trợ tìm kiếm, lọc theo khóa học, trạng thái, GVHD và phân trang.
 */
export function useAcademicTheses(params?: AcademicThesisListQuery) {
  return useQuery<AcademicThesisListResponse>({
    queryKey: academicThesisKeys.list(params),
    queryFn: () => ThesisService.listTheses(params),
    staleTime: 1000 * 60 * 3, // 3 phút cache
    refetchOnWindowFocus: false,
  });
}

/**
 * 2. Hook lấy chi tiết đề tài hiện tại, lịch sử thay đổi và phân công GVHD của một NCS (GET /thesis/admin/:ncsId)
 */
export function useAcademicThesisDetail(ncsId: string | null) {
  return useQuery<AcademicThesisAdminDetailResponse | null>({
    queryKey: academicThesisKeys.detail(ncsId),
    queryFn: () => (ncsId ? ThesisService.getAdminThesisDetail(ncsId) : null),
    enabled: Boolean(ncsId),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
  });
}

/**
 * 3. Hook lấy danh sách Quyết định giao đề tài đang hiệu lực để phục vụ form gán đề tài (GET /decisions?loai=GIAO_DE_TAI&trangThai=HIEU_LUC&ncsId=...)
 */
export function useThesisDecisions(ncsId?: string) {
  return useQuery<DecisionItem[]>({
    queryKey: academicThesisKeys.decisions(ncsId),
    queryFn: () => ThesisService.getAvailableDecisionsForThesis(ncsId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

/**
 * 4. Mutation gán/giao đề tài luận án mới cho NCS (POST /thesis)
 * Tự động invalidate các query keys ["academic", "theses"] và ["academic", "students"].
 */
export function useAssignThesisMutation() {
  const queryClient = useQueryClient();

  return useMutation<BackendThesisItem, Error, AssignThesisPayload>({
    mutationFn: (payload: AssignThesisPayload) => ThesisService.assignThesis(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: academicThesisKeys.all });
      queryClient.invalidateQueries({ queryKey: ["academic", "theses"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "students"] });
      if (variables?.ncsId) {
        queryClient.invalidateQueries({
          queryKey: academicThesisKeys.detail(variables.ncsId),
        });
      }
    },
  });
}

/**
 * 5. Mutation hủy/vô hiệu hóa đề tài luận án (PATCH /thesis/:id/deactivate)
 * Tự động invalidate các query keys ["academic", "theses"] và ["academic", "students"].
 */
export function useDeactivateThesisMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    BackendThesisItem,
    Error,
    { id: string; payload: DeactivateThesisPayload }
  >({
    mutationFn: ({ id, payload }) => ThesisService.deactivateThesis(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicThesisKeys.all });
      queryClient.invalidateQueries({ queryKey: ["academic", "theses"] });
      queryClient.invalidateQueries({ queryKey: ["academic", "students"] });
    },
  });
}
