import React, { Suspense } from "react";
import { AcademicDashboardView } from "@/src/components/academic";

export const metadata = {
  title: "Tổng quan Đào tạo SĐH | Cổng Quản trị Hệ thống",
  description: "Bảng điều khiển tổng quan đào tạo sau đại học và tiến độ nghiên cứu sinh AGU.",
};

/**
 * Route: /admin/overview
 * Kế thừa trực tiếp AcademicDashboardView từ phân hệ Academic cho Admin.
 */
export default function AdminAcademicOverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải bảng điều khiển Đào tạo SĐH...
        </div>
      }
    >
      <AcademicDashboardView />
    </Suspense>
  );
}
