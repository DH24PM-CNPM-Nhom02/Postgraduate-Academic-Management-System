"use client";

import React from "react";
import { useStudentProgressData } from "@/src/hooks/api/use-progress";
import { mockProgressData } from "@/src/mocks/progress";
import { StudentProgressContainer } from "./student-progress-container";

/**
 * StudentProgressLiveView
 *
 * Thành phần cầu nối giữa tầng React Query (`useStudentProgressData`)
 * và giao diện `StudentProgressContainer` cho trang `/student/progress`.
 *
 * Cơ chế Fallback:
 * - Khi Backend bật và kết nối thành công: Dùng dữ liệu thật từ API.
 * - Khi chưa bật Backend (hoặc mất kết nối): Tự động lấy dữ liệu mẫu (mockProgressData)
 *   để giao diện luôn hiển thị đầy đủ 9 mốc cho người dùng xem và trải nghiệm.
 */
export function StudentProgressLiveView() {
  const { data, isLoading, error, refetch } = useStudentProgressData();

  // Ưu tiên dữ liệu thật từ API; nếu chưa có (chưa bật backend) thì fallback về mock
  const displayData = data ?? mockProgressData;
  const hasRealData = Boolean(data);

  return (
    <StudentProgressContainer
      initialData={displayData}
      isLoading={isLoading && !hasRealData}
      error={hasRealData ? (error?.message ?? null) : null}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default StudentProgressLiveView;
