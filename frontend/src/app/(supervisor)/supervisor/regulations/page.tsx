import { RegulationsView } from "@/src/components/shared/RegulationsView";

export const metadata = {
  title: "Quy định & Quy chế | Cổng Giảng viên Hướng dẫn",
  description: "Tra cứu quy định và quy chế đào tạo sau đại học.",
};

export default function SupervisorRegulationsPage() {
  return <RegulationsView backHref="/supervisor/dashboard" backLabel="Bàn làm việc GVHD" />;
}
