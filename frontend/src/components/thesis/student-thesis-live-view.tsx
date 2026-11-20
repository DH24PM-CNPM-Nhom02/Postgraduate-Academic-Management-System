"use client";

import React from "react";
import { useStudentThesisData } from "@/src/hooks/api/use-thesis";
import { mockStudentThesisOverview } from "@/src/mocks/thesis";
import { MyThesisCard } from "./MyThesisCard";
import { ThesisHistory } from "./ThesisHistory";

/**
 * StudentThesisLiveView
 *
 * Cầu nối giữa API React Query (`useStudentThesisData`) và các UI Component hiển thị đề tài.
 *
 * Cơ chế Fallback thân thiện:
 * - Khi Backend bật và trả dữ liệu: Hiển thị đề tài thật từ Database.
 * - Khi chưa bật Backend (hoặc mất mạng): Tự động dự phòng về `mockStudentThesisOverview`
 *   giúp người dùng và người phát triển luôn xem được trọn vẹn giao diện.
 */
export function StudentThesisLiveView() {
  const { data, isLoading, error, refetch } = useStudentThesisData();

  // Tự động dùng mock khi chưa có dữ liệu từ backend
  const displayData = data ?? mockStudentThesisOverview;
  const hasRealData = Boolean(data);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Tiêu đề trang & Thông tin NCS */}
      <header className="border-b border-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-[#0F2744] sm:text-2xl">
          Đề tài luận án của tôi
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Thông tin đề tài luận án tiến sĩ chính thức và lịch sử các quyết định điều chỉnh của NCS{" "}
          <strong className="font-semibold text-foreground">
            {displayData.hoTenNcs}
          </strong>{" "}
          (<span className="font-mono">{displayData.mshv}</span>).
        </p>
      </header>

      {/* Thẻ hiển thị đề tài hiện tại */}
      <MyThesisCard
        thesis={displayData.deTaiHienTai}
        trainingDeadline={displayData.hanDaoTao72Thang}
        isLoading={isLoading && !hasRealData}
        error={hasRealData ? (error?.message ?? null) : null}
        onRetry={() => {
          void refetch();
        }}
      />

      {/* Bảng lịch sử các quyết định và đề tài cũ */}
      <ThesisHistory
        items={displayData.lichSuDeTai}
        isLoading={isLoading && !hasRealData}
        error={hasRealData ? (error?.message ?? null) : null}
        onRetry={() => {
          void refetch();
        }}
      />
    </div>
  );
}

export default StudentThesisLiveView;
