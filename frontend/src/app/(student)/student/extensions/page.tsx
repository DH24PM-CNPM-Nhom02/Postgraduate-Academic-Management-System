import React from "react";
import type { Metadata } from "next";
import { ChangeRequestWorkspace } from "@/src/components/change-request";
import { mockStudentChangeRequestsOverview } from "@/src/mocks/change-request";

export const metadata: Metadata = {
  title: "Đơn đề nghị & Gia hạn học tập | Cổng thông tin Nghiên cứu sinh AGU",
  description:
    "Lập và theo dõi đơn đề nghị điều chỉnh tên đề tài, thay đổi giảng viên hướng dẫn và gia hạn thời gian học tập của Nghiên cứu sinh.",
};

/**
 * Thin Page cho màn hình Đơn đề nghị điều chỉnh & Gia hạn học tập (/student/extensions).
 * Chỉ định nghĩa Server Metadata và truyền dữ liệu từ mock vào Container Component.
 */
export default function StudentExtensionsPage() {
  return (
    <ChangeRequestWorkspace
      initialOverview={mockStudentChangeRequestsOverview}
    />
  );
}
