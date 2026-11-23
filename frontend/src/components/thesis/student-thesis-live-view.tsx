"use client";

import React from "react";
import { useStudentThesisData } from "@/src/hooks/api/use-thesis";
import { MyThesisCard } from "./MyThesisCard";
import { ThesisHistory } from "./ThesisHistory";

export function StudentThesisLiveView() {
  const { data, isLoading, error, refetch } = useStudentThesisData();

  const message = error?.status === 404 ? null : error?.message;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Tiêu đề trang & Thông tin NCS */}
      <header className="border-b border-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-[#0F2744] sm:text-2xl">
          Đề tài luận án của tôi
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Thông tin đề tài luận án và lịch sử điều chỉnh
          {data && <> của <strong className="font-semibold text-foreground">{data.hoTenNcs}</strong> ({data.mshv})</>}.
        </p>
      </header>

      {/* Thẻ hiển thị đề tài hiện tại */}
      <MyThesisCard
        thesis={data?.deTaiHienTai ?? null}
        trainingDeadline={data?.hanDaoTao72Thang}
        isLoading={isLoading && !data}
        error={message}
        onRetry={() => {
          void refetch();
        }}
      />

      {/* Bảng lịch sử các quyết định và đề tài cũ */}
      <ThesisHistory
        items={data?.lichSuDeTai ?? []}
        isLoading={isLoading && !data}
        error={message}
        onRetry={() => {
          void refetch();
        }}
      />
    </div>
  );
}

export default StudentThesisLiveView;
