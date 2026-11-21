import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ThesesManagementView } from "@/src/components/academic/theses";

export const metadata: Metadata = {
  title: "Quản lý Đề tài Luận án | Quản trị Hệ thống SĐH",
  description:
    "Phân hệ quản lý đề tài luận án tiến sĩ và phân công cán bộ hướng dẫn dành cho Quản trị viên.",
};

export default function AdminThesesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải danh sách Đề tài Luận án...
        </div>
      }
    >
      <ThesesManagementView  area="admin" />
    </Suspense>
  );
}
