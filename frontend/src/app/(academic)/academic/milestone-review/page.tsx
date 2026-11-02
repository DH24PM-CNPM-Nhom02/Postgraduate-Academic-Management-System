import { MilestoneReviewView } from "@/src/components/academic";

/**
 * Route: /academic/milestone-review
 * Thin Route Page theo chuẩn Clean Architecture Next.js App Router.
 * Hàng chờ duyệt 9 mốc tiến độ nghiên cứu sinh và thẩm định phiếu nhận xét chuyên gia.
 */
export default function AcademicMilestoneReviewPage() {
  return <MilestoneReviewView />;
}
