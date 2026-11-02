import { ProceduresFormsView } from "@/src/components/shared";

export const metadata = {
  title: "Biểu mẫu & Đơn từ | Cổng Giáo vụ SĐH",
  description: "Kho biểu mẫu quy chuẩn đào tạo tiến sĩ AGU.",
};

export default function AcademicFormsPage() {
  return (
    <ProceduresFormsView
      roleContext="academic"
      backHref="/academic"
      backLabel="Tổng quan học vụ"
    />
  );
}
