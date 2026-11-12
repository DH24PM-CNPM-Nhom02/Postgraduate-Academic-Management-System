import React from "react";
import type { Metadata } from "next";
import { GraduationWorkspace } from "@/src/components/graduation";
import {
  mockGraduationEligibleOverview,
  mockGraduationNotEligibleOverview,
} from "@/src/mocks/graduation";

export const metadata: Metadata = {
  title: "Xét tốt nghiệp cá nhân | Cổng thông tin Nghiên cứu sinh AGU",
  description:
    "Theo dõi và đối soát 6 điều kiện xét công nhận trình độ và cấp bằng Tiến sĩ của Nghiên cứu sinh.",
};

/**
 * Thin Page cho màn hình Xét tốt nghiệp cá nhân (/student/graduation).
 * Chỉ định nghĩa Server Metadata và truyền mock data từ `src/mocks/graduation.ts`.
 */
export default function StudentGraduationPage() {
  return (
    <GraduationWorkspace
      overview={mockGraduationEligibleOverview}
      scenarios={[
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
      ]}
    />
  );
}
