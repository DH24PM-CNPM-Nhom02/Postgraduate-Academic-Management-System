import { DecisionsManagementView } from "@/src/components/academic";

export const metadata = {
  title: "Quản lý Quyết định Đào tạo SĐH | Cổng Quản trị Hệ thống",
  description: "Quản lý các quyết định học vụ, công nhận người hướng dẫn, gia hạn, bảo lưu đào tạo.",
};

/**
 * Route: /admin/decisions
 * Kế thừa trực tiếp DecisionsManagementView từ phân hệ Academic cho Admin.
 */
export default function AdminDecisionsManagementPage() {
  return <DecisionsManagementView />;
}
