import { TopicChangesManagementView } from "@/src/components/academic";

/**
 * Route: /academic/topic-changes
 * Thin Route Page theo chuẩn Clean Architecture Next.js App Router.
 * Giao diện thẩm định & phê duyệt điều chỉnh tên đề tài luận án tiến sĩ.
 */
export default function TopicChangesApprovalPage() {
  return <TopicChangesManagementView />;
}
