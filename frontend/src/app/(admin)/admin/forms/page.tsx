import { ProceduresFormsView } from "@/src/components/shared";

export const metadata = {
  title: "Biểu mẫu đào tạo Sau Đại học | Cổng Quản trị Hệ thống",
  description: "Kho biểu mẫu quy chuẩn đào tạo tiến sĩ AGU.",
};

/**
 * Route: /admin/forms
 * Tái sử dụng ProceduresFormsView từ components/shared cho Admin.
 */
export default function AdminFormsPage() {
  return (
    <ProceduresFormsView
      roleContext="academic"
      backHref="/admin/overview"
      backLabel="Tổng quan đào tạo"
    />
  );
}
