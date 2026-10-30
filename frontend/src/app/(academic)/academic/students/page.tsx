import { StudentsManagementView } from "@/src/components/academic";

/**
 * Route: /academic/students
 * Thin Route Page theo chuẩn Clean Architecture Next.js App Router.
 * Toàn bộ UI component và state filter/pagination được xử lý trong StudentsManagementView.
 */
export default function AcademicStudentsManagementPage() {
  return <StudentsManagementView />;
}
