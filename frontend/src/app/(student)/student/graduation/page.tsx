import React from "react";
import type { Metadata } from "next";
import { StudentGraduationLiveView } from "@/src/components/graduation";

export const metadata: Metadata = {
  title: "Xét tốt nghiệp cá nhân | Cổng thông tin Nghiên cứu sinh AGU",
  description:
    "Theo dõi và đối soát 6 điều kiện xét công nhận trình độ và cấp bằng Tiến sĩ của Nghiên cứu sinh.",
};

/**
 * Thin Page cho màn hình Xét tốt nghiệp cá nhân (/student/graduation).
 * Quản lý Server Metadata và ủy thác hiển thị + đối soát điều kiện từ API cho StudentGraduationLiveView.
 */
export default function StudentGraduationPage() {
  return <StudentGraduationLiveView />;
}
