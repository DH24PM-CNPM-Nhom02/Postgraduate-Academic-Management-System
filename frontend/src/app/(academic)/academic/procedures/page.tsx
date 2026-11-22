import { ProceduresFormsView } from "@/src/components/shared/ProceduresFormsView";

export const metadata = {
  title: "Biểu mẫu học vụ | Cổng Giáo vụ SĐH",
  description: "Tra cứu và tải biểu mẫu đào tạo sau đại học.",
};

export default function AcademicProceduresPage() {
  return <ProceduresFormsView backHref="/academic" backLabel="Tổng quan học vụ" />;
}
