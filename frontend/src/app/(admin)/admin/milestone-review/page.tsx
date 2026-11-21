import { MilestoneReviewView } from "@/src/components/academic";

export const metadata = {
  title: "Hàng chờ duyệt 9 mốc tiến độ | Cổng Quản trị Hệ thống",
  description: "Thẩm định minh chứng 9 mốc tiến độ nghiên cứu sinh và phiếu điểm hội đồng.",
};

/**
 * Route: /admin/milestone-review
 * Kế thừa trực tiếp MilestoneReviewView từ phân hệ Academic cho Admin.
 */
export default function AdminMilestoneReviewPage() {
  return <MilestoneReviewView admin />;
}
