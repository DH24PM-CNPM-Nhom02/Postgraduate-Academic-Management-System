import { RegulationsView } from "@/src/components/shared/RegulationsView";

export const metadata = {
  title: "Quy định & Quy chế | Cổng Giáo vụ SĐH",
  description: "Tra cứu quy định và quy chế đào tạo sau đại học.",
};

export default function AcademicRegulationsPage() {
  return <RegulationsView backHref="/academic" backLabel="Tổng quan học vụ" />;
}
