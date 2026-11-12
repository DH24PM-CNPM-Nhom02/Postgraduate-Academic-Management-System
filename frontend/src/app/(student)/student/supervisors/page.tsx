import React from "react";
import type { Metadata } from "next";
import { MySupervisorList } from "@/src/components/supervisor";
import { mockStudentSupervisorsOverview } from "@/src/mocks/thesis";

export const metadata: Metadata = {
  title: "Giảng viên hướng dẫn của tôi | Cổng thông tin Nghiên cứu sinh AGU",
  description:
    "Xem danh sách giảng viên hướng dẫn chính, đồng hướng dẫn, trọng số định mức và quyết định phân công của Nghiên cứu sinh.",
};

/**
 * Thin Page cho màn hình Giảng viên hướng dẫn của tôi (/student/supervisors).
 * Chỉ định nghĩa Metadata và truyền dữ liệu từ mock vào Component hiển thị.
 */
export default function StudentSupervisorsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <header className="border-b border-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-[#0F2744] sm:text-2xl">
          Giảng viên hướng dẫn của tôi
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Danh sách người hướng dẫn khoa học được phân công cho NCS{" "}
          <strong className="font-semibold text-foreground">
            {mockStudentSupervisorsOverview.hoTenNcs}
          </strong>{" "}
          (<span className="font-mono">{mockStudentSupervisorsOverview.mshv}</span>).
        </p>
      </header>

      <MySupervisorList
        supervisors={mockStudentSupervisorsOverview.danhSachGvhd}
      />
    </div>
  );
}
