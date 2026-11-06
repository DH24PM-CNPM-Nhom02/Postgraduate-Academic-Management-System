import { DecisionsManagementView } from "@/src/components/academic";

/**
 * Route: /academic/decisions
 * Thin Route Page theo chuẩn Clean Architecture Next.js App Router.
 * Quản lý các quyết định pháp lý của Giáo vụ sau đại học (Căn cứ duyệt 9 mốc, gia hạn, bảo lưu, thôi học...).
 */
export default function AcademicDecisionsPage() {
  return <DecisionsManagementView />;
}
