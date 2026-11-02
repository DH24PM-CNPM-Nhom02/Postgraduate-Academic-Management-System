import { RegulationsView } from "@/src/components/shared";

export const metadata = {
  title: "Quy chế & Quy định | Cổng Giáo vụ SĐH",
  description: "Văn bản quy chế đào tạo tiến sĩ và định mức GVHD BR-09 ĐHQG-HCM.",
};

export default function AcademicRegulationsPage() {
  return (
    <RegulationsView
      roleContext="academic"
      backHref="/academic"
      backLabel="Tổng quan học vụ"
    />
  );
}
