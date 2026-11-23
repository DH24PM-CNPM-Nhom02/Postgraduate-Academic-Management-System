"use client";

import React, { useCallback } from "react";
import { DocumentService } from "@/src/services/document";
import {
  useCancelChangeRequest,
  useCreateChangeRequest,
  useStudentChangeRequestsOverview,
} from "@/src/hooks/api/use-change-requests";
import { Button } from "@/src/components/ui/button";
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

export function StudentChangeRequestLiveView({
  initialType = "DOI_DE_TAI",
  defaultOpenForm = false,
}: StudentChangeRequestLiveViewProps) {
  const { data, isLoading, error, refetch, candidatesError, candidatesLoading, retryCandidates } = useStudentChangeRequestsOverview();
  const createMutation = useCreateChangeRequest();
  const cancelMutation = useCancelChangeRequest();

  const handleSubmitRequest = useCallback(
    async (values: ChangeRequestFormValues, onUploadProgress: (percent: number) => void) => {
      let fileId: string | undefined;

      // Nếu có tệp đính kèm, tải lên document-service trước
      if (values.tepDinhKemFile) {
        const uploadRes = await DocumentService.uploadPdf({
          file: values.tepDinhKemFile,
          documentType: "DON_TU",
          onUploadProgress,
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

  if (isLoading || !data || error) {
    const loadError = error?.status !== 404 ? error?.message : undefined;
    return (
      <section className="mx-auto max-w-7xl space-y-4 pb-12">
        <h1 className="text-2xl font-bold text-[#0F2744]">Đơn đề nghị điều chỉnh &amp; Gia hạn học tập</h1>
        <div className="rounded-xl border border-dashed bg-card p-8 text-center text-sm">
          <p role={loadError ? "alert" : "status"}>{isLoading ? "Đang tải đơn đề nghị..." : loadError ?? "Chưa có dữ liệu đơn đề nghị."}</p>
          {loadError && <Button type="button" variant="outline" className="mt-3" onClick={() => void refetch()}>Thử lại</Button>}
        </div>
      </section>
    );
  }

  return (
    <>
      {candidatesError && (
        <div role="alert" className="mb-4 rounded-xl border border-destructive/30 bg-card p-4 text-sm">
          Không thể tải danh sách GVHD để đề xuất thay đổi.
          <Button type="button" variant="outline" className="ml-3" onClick={() => void retryCandidates()}>Thử lại</Button>
        </div>
      )}
      {candidatesLoading && <p role="status" className="mb-4 text-sm text-muted-foreground">Đang tải danh sách GVHD có thể đề xuất...</p>}
      <ChangeRequestWorkspace
        initialOverview={data}
        initialType={initialType}
        defaultOpenForm={defaultOpenForm}
        onSubmitRequest={handleSubmitRequest}
        onCancelRequest={handleCancelRequest}
      />
    </>
  );
}

export default StudentChangeRequestLiveView;
