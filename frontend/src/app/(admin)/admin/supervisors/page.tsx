import React, { Suspense } from "react";
import { SupervisorsManagementView } from "@/src/components/academic";

export const metadata = {
  title: "Quản lý Giảng viên Hướng dẫn | Cổng Quản trị Hệ thống",
  description: "Theo dõi định mức và kiểm soát hạn ngạch GVHD theo quy chế BR-09.",
};

/**
 * Route: /admin/supervisors
 * Kế thừa trực tiếp SupervisorsManagementView từ phân hệ Academic cho Admin.
 */
export default function AdminSupervisorsManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải danh sách Giảng viên hướng dẫn...
        </div>
      }
    >
      <SupervisorsManagementView />
    </Suspense>
  );
}
