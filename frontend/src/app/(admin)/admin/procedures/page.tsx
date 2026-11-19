import { ProceduresFormsView } from "@/src/components/shared";

export const metadata = {
  title: "Thủ tục & Biểu mẫu học vụ | Cổng Quản trị Hệ thống",
  description: "Hệ thống thủ tục học vụ và kho biểu mẫu quy chuẩn đào tạo tiến sĩ AGU.",
};

/**
 * Route: /admin/procedures
 * Tái sử dụng ProceduresFormsView từ components/shared cho Admin.
 */
export default function AdminProceduresPage() {
  return (
    <ProceduresFormsView
      roleContext="academic"
      backHref="/admin/overview"
      backLabel="Tổng quan đào tạo"
    />
  );
}
