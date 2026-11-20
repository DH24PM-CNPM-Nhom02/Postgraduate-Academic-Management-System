"use client";

import React, { useMemo, useState } from "react";
import { mapSupervisorExtensionRequests } from "@/src/adapters/change-request";
import {
  useChangeRequestDetail,
  useChangeRequests,
  useSupervisorReviewChangeRequest,
} from "@/src/hooks/api/use-change-request";
import type { ChangeRequestDetailApi } from "@/src/types/api/change-request";
import {
  useMySupervisedStudents,
  useMySupervisorProfile,
} from "@/src/hooks/use-academic";
import type { SupervisorExtensionDecisionAction } from "@/src/types/ui/supervisor";
import { SupervisorExtensionsWorkspace } from "./SupervisorExtensionsWorkspace";

/** Backend giới hạn limit tối đa 100; GVHD thường có ít đơn gia hạn */
const LIST_PARAMS = { loai: "GIA_HAN", page: 1, limit: 100 } as const;

/**
 * SupervisorExtensionsLiveView
 *
 * Nối màn hình Thẩm định đơn gia hạn (/supervisor/extensions) với API thật:
 * - GET  /change-request?loai=GIA_HAN               → đơn liên quan GVHD (backend tự lọc theo token)
 * - GET  /gvhd/me, GET /gvhd/me/ncs                 → gvhdId hiện tại + thông tin NCS đang hướng dẫn
 * - PATCH /change-request/:id/supervisor-review     → { dongY, nhanXet? }
 */
export function SupervisorExtensionsLiveView() {
  const requestsQuery = useChangeRequests(LIST_PARAMS);
  const profileQuery = useMySupervisorProfile();
  const studentsQuery = useMySupervisedStudents();
  const reviewMutation = useSupervisorReviewChangeRequest();

  // Đơn đang mở drawer → tải chi tiết để có `hanHienTai`, `tongThangDaGiaHanTruoc` do backend tính
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailQuery = useChangeRequestDetail(selectedId);

  const requests = useMemo(() => {
    const detailById = new Map<string, ChangeRequestDetailApi>();
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
    await reviewMutation.mutateAsync({
      id: requestId,
      payload: {
        dongY: action === "DONG_Y",
        ...(comment.trim() ? { nhanXet: comment.trim() } : {}),
      },
    });
  };

  // Lỗi hồ sơ GVHD không chặn xem danh sách đơn, nhưng phải báo vì thao tác thẩm định bị khóa
  const error =
    requestsQuery.error?.message ??
    (profileQuery.error instanceof Error
      ? `Không tải được hồ sơ GVHD (${profileQuery.error.message}). Chức năng thẩm định tạm khóa.`
      : null);

  return (
    <SupervisorExtensionsWorkspace
      requests={requests}
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
        error: detailQuery.error?.message ?? null,
        onRetry: () => void detailQuery.refetch(),
      }}
    />
  );
}

export default SupervisorExtensionsLiveView;
