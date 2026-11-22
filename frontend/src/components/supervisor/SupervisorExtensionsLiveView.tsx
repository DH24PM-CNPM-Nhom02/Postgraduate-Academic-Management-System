"use client";

import React, { useMemo, useState } from "react";
import { mapSupervisorExtensionRequests } from "@/src/adapters/change-request";
import {
  useSupervisorChangeRequests,
  useSupervisorReviewChangeRequest,
} from "@/src/hooks/api/use-change-requests";
import { useChangeRequestDetail } from "@/src/hooks/use-change-requests";
import {
  useMySupervisedStudents,
  useMySupervisorProfile,
} from "@/src/hooks/use-academic";
import { parseApiError } from "@/src/lib/api";
import type { ChangeRequestDetail } from "@/src/types/api/change-request";
import type { SupervisorExtensionDecisionAction } from "@/src/types/ui/supervisor";
import { SupervisorExtensionsWorkspace } from "./SupervisorExtensionsWorkspace";

/** Backend giới hạn `limit` tối đa 100 (ListDeNghiQuery); GVHD thường có ít đơn cần xác nhận */
const LIST_PARAMS = { page: 1, limit: 100 } as const;

/**
 * SupervisorExtensionsLiveView
 *
 * Container nối màn hình Thẩm định đơn (/supervisor/extensions) với API thật:
 * - GET   /change-request                        → đơn liên quan GVHD (backend tự lọc theo token)
 * - GET   /change-request/:id                    → chi tiết đơn đang mở (hạn hiện tại, đề tài hiện tại...)
 * - GET   /gvhd/me, GET /gvhd/me/ncs             → gvhdId hiện tại + thông tin NCS đang hướng dẫn
 * - PATCH /change-request/:id/supervisor-review  → { dongY, nhanXet? }
 *
 * Xử lý cả đơn GIA_HAN và đơn DOI_DE_TAI do NCS tự nộp (đều cần tập thể GVHD xác nhận).
 */
export function SupervisorExtensionsLiveView() {
  const requestsQuery = useSupervisorChangeRequests(LIST_PARAMS);
  const profileQuery = useMySupervisorProfile();
  const studentsQuery = useMySupervisedStudents();
  const reviewMutation = useSupervisorReviewChangeRequest();

  // Đơn đang mở drawer → tải chi tiết để có dữ liệu do backend tính (không tự suy ở FE)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailQuery = useChangeRequestDetail(selectedId ?? "", Boolean(selectedId));

  const requests = useMemo(() => {
    const detailById = new Map<string, ChangeRequestDetail>();
    if (detailQuery.data) detailById.set(detailQuery.data.id, detailQuery.data);
    return mapSupervisorExtensionRequests({
      requests: requestsQuery.data?.data ?? [],
      students: studentsQuery.data ?? [],
      myGvhdId: profileQuery.data?.id,
      detailById,
    });
  }, [requestsQuery.data, studentsQuery.data, profileQuery.data, detailQuery.data]);

  const handleReview = async (
    requestId: string,
    action: SupervisorExtensionDecisionAction,
    comment: string
  ) => {
    // Lỗi (403 không thuộc danh sách, 400 đã xác nhận, 409 đơn đã đổi trạng thái...) được ném lại để drawer hiển thị
    await reviewMutation.mutateAsync({
      id: requestId,
      payload: {
        dongY: action === "DONG_Y",
        ...(comment.trim() ? { nhanXet: comment.trim() } : {}),
      },
    });
  };

  // Lỗi hồ sơ GVHD không chặn xem danh sách, nhưng phải báo vì thao tác thẩm định bị khóa
  const error =
    requestsQuery.error?.message ??
    (profileQuery.error
      ? `Không tải được hồ sơ GVHD (${parseApiError(profileQuery.error).message}). Chức năng thẩm định tạm khóa.`
      : null);

  return (
    <SupervisorExtensionsWorkspace
      requests={requests}
      // Chỉ truyền id khi đã tải được hồ sơ GVHD; không suy đoán id
      currentSupervisorId={profileQuery.data?.id}
      isLoading={requestsQuery.isLoading || profileQuery.isLoading}
      error={error}
      onRetry={() => {
        void requestsQuery.refetch();
        void profileQuery.refetch();
      }}
      onReviewExtension={handleReview}
      onSelectedRequestChange={setSelectedId}
      selectedRequestDetail={{
        isLoading: detailQuery.isLoading,
        error:
          detailQuery.isError && !detailQuery.data
            ? parseApiError(detailQuery.error).message
            : null,
        onRetry: () => void detailQuery.refetch(),
      }}
    />
  );
}

export default SupervisorExtensionsLiveView;
