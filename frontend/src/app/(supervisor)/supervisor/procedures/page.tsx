import { ProceduresFormsView } from "@/src/components/shared/ProceduresFormsView";

export const metadata = {
  title: "Biểu mẫu học vụ | Cổng Giảng viên Hướng dẫn",
  description: "Tra cứu và tải biểu mẫu đào tạo sau đại học.",
};

export default function SupervisorProceduresPage() {
  return <ProceduresFormsView backHref="/supervisor/dashboard" backLabel="Bàn làm việc GVHD" />;
}
