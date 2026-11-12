"use client";

import React from "react";
import { useStudentProgressData } from "@/src/hooks/api/use-progress";
import { StudentProgressContainer } from "./student-progress-container";

/**
 * StudentProgressLiveView
 *
 * Thành phần cầu nối giữa tầng React Query (`useStudentProgressData`)
 * và giao diện `StudentProgressContainer` cho trang `/student/progress`.
 */
export function StudentProgressLiveView() {
  const { data, isLoading, isFetching, error, refetch } =
    useStudentProgressData();

  return (
    <StudentProgressContainer
      initialData={data}
      isLoading={isLoading || (isFetching && !data)}
      error={error?.message ?? null}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default StudentProgressLiveView;
