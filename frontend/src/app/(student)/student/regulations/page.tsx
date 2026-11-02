import { RegulationsView } from "@/src/components/shared";

export const metadata = {
  title: "Quy chế & Quy định | Cổng Nghiên cứu sinh",
  description: "Quy chế đào tạo tiến sĩ và chuẩn đầu ra công bố khoa học quốc tế.",
};

export default function StudentRegulationsPage() {
  return (
    <RegulationsView
      roleContext="student"
      backHref="/student/progress"
      backLabel="Tiến độ đào tạo NCS"
    />
  );
}
