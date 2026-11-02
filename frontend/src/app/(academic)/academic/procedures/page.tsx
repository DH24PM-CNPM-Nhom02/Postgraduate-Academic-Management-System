import { ProceduresFormsView } from "@/src/components/shared";

export const metadata = {
  title: "Thủ tục & Biểu mẫu học vụ | Cổng Giáo vụ SĐH",
  description: "Hệ thống thủ tục học vụ và kho biểu mẫu quy chuẩn đào tạo tiến sĩ AGU.",
};

export default function AcademicProceduresPage() {
  return (
    <ProceduresFormsView
      roleContext="academic"
      backHref="/academic"
      backLabel="Tổng quan học vụ"
    />
  );
}
