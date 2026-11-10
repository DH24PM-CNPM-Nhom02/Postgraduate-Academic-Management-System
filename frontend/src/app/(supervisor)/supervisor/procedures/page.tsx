import { ProceduresFormsView } from "@/src/components/shared";

export const metadata = {
  title: "Thủ tục & Biểu mẫu học vụ | Cổng Giảng viên Hướng dẫn",
  description: "Tra cứu quy trình và tải biểu mẫu học vụ dành cho GVHD.",
};

export default function SupervisorProceduresPage() {
  return (
    <ProceduresFormsView
      roleContext="supervisor"
      backHref="/supervisor/dashboard"
      backLabel="Bàn làm việc GVHD"
    />
  );
}
