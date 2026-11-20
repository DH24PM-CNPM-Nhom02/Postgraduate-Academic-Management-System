import { TopicChangesManagementView } from "@/src/components/academic";

export const metadata = {
  title: "Duyệt đề nghị đổi đề tài luận án | Cổng Quản trị Hệ thống",
  description: "Thẩm định và phê duyệt các yêu cầu điều chỉnh tên đề tài luận án tiến sĩ.",
};

/**
 * Route: /admin/topic-changes
 * Kế thừa trực tiếp TopicChangesManagementView từ phân hệ Academic cho Admin.
 */
export default function AdminTopicChangesPage() {
  return <TopicChangesManagementView />;
}
