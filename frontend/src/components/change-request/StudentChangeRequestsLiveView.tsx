"use client";

import React, { useMemo } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { buildStudentChangeRequestsOverview } from "@/src/adapters/change-request";
import { useChangeRequests } from "@/src/hooks/api/use-change-request";
import { useMyNcsProfile, useMySupervisors } from "@/src/hooks/api/use-ncs";
import { useMyThesis } from "@/src/hooks/api/use-thesis";
import { ChangeRequestWorkspace } from "./ChangeRequestWorkspace";

/** Lấy tối đa 100 đơn (giới hạn của backend) — mỗi NCS chỉ có số ít đơn */
const LIST_PARAMS = { page: 1, limit: 100 } as const;

/**
 * StudentChangeRequestsLiveView
 *
 * Ghép dữ liệu thật cho màn hình Đơn đề nghị của NCS (/student/extensions):
 * - GET /ncs/me              → thời hạn đào tạo, trạng thái mốc 2 / mốc 8
 * - GET /thesis/ncs/me       → tên đề tài hiện tại
 * - GET /gvhd/my-supervisors → GVHD hiện tại (chọn phân công cần đổi)
 * - GET /change-request      → danh sách đơn của chính NCS
 */
export function StudentChangeRequestsLiveView() {
  const profileQuery = useMyNcsProfile();
  const thesisQuery = useMyThesis();
  const supervisorsQuery = useMySupervisors();
  const requestsQuery = useChangeRequests(LIST_PARAMS);

  const overview = useMemo(() => {
    if (!profileQuery.data) return null;
    return buildStudentChangeRequestsOverview({
      profile: profileQuery.data,
      thesis: thesisQuery.data,
      supervisors: supervisorsQuery.data ?? [],
      requests: requestsQuery.data?.data ?? [],
    });
  }, [profileQuery.data, thesisQuery.data, supervisorsQuery.data, requestsQuery.data]);

  if (profileQuery.isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        <span>Đang tải hồ sơ và đơn đề nghị...</span>
      </div>
    );
  }

  if (profileQuery.isError || !overview) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-800">
        <AlertCircle className="size-6" aria-hidden="true" />
        <p>{profileQuery.error?.message ?? "Không tải được hồ sơ nghiên cứu sinh."}</p>
        <button
          type="button"
          onClick={() => void profileQuery.refetch()}
          className="rounded-lg border border-rose-200 bg-white px-4 py-1.5 text-xs font-semibold hover:bg-rose-100 cursor-pointer"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Lỗi phụ (đề tài / GVHD) không chặn trang nhưng cần báo để NCS biết dữ liệu form có thể thiếu
  const secondaryError =
    thesisQuery.error?.status && thesisQuery.error.status !== 404
      ? thesisQuery.error.message
      : supervisorsQuery.error?.message;

  return (
    <div className="space-y-4">
      {secondaryError && (
        <div
          role="alert"
          className="mx-auto flex max-w-7xl items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900"
        >
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          <span>Một số thông tin bổ trợ chưa tải được: {secondaryError}</span>
        </div>
      )}
      <ChangeRequestWorkspace
        initialOverview={overview}
        isLoading={requestsQuery.isLoading}
        error={requestsQuery.error?.message ?? null}
        onRetry={() => void requestsQuery.refetch()}
      />
    </div>
  );
}

export default StudentChangeRequestsLiveView;
