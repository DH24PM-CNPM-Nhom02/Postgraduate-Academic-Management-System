import { RegulationsView } from "@/src/components/shared/RegulationsView";

export const metadata = {
  title: "Quy định & Quy chế | Cổng Quản trị Hệ thống",
  description: "Tra cứu quy định và quy chế đào tạo sau đại học.",
};

export default function AdminRegulationsPage() {
  return <RegulationsView backHref="/admin/overview" backLabel="Tổng quan đào tạo" />;
}
