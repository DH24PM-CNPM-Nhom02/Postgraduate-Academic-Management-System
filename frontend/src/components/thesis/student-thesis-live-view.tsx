"use client";

import React from "react";
import { useStudentThesisData } from "@/src/hooks/api/use-thesis";
import { MyThesisCard } from "./MyThesisCard";
import { ThesisHistory } from "./ThesisHistory";

/**
 * StudentThesisLiveView
 *
 * Cầu nối giữa API React Query (`useStudentThesisData`) và các UI Component hiển thị đề tài.
 *
 * Chỉ hiển thị dữ liệu thật từ API (không dùng dữ liệu mẫu khi lỗi):
 * - Đang tải lần đầu → trạng thái loading của từng khối.
 * - Lỗi và chưa có dữ liệu → thông báo lỗi + nút thử lại ở từng khối.
 * - Thành công → đề tài hiện tại (hoặc empty state nếu chưa được giao) và lịch sử.
 */
export function StudentThesisLiveView() {
  const { data, isLoading, error, refetch } = useStudentThesisData();

  const hasData = Boolean(data);
  // Chỉ chặn hiển thị bằng lỗi khi chưa có dữ liệu thật nào
  const blockingError = !hasData ? (error?.message ?? null) : null;
  const showLoading = isLoading && !hasData;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Tiêu đề trang & Thông tin NCS */}
      <header className="border-b border-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-[#0F2744] sm:text-2xl">
          Đề tài luận án của tôi
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Thông tin đề tài luận án tiến sĩ chính thức và lịch sử các quyết định điều chỉnh
          {data ? (
            <>
              {" "}của NCS{" "}
              <strong className="font-semibold text-foreground">
                {data.hoTenNcs}
              </strong>{" "}
              (<span className="font-mono">{data.mshv}</span>)
            </>
          ) : null}
          .
        </p>
      </header>

      {/* Thẻ hiển thị đề tài hiện tại */}
      <MyThesisCard
        thesis={data?.deTaiHienTai ?? null}
        trainingDeadline={data?.hanDaoTao72Thang}
        isLoading={showLoading}
        error={blockingError}
        onRetry={() => {
          void refetch();
        }}
      />

      {/* Bảng lịch sử các quyết định và đề tài cũ */}
      <ThesisHistory
        items={data?.lichSuDeTai ?? []}
        isLoading={showLoading}
        error={blockingError}
        onRetry={() => {
          void refetch();
        }}
      />
    </div>
  );
}

export default StudentThesisLiveView;
