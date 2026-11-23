"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { throwApiError, type ApiClientError } from "@/src/lib/api";
import { ChangeRequestService } from "@/src/services/change-request";
import { GvhdService } from "@/src/services/gvhd";
import {
  buildStudentChangeRequestsOverview,
} from "@/src/adapters/change-request";
import type {
  ChangeRequestApiItem,
  CreateChangeRequestApiPayload,
  ChangeRequestListResponse,
  SupervisorReviewPayload,
} from "@/src/types/api/change-request";
import type { StudentChangeRequestsOverview } from "@/src/types/ui/change-request";
import { useMyNcsProfile } from "./use-ncs";
import { useMyProgress } from "./use-progress";

export const changeRequestKeys = {
  all: ["change-request"] as const,
  lists: () => [...changeRequestKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...changeRequestKeys.lists(), params] as const,
  details: () => [...changeRequestKeys.all, "detail"] as const,
  detail: (id: string) => [...changeRequestKeys.details(), id] as const,
};

export function useSupervisorCandidates(enabled = true) {
  return useQuery({
    queryKey: ["gvhd", "candidates"],
    queryFn: ({ signal }) => GvhdService.listCandidates(signal),
    enabled,
    staleTime: 60_000,
  });
}

/**
 * Hook tải danh sách đơn đề nghị của NCS
 */
export function useChangeRequests() {
  return useQuery<ChangeRequestListResponse, ApiClientError>({
    queryKey: changeRequestKeys.list(),
    queryFn: ({ signal }) => ChangeRequestService.list(undefined, signal).catch(throwApiError),
    staleTime: 1000 * 60 * 2, // 2 phút
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook tạo mới đơn đề nghị
 */
export function useCreateChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    ChangeRequestApiItem,
    ApiClientError,
    CreateChangeRequestApiPayload
  >({
    mutationFn: (payload) => ChangeRequestService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: changeRequestKeys.all,
      });
    },
  });
}

/**
 * Hook hủy đơn đề nghị
 */
export function useCancelChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation<ChangeRequestApiItem, ApiClientError, string>({
    mutationFn: (id) => ChangeRequestService.cancel(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: changeRequestKeys.all,
      });
    },
  });
}

/**
 * Hook tổng hợp toàn bộ dữ liệu cho Tab Đơn đề nghị & Gia hạn (/student/extensions)
 */
export function useStudentChangeRequestsOverview() {
  const requestsQuery = useChangeRequests();
  const profileQuery = useMyNcsProfile();
  const progressQuery = useMyProgress();
  const candidatesQuery = useSupervisorCandidates();

  const data: StudentChangeRequestsOverview | undefined = useMemo(() => {
    if (!requestsQuery.data || !profileQuery.data) return undefined;
    const items = requestsQuery.data.data || [];
    return buildStudentChangeRequestsOverview(
      items,
      profileQuery.data,
      progressQuery.data,
      candidatesQuery.data
    );
  }, [requestsQuery.data, profileQuery.data, progressQuery.data, candidatesQuery.data]);

  const refetch = async () => {
    await Promise.all([
      requestsQuery.refetch(),
      profileQuery.refetch(),
      progressQuery.refetch(),
      candidatesQuery.refetch(),
    ]);
  };

  return {
    data,
    isLoading: requestsQuery.isLoading || profileQuery.isLoading,
    isError: requestsQuery.isError || profileQuery.isError,
    error: requestsQuery.error || profileQuery.error,
    candidatesError: candidatesQuery.error,
    candidatesLoading: candidatesQuery.isLoading,
    retryCandidates: candidatesQuery.refetch,
    refetch,
  };
}

/* =========================================================================
   GVHD: THẨM ĐỊNH ĐƠN GIA HẠN / ĐỔI ĐỀ TÀI (NCS TỰ NỘP)
   ========================================================================= */

/**
 * Danh sách đơn liên quan GVHD đang đăng nhập (`GET /change-request`).
 * Backend tự giới hạn phạm vi theo token; không lọc `loai` để lấy cả GIA_HAN và DOI_DE_TAI
 * (adapter lọc tiếp các đơn có `xacNhanGvhds`). Làm mới khi quay lại tab vì trạng thái
 * do GVHD khác / Giáo vụ thay đổi; không polling.
 */
export function useSupervisorChangeRequests(params: { page: number; limit: number }) {
  return useQuery<ChangeRequestListResponse, ApiClientError>({
    queryKey: changeRequestKeys.list({ scope: "supervisor", ...params }),
    queryFn: ({ signal }) =>
      ChangeRequestService.list(params, signal).catch(throwApiError),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
}

/**
 * GVHD gửi ý kiến (`PATCH /change-request/:id/supervisor-review`).
 * Không cập nhật lạc quan: làm mới cả cache NCS (`["change-request"]`) và Giáo vụ
 * (`["academic", "change-requests"]`) để trạng thái lấy lại từ server.
 */
export function useSupervisorReviewChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    ApiClientError,
    { id: string; payload: SupervisorReviewPayload }
  >({
    mutationFn: ({ id, payload }) => ChangeRequestService.supervisorReview(id, payload),
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: changeRequestKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["academic", "change-requests"] }),
      ]),
  });
}
