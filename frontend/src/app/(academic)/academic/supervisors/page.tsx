import React, { Suspense } from "react";
import { SupervisorsManagementView } from "@/src/components/academic";

/**
 * Route: /academic/supervisors
 * Thin Route Page theo chuẩn Clean Architecture Next.js App Router.
 * Quản lý định mức & hạn ngạch GVHD theo quy chế BR-09.
 */
export default function SupervisorsManagementPage() {
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
