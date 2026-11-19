import { EvidenceManagementView } from "@/src/components/academic";

export const metadata = {
  title: "Minh chứng học vị & Báo cáo chuyên đề | Cổng Quản trị Hệ thống",
  description: "Quản lý và duyệt minh chứng học vụ 2 cấp dành cho nghiên cứu sinh.",
};

/**
 * Route: /admin/evidence
 * Kế thừa trực tiếp EvidenceManagementView từ phân hệ Academic cho Admin.
 */
export default function AdminEvidencePage() {
  return <EvidenceManagementView />;
}
