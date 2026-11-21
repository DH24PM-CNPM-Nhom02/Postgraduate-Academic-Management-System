"use client";

import React, { useCallback } from "react";
import { DocumentService } from "@/src/services/document";
import {
  useCancelChangeRequest,
  useCreateChangeRequest,
  useStudentChangeRequestsOverview,
} from "@/src/hooks/api/use-change-requests";
import { mockStudentChangeRequestsOverview } from "@/src/mocks/change-request";
import type {
  ChangeRequestFormValues,
  ChangeRequestItem,
  ChangeRequestType,
} from "@/src/types/ui/change-request";
import { ChangeRequestWorkspace } from "./ChangeRequestWorkspace";

interface StudentChangeRequestLiveViewProps {
  initialType?: ChangeRequestType;
  defaultOpenForm?: boolean;
}

/**
 * StudentChangeRequestLiveView
 *
 * Cầu nối giữa các API /change-request và UI ChangeRequestWorkspace.
 * - Tự động tải dữ liệu thật từ Backend (NCS hiện tại, các đề tài, hạn đào tạo, danh sách đơn).
 * - Tự động dự phòng về mock data nếu Backend chưa có dữ liệu hoặc lỗi mạng.
 * - Xử lý tải lên file minh chứng qua DocumentService trước khi gửi đơn đề nghị.
 */
export function StudentChangeRequestLiveView({
  initialType = "DOI_DE_TAI",
  defaultOpenForm = false,
}: StudentChangeRequestLiveViewProps) {
  const { data, isLoading, error, refetch } = useStudentChangeRequestsOverview();
  const createMutation = useCreateChangeRequest();
  const cancelMutation = useCancelChangeRequest();

  const displayData = data ?? mockStudentChangeRequestsOverview;

  const handleSubmitRequest = useCallback(
    async (values: ChangeRequestFormValues) => {
      let fileId: string | undefined;

      // Nếu có tệp đính kèm, tải lên document-service trước
      if (values.tepDinhKemFile) {
        const uploadRes = await DocumentService.uploadPdf({
          file: values.tepDinhKemFile,
          documentType: "DON_TU",
        });
        fileId = uploadRes.id;
      }

      await createMutation.mutateAsync({
        loai: values.loaiDon,
        lyDo: values.lyDo,
        batKhaKhang: values.batKhaKhang,
        fileId,
        soThangGiaHan: values.soThangGiaHan,
        tenDeTaiMoi: values.tenDeTaiMoi,
        phanCongCuId: values.phanCongCuId,
        gvhdMoiId: values.gvhdMoiId,
      });

      await refetch();
    },
    [createMutation, refetch]
  );

  const handleCancelRequest = useCallback(
    async (request: ChangeRequestItem) => {
      await cancelMutation.mutateAsync(request.id);
      await refetch();
    },
    [cancelMutation, refetch]
  );

  return (
    <ChangeRequestWorkspace
      key={displayData.danhSachDon.map((d) => `${d.id}-${d.trangThai}`).join(",")}
      initialOverview={displayData}
      initialType={initialType}
      defaultOpenForm={defaultOpenForm}
      onSubmitRequest={handleSubmitRequest}
      onCancelRequest={handleCancelRequest}
      isLoading={isLoading && !data}
      error={data ? null : (error?.message ?? null)}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default StudentChangeRequestLiveView;
