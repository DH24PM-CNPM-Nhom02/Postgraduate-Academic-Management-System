import React from "react";
import type { Metadata } from "next";
import { MySupervisorList } from "@/src/components/supervisor";

export const metadata: Metadata = {
  title: "Giảng viên hướng dẫn của tôi | Cổng thông tin Nghiên cứu sinh AGU",
  description:
    "Xem danh sách giảng viên hướng dẫn chính, đồng hướng dẫn, trọng số định mức và quyết định phân công của Nghiên cứu sinh.",
};

/**
 * Thin Page cho màn hình Giảng viên hướng dẫn của tôi (/student/supervisors).
 * Quản lý Server Metadata và ủy thác hiển thị + tải dữ liệu từ API cho MySupervisorList.
 */
export default function StudentSupervisorsPage() {
  return (
    <div className="mx-auto max-w-7xl pb-12">
      <MySupervisorList />
    </div>
  );
}
