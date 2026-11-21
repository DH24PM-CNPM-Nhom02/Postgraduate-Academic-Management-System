"use client";

import React from "react";
import { useStudentGraduationOverview } from "@/src/hooks/api/use-graduation";
import {
  mockGraduationEligibleOverview,
  mockGraduationNotEligibleOverview,
} from "@/src/mocks/graduation";
import { GraduationWorkspace } from "./GraduationWorkspace";

/**
 * StudentGraduationLiveView
 *
 * Cầu nối giữa API Xét tốt nghiệp và UI GraduationWorkspace.
 * - Tự động đối soát 6 điều kiện xét tốt nghiệp thật của Nghiên cứu sinh (từ tiến trình 9 mốc,
 *   thời hạn 72 tháng, chuẩn ngoại ngữ, tình trạng công nợ và đơn đề nghị chờ duyệt).
 * - Tự động dự phòng các kịch bản mẫu nếu chưa đăng nhập hoặc Backend chưa có dữ liệu.
 */
export function StudentGraduationLiveView() {
  const { data, isLoading, error, refetch } = useStudentGraduationOverview();

  const hasRealData = Boolean(data);
  const displayOverview = data ?? mockGraduationEligibleOverview;

  return (
    <GraduationWorkspace
      overview={displayOverview}
      scenarios={
        hasRealData
          ? undefined
          : [
              {
                id: "eligible",
                label: "Đủ điều kiện (6/6)",
                data: mockGraduationEligibleOverview,
              },
              {
                id: "ineligible",
                label: "Chưa đủ điều kiện (4/6)",
                data: mockGraduationNotEligibleOverview,
              },
            ]
      }
      isLoading={isLoading && !hasRealData}
      error={hasRealData ? null : (error?.message ?? null)}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}

export default StudentGraduationLiveView;
