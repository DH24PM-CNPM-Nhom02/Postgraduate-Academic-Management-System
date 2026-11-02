import { ProceduresFormsView } from "@/src/components/shared";

export const metadata = {
  title: "Thủ tục & Biểu mẫu học vụ | Cổng Nghiên cứu sinh",
  description: "Tra cứu quy trình và tải biểu mẫu học vụ dành cho NCS.",
};

export default function StudentProceduresPage() {
  return (
    <ProceduresFormsView
      roleContext="student"
      backHref="/student/progress"
      backLabel="Tiến độ đào tạo NCS"
    />
  );
}
