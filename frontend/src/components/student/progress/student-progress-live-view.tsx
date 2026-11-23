"use client";

import { useStudentProgressData } from "@/src/hooks/api/use-progress";
import { StudentProgressContainer } from "./student-progress-container";

export function StudentProgressLiveView() {
  const { data, isLoading, error, refetch } = useStudentProgressData();

  return (
    <StudentProgressContainer
      initialData={data}
      isLoading={isLoading && !data}
      error={error?.status === 404 ? null : error?.message}
      onRetry={() => void refetch()}
    />
  );
}

export default StudentProgressLiveView;
