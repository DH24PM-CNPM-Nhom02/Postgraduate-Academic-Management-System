import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ThesesManagementView } from "@/src/components/academic/theses";

export const metadata: Metadata = {
  title: "Quản lý Đề tài Luận án | Hệ thống Quản lý Đào tạo Sau đại học",
  description:
    "Phân hệ quản lý đề tài luận án tiến sĩ, lịch sử điều chỉnh đề tài và phân công giảng viên hướng dẫn.",
};

export default function AcademicThesesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải danh sách Đề tài Luận án...
        </div>
      }
    >
      <ThesesManagementView />
    </Suspense>
  );
}
