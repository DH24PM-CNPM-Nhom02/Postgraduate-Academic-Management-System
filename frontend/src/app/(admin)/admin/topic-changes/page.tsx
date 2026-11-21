import React, { Suspense } from "react";
import { TopicChangesManagementView } from "@/src/components/academic";

export const metadata = {
  title: "Duyệt đề nghị điều chỉnh | Cổng Quản trị Hệ thống",
  description: "Thẩm định đề nghị đổi đề tài, đổi GVHD và gia hạn học tập.",
};

/**
 * Route: /admin/topic-changes
 * Kế thừa trực tiếp TopicChangesManagementView từ phân hệ Academic cho Admin.
 */
export default function AdminTopicChangesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-500">
          Đang tải danh sách đề nghị điều chỉnh…
        </div>
      }
    >
      <TopicChangesManagementView area="admin" />
    </Suspense>
  );
}
