import React, { Suspense } from "react";
import { ProceduresFormsView } from "@/src/components/shared";

export const metadata = {
  title: "Thủ tục & Biểu mẫu học vụ | Cổng Quản trị Hệ thống",
  description: "Hệ thống thủ tục học vụ và kho biểu mẫu quy chuẩn đào tạo tiến sĩ AGU.",
};

/**
 * Route: /admin/procedures
 * Tái sử dụng ProceduresFormsView từ components/shared cho Admin.
 */
export default function AdminProceduresPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải danh mục thủ tục &amp; biểu mẫu...
        </div>
      }
    >
      <ProceduresFormsView
        roleContext="academic"
        backHref="/admin/overview"
        backLabel="Tổng quan đào tạo"
      />
    </Suspense>
  );
}
