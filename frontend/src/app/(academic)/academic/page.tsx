import React, { Suspense } from "react";
import { AcademicDashboardView } from "@/src/components/academic";

/**
 * Route: /academic
 * Thin Route Page theo chuẩn Clean Architecture Next.js App Router.
 * Toàn bộ logic giao diện và các Tab động được chuyển giao cho AcademicDashboardView.
 */
export default function AcademicDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải bảng điều khiển Giáo vụ SĐH...
        </div>
      }
    >
      <AcademicDashboardView />
    </Suspense>
  );
}
