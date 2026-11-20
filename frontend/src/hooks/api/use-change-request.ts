"use client";

import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ApiClientError } from "@/src/lib/api";
import { ChangeRequestService } from "@/src/services/change-request";
import { ncsSelfKeys } from "@/src/hooks/api/use-ncs";
import { progressKeys } from "@/src/hooks/api/use-progress";
import { thesisKeys } from "@/src/hooks/api/use-thesis";
import type {
  ApproveChangeRequestPayload,
  ChangeRequestDetailApi,
  ChangeRequestListResponse,
  CreateChangeRequestPayload,
  ListChangeRequestParams,
  SupervisorReviewPayload,
} from "@/src/types/api/change-request";
import type { MilestoneDecisionApi } from "@/src/types/api/progress";

export const changeRequestKeys = {
  all: ["change-request"] as const,
  lists: () => [...changeRequestKeys.all, "list"] as const,
  list: (params: ListChangeRequestParams) =>
    [...changeRequestKeys.lists(), params] as const,
  detail: (id: string) => [...changeRequestKeys.all, "detail", id] as const,
  approvalDecisions: (ncsId: string, loai: string) =>
    [...changeRequestKeys.all, "approval-decisions", ncsId, loai] as const,
};

/** Danh sách đơn (phạm vi do backend tự lọc theo token) */
export function useChangeRequests(
  params: ListChangeRequestParams = {},
  options?: { enabled?: boolean }
) {
  return useQuery<ChangeRequestListResponse, ApiClientError>({
    queryKey: changeRequestKeys.list(params),
    queryFn: () => ChangeRequestService.list(params),
    // Trạng thái đơn do người khác thay đổi (GVHD xác nhận, Giáo vụ duyệt) → làm mới khi quay lại tab.
    // staleTime 30s giới hạn số lần gọi khi focus liên tục; không polling.
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    enabled: options?.enabled,
  });
}

/** Chi tiết 1 đơn (gọi khi mở drawer) */
export function useChangeRequestDetail(id: string | null) {
  return useQuery<ChangeRequestDetailApi, ApiClientError>({
    queryKey: changeRequestKeys.detail(id ?? ""),
    queryFn: () => ChangeRequestService.detail(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 15,
    refetchOnWindowFocus: true,
  });
}

/** Chi tiết nhiều đơn cùng lúc (danh sách chờ duyệt thường ngắn) */
export function useChangeRequestDetails(ids: string[]) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: changeRequestKeys.detail(id),
      queryFn: () => ChangeRequestService.detail(id),
      staleTime: 1000 * 15,
      refetchOnWindowFocus: false,
    })),
  });
}

/** Quyết định căn cứ để Giáo vụ duyệt đơn (đúng NCS, còn hiệu lực) */
export function useChangeRequestApprovalDecisions(
  ncsId: string | null | undefined,
  loai: "GIAO_DE_TAI" | "PHAN_CONG_GVHD" | "GIA_HAN",
  enabled = true
) {
  return useQuery<MilestoneDecisionApi[], ApiClientError>({
    queryKey: changeRequestKeys.approvalDecisions(ncsId ?? "", loai),
    queryFn: () => ChangeRequestService.getApprovalDecisions(ncsId!, loai),
    enabled: Boolean(ncsId) && enabled,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

/** Làm mới danh sách + chi tiết đơn sau mỗi thao tác ghi */
function invalidateChangeRequests(
  queryClient: ReturnType<typeof useQueryClient>,
  id?: string
) {
  queryClient.invalidateQueries({ queryKey: changeRequestKeys.lists() });
  if (id) {
    queryClient.invalidateQueries({ queryKey: changeRequestKeys.detail(id) });
  }
}

/*
 * Phân loại lỗi 409 khi tạo đơn. Backend (change-request.service.ts) KHÔNG trả `code` riêng,
 * chỉ có `message`, nên đối chiếu đúng câu chữ backend đang dùng:
 * - kiemTraFile:  "File đính kèm này đã được sử dụng cho một đề nghị khác ..."
 * - create():     "NCS đang có một đề nghị chờ xử lý ..." / "NCS đang có một đề nghị chờ duyệt ..."
 * Nếu backend đổi câu chữ, 2 hàm dưới trả false → UI chỉ hiển thị message gốc (không đoán).
 */
export function isChangeRequestFileUsedError(error: ApiClientError | null | undefined): boolean {
  return error?.status === 409 && /File đính kèm này đã được sử dụng/.test(error.message);
}

export function isChangeRequestPendingExistsError(error: ApiClientError | null | undefined): boolean {
  return error?.status === 409 && /NCS đang có một đề nghị chờ/.test(error.message);
}

/** Tạo đơn: upload PDF trước (nếu có) → POST /change-request */
export function useCreateChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    ApiClientError,
    {
      payload: CreateChangeRequestPayload;
      file?: File | null;
      /** fileId đã upload ở lần thử trước (để "Thử lại" không upload lại) */
      uploadedFileId?: string | null;
      onUploaded?: (fileId: string) => void;
      onUploadProgress?: (percent: number) => void;
    }
  >({
    mutationFn: async ({ payload, file, uploadedFileId, onUploaded, onUploadProgress }) => {
      let fileId = uploadedFileId ?? undefined;
      if (!fileId && file) {
        fileId = await ChangeRequestService.uploadAttachment(file, onUploadProgress);
        onUploaded?.(fileId);
      }
      return ChangeRequestService.create({ ...payload, ...(fileId ? { fileId } : {}) });
    },
    onSuccess: () => invalidateChangeRequests(queryClient),
    onError: (error) => {
      // Đã có đơn khác đang chờ (vd. tạo ở tab/thiết bị khác) → làm mới để khóa nút tạo đơn
      if (isChangeRequestPendingExistsError(error)) invalidateChangeRequests(queryClient);
    },
  });
}

/** Hủy đơn đang chờ xử lý */
export function useCancelChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation<{ id: string; trangThai: string }, ApiClientError, string>({
    mutationFn: (id) => ChangeRequestService.cancel(id),
    onSuccess: (_data, id) => invalidateChangeRequests(queryClient, id),
    onError: (error, id) => {
      if (error.status === 409) invalidateChangeRequests(queryClient, id);
    },
  });
}

/** GVHD xác nhận / từ chối đơn gia hạn */
export function useSupervisorReviewChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    ApiClientError,
    { id: string; payload: SupervisorReviewPayload }
  >({
    mutationFn: ({ id, payload }) =>
      ChangeRequestService.supervisorReview(id, payload),
    onSuccess: (_data, { id }) => invalidateChangeRequests(queryClient, id),
    onError: (error, { id }) => {
      if (error.status === 409) invalidateChangeRequests(queryClient, id);
    },
  });
}

/** Giáo vụ phê duyệt đơn (ảnh hưởng đề tài, phân công, hạn, tiến trình) */
export function useApproveChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    ApiClientError,
    { id: string; payload: ApproveChangeRequestPayload }
  >({
    mutationFn: ({ id, payload }) => ChangeRequestService.approve(id, payload),
    onSuccess: () => {
      // Bao gồm cả danh sách quyết định căn cứ (quyết định vừa dùng không chọn lại được)
      queryClient.invalidateQueries({ queryKey: changeRequestKeys.all });
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      queryClient.invalidateQueries({ queryKey: thesisKeys.all });
      queryClient.invalidateQueries({ queryKey: ncsSelfKeys.all });
    },
    onError: (error, { id }) => {
      if (error.status === 409) invalidateChangeRequests(queryClient, id);
    },
  });
}

/** Giáo vụ từ chối đơn */
export function useRejectChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    ApiClientError,
    { id: string; lyDoTuChoi: string }
  >({
    mutationFn: ({ id, lyDoTuChoi }) =>
      ChangeRequestService.reject(id, lyDoTuChoi),
    onSuccess: (_data, { id }) => invalidateChangeRequests(queryClient, id),
    onError: (error, { id }) => {
      if (error.status === 409) invalidateChangeRequests(queryClient, id);
    },
  });
}
