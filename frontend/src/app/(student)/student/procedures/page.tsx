import { ProceduresFormsView } from "@/src/components/shared/ProceduresFormsView";

export const metadata = {
  title: "Biểu mẫu học vụ | Cổng Nghiên cứu sinh",
  description: "Tra cứu và tải biểu mẫu đào tạo sau đại học.",
};

export default function StudentProceduresPage() {
  return <ProceduresFormsView backHref="/student/progress" backLabel="Tiến độ đào tạo NCS" />;
}
