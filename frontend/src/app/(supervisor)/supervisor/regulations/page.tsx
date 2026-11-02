import { RegulationsView } from "@/src/components/shared";

export const metadata = {
  title: "Quy chế & Quy định | Cổng Giảng viên Hướng dẫn",
  description: "Quy chế định mức hướng dẫn BR-09 và chuẩn đầu ra nghiên cứu sinh.",
};

export default function SupervisorRegulationsPage() {
  return (
    <RegulationsView
      roleContext="supervisor"
      backHref="/supervisor/dashboard"
      backLabel="Bàn làm việc GVHD"
    />
  );
}
