"use client";

import { useMemo } from "react";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ApiClientError } from "@/src/lib/api";
import { DocumentService } from "@/src/services/document";
import { mapMyProgressToUi, ProgressService } from "@/src/services/progress";
import { documentKeys } from "@/src/hooks/api/use-documents";
import { ncsSelfKeys, useMyNcsProfile } from "@/src/hooks/api/use-ncs";
import type { DocumentMetadataResponse } from "@/src/types/api/document";
import type {
  ApproveMilestoneResponse,
  CreateEvaluationRequest,
  CreateEvaluationResponse,
  EvaluationListResponse,
  MilestoneDecisionApi,
  MyProgressResponse,
  NcsProgressResponse,
  PendingMilestoneApi,
  RejectMilestoneResponse,
  SubmitMilestoneResponse,
  SubmitMilestoneVariables,
  SubmitMilestoneWithFileVariables,
} from "@/src/types/api/progress";
import type { StudentProgressData } from "@/src/types/ui/progress";

/**
 * Bộ queryKey chuẩn cho phân hệ Tiến trình 9 mốc (NCS + Giáo vụ)
 */
export const progressKeys = {
  all: ["progress"] as const,
  me: () => [...progressKeys.all, "me"] as const,
  pending: () => [...progressKeys.all, "pending"] as const,
  ncs: (ncsId: string) => [...progressKeys.all, "ncs", ncsId] as const,
  evaluations: (minhChungId: string) =>
    [...progressKeys.all, "evaluations", minhChungId] as const,
  approvalDecisions: () =>
    [...progressKeys.all, "approval-decisions"] as const,
};

/**
 * 1. Lấy dữ liệu thô tiến trình 9 mốc từ Backend (`GET /progress/me`)
 */
export function useMyProgress() {
  return useQuery<MyProgressResponse, ApiClientError>({
    queryKey: progressKeys.me(),
    queryFn: () => ProgressService.getMyProgress(),
    staleTime: 1000 * 60, // 1 phút
    refetchOnWindowFocus: false,
  });
}

/**
 * 2. Mutation nộp minh chứng khi đã có sẵn `fileId` (`POST /progress/milestones/:thuTu/submit`)
 */
export function useSubmitMilestone() {
  const queryClient = useQueryClient();

  return useMutation<
    SubmitMilestoneResponse,
    ApiClientError,
    SubmitMilestoneVariables
  >({
    mutationFn: ({ thuTu, payload }) =>
      ProgressService.submitMilestone(thuTu, payload),
    onSuccess: () => {
      // Sau khi nộp mốc thành công, làm mới lại lộ trình 9 mốc và hồ sơ NCS
      queryClient.invalidateQueries({ queryKey: progressKeys.me() });
      queryClient.invalidateQueries({ queryKey: ncsSelfKeys.me() });
    },
  });
}

/**
 * 3. Mutation tiện ích trọn gói 2 bước:
 *    Upload file PDF -> nhận `fileId` -> nộp minh chứng mốc -> làm mới React Query cache
 */
export function useSubmitMilestoneWithFile() {
  const queryClient = useQueryClient();

  return useMutation<
    SubmitMilestoneResponse,
    ApiClientError,
    SubmitMilestoneWithFileVariables
  >({
    mutationFn: (variables) => ProgressService.submitMilestoneWithFile(variables),
    onSuccess: (createdEvidence) => {
      queryClient.invalidateQueries({ queryKey: progressKeys.me() });
      queryClient.invalidateQueries({ queryKey: ncsSelfKeys.me() });
      queryClient.invalidateQueries({
        queryKey: documentKeys.detail(createdEvidence.fileId),
      });
    },
  });
}

/**
 * 4. Hook tổng hợp sẵn sàng để nối vào giao diện Tab Tiến độ NCS:
 *    - Gọi `GET /progress/me` để lấy 9 mốc + lịch sử nộp
 *    - Gọi kèm `GET /ncs/me` để lấy Ngành, Khóa, Ngày nhập học, GVHD cho Header
 *    - Tự lấy metadata tên file PDF gốc (`GET /documents/:fileId`) cho các minh chứng đã nộp
 *    - Chuyển đổi sạch sang `StudentProgressData` cho UI sử dụng
 */
export function useStudentProgressData() {
  const progressQuery = useMyProgress();
  const profileQuery = useMyNcsProfile();

  // Gom các fileId duy nhất từ lịch sử nộp minh chứng để tải tên file gốc
  const fileIds = useMemo(() => {
    const ids = new Set<string>();
    for (const milestone of progressQuery.data?.tienTrinhs ?? []) {
      for (const evidence of milestone.minhChungs) {
        if (evidence.fileId) {
          ids.add(evidence.fileId);
        }
      }
    }
    return Array.from(ids);
  }, [progressQuery.data]);

  const docQueries = useQueries({
    queries: fileIds.map((fileId) => ({
      queryKey: documentKeys.detail(fileId),
      queryFn: () => DocumentService.getMetadata(fileId),
      staleTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    })),
  });

  // Tạo map fileId -> metadata để hiển thị đúng tên & dung lượng file PDF đã nộp
  const documentMetaMap = useMemo(() => {
    const map: Record<string, DocumentMetadataResponse> = {};
    fileIds.forEach((fileId, index) => {
      const doc = docQueries[index]?.data;
      if (doc) {
        map[fileId] = doc;
      }
    });
    return map;
  }, [fileIds, docQueries]);

  const data: StudentProgressData | undefined = useMemo(() => {
    if (!progressQuery.data) return undefined;
    return mapMyProgressToUi(
      progressQuery.data,
      profileQuery.data,
      documentMetaMap
    );
  }, [progressQuery.data, profileQuery.data, documentMetaMap]);

  const refetch = async () => {
    await Promise.all([progressQuery.refetch(), profileQuery.refetch()]);
  };

  return {
    data,
    rawProgress: progressQuery.data,
    ncsProfile: profileQuery.data,
    isLoading:
      progressQuery.isLoading || (profileQuery.isLoading && !progressQuery.data),
    isFetching: progressQuery.isFetching || profileQuery.isFetching,
    // Chỉ chặn toàn trang nếu API tiến trình lỗi, hoặc chưa có dữ liệu tiến trình và API hồ sơ lỗi
    error:
      progressQuery.error ??
      (!progressQuery.data ? profileQuery.error : null) ??
      null,
    refetch,
  };
}

/* =========================================================================
   GIÁO VỤ: HÀNG CHỜ DUYỆT & THẨM ĐỊNH MỐC
   ========================================================================= */

/** 5. Hàng chờ duyệt (`GET /progress/pending`) */
export function usePendingMilestones() {
  return useQuery<PendingMilestoneApi[], ApiClientError>({
    queryKey: progressKeys.pending(),
    queryFn: () => ProgressService.getPendingMilestones(),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

/** 6. Lịch sử 9 mốc của 1 NCS (`GET /progress/ncs/:ncsId`) */
export function useNcsProgress(ncsId?: string | null) {
  return useQuery<NcsProgressResponse, ApiClientError>({
    queryKey: progressKeys.ncs(ncsId ?? ""),
    queryFn: () => ProgressService.getNcsProgress(ncsId!),
    enabled: Boolean(ncsId),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

/** 7. Phiếu nhận xét của 1 lần nộp (`GET /progress/evidences/:id/evaluations`) */
export function useEvaluations(minhChungId?: string | null, enabled = true) {
  return useQuery<EvaluationListResponse, ApiClientError>({
    queryKey: progressKeys.evaluations(minhChungId ?? ""),
    queryFn: () => ProgressService.getEvaluations(minhChungId!),
    enabled: Boolean(minhChungId) && enabled,
    staleTime: 1000 * 15,
    refetchOnWindowFocus: false,
  });
}

/** 8. Quyết định CAN_CU_DUYET_MOC còn hiệu lực (lọc theo NCS ở component) */
export function useMilestoneApprovalDecisions(enabled = true) {
  return useQuery<MilestoneDecisionApi[], ApiClientError>({
    queryKey: progressKeys.approvalDecisions(),
    queryFn: () => ProgressService.getMilestoneApprovalDecisions(),
    enabled,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}

/** 9. Nhập phiếu nhận xét → làm mới phiếu, hàng chờ (đếm phiếu) và lịch sử NCS */
export function useCreateEvaluation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateEvaluationResponse,
    ApiClientError,
    { minhChungId: string; ncsId?: string; payload: CreateEvaluationRequest }
  >({
    mutationFn: ({ minhChungId, payload }) =>
      ProgressService.createEvaluation(minhChungId, payload),
    onSuccess: (_data, { minhChungId, ncsId }) => {
      queryClient.invalidateQueries({
        queryKey: progressKeys.evaluations(minhChungId),
      });
      queryClient.invalidateQueries({ queryKey: progressKeys.pending() });
      if (ncsId) {
        queryClient.invalidateQueries({ queryKey: progressKeys.ncs(ncsId) });
      }
    },
  });
}

/** Làm mới các truy vấn bị ảnh hưởng sau khi duyệt / từ chối mốc (kể cả khi 409) */
function invalidateAfterReview(
  queryClient: ReturnType<typeof useQueryClient>,
  ncsId?: string
) {
  queryClient.invalidateQueries({ queryKey: progressKeys.pending() });
  if (ncsId) {
    queryClient.invalidateQueries({ queryKey: progressKeys.ncs(ncsId) });
  }
}

/** 10. Duyệt mốc (`POST /progress/reviews/:id/approve`) */
export function useApproveMilestone() {
  const queryClient = useQueryClient();

  return useMutation<
    ApproveMilestoneResponse,
    ApiClientError,
    { tienTrinhId: string; quyetDinhId: string; ncsId?: string }
  >({
    mutationFn: ({ tienTrinhId, quyetDinhId }) =>
      ProgressService.approveMilestone(tienTrinhId, quyetDinhId),
    onSuccess: (_data, { ncsId }) => invalidateAfterReview(queryClient, ncsId),
    onError: (error, { ncsId }) => {
      // 409: mốc vừa được người khác xử lý → tải lại hàng chờ
      if (error.status === 409) invalidateAfterReview(queryClient, ncsId);
    },
  });
}

/** 11. Từ chối mốc (`POST /progress/reviews/:id/reject`) */
export function useRejectMilestone() {
  const queryClient = useQueryClient();

  return useMutation<
    RejectMilestoneResponse,
    ApiClientError,
    { tienTrinhId: string; lyDo: string; ncsId?: string }
  >({
    mutationFn: ({ tienTrinhId, lyDo }) =>
      ProgressService.rejectMilestone(tienTrinhId, lyDo),
    onSuccess: (_data, { ncsId }) => invalidateAfterReview(queryClient, ncsId),
    onError: (error, { ncsId }) => {
      if (error.status === 409) invalidateAfterReview(queryClient, ncsId);
    },
  });
}
