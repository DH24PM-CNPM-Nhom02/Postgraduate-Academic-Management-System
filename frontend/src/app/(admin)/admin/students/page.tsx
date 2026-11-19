import { StudentsManagementView } from "@/src/components/academic";

export const metadata = {
  title: "Quản lý Nghiên cứu sinh | Cổng Quản trị Hệ thống",
  description: "Quản lý danh sách, hồ sơ và theo dõi tiến độ đào tạo của NCS AGU.",
};

/**
 * Route: /admin/students
 * Kế thừa trực tiếp StudentsManagementView từ phân hệ Academic cho Admin.
 */
export default function AdminStudentsManagementPage() {
  return <StudentsManagementView />;
}
