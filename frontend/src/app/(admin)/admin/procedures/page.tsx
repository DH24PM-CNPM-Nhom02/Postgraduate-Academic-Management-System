import { ProceduresFormsView } from "@/src/components/shared/ProceduresFormsView";

export const metadata = {
  title: "Biểu mẫu học vụ | Cổng Quản trị Hệ thống",
  description: "Tra cứu và tải biểu mẫu đào tạo sau đại học.",
};

export default function AdminProceduresPage() {
  return <ProceduresFormsView backHref="/admin/overview" backLabel="Tổng quan đào tạo" />;
}
