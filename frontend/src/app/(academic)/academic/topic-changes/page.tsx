import React, { Suspense } from "react";
import { TopicChangesManagementView } from "@/src/components/academic";

export const metadata = { title: "Duyệt đề nghị điều chỉnh | Cổng Quản lý Học vụ" };

/**
 * Route: /academic/topic-changes
 * Thin Route Page theo chuẩn Clean Architecture Next.js App Router.
 * Thẩm định đề nghị đổi đề tài, đổi GVHD và gia hạn học tập.
 */
export default function TopicChangesApprovalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải danh sách đề nghị điều chỉnh…
        </div>
      }
    >
      <TopicChangesManagementView />
    </Suspense>
  );
}
