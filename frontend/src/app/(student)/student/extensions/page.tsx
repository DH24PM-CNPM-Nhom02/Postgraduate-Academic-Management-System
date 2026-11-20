import React from "react";
import type { Metadata } from "next";
import { StudentChangeRequestsLiveView } from "@/src/components/change-request";

export const metadata: Metadata = {
  title: "Đơn đề nghị & Gia hạn học tập | Cổng thông tin Nghiên cứu sinh AGU",
  description:
    "Lập và theo dõi đơn đề nghị điều chỉnh tên đề tài, thay đổi giảng viên hướng dẫn và gia hạn thời gian học tập của Nghiên cứu sinh.",
};

/**
 * Thin Page cho màn hình Đơn đề nghị điều chỉnh & Gia hạn học tập (/student/extensions).
 * Chỉ định nghĩa Server Metadata; dữ liệu thật do Client Container tự tải qua React Query.
 */
export default function StudentExtensionsPage() {
  return <StudentChangeRequestsLiveView />;
}
