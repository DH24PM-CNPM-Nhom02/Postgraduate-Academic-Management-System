import React, { Suspense } from "react";
import { StudentsManagementView } from "@/src/components/academic";

/**
 * Route: /academic/students
 * Thin Route Page theo chuẩn Clean Architecture Next.js App Router.
 * Toàn bộ UI component và state filter/pagination được xử lý trong StudentsManagementView.
 */
export default function AcademicStudentsManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải danh sách Nghiên cứu sinh...
        </div>
      }
    >
      <StudentsManagementView />
    </Suspense>
  );
}
