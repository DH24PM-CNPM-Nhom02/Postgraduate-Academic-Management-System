"use client";

import React from "react";
import { useStudentProgressData } from "@/src/hooks/api/use-progress";
import { StudentProgressContainer } from "./student-progress-container";

/**
 * StudentProgressLiveView
 *
 * Thành phần cầu nối giữa tầng React Query (`useStudentProgressData`)
 * và giao diện `StudentProgressContainer` cho trang `/student/progress`.
 *
 * Chỉ hiển thị dữ liệu thật từ API (không dùng dữ liệu mẫu khi lỗi):
 * - Đang tải lần đầu → skeleton.
 * - Lỗi và chưa có dữ liệu → thông báo lỗi + nút thử lại.
 * - Thành công nhưng rỗng → empty state của container.
 * - Đã có dữ liệu mà lần làm mới sau bị lỗi → giữ dữ liệu thật đã tải.
 */
export function StudentProgressLiveView() {
  const { data, isLoading, error, refetch } = useStudentProgressData();

  return (
    <StudentProgressContainer
      initialData={data}
      isLoading={isLoading && !data}
      error={!data ? (error?.message ?? null) : null}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default StudentProgressLiveView;
