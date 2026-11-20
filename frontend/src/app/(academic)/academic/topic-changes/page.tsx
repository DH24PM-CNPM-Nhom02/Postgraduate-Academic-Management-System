import React, { Suspense } from "react";
import { TopicChangesManagementView } from "@/src/components/academic";

/**
 * Route: /academic/topic-changes
 * Thin Route Page theo chuẩn Clean Architecture Next.js App Router.
 * Giao diện thẩm định & phê duyệt điều chỉnh tên đề tài luận án tiến sĩ.
 */
export default function TopicChangesApprovalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải danh sách đề nghị đổi đề tài...
        </div>
      }
    >
      <TopicChangesManagementView />
    </Suspense>
  );
}
