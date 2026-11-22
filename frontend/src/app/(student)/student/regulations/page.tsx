import { RegulationsView } from "@/src/components/shared/RegulationsView";

export const metadata = {
  title: "Quy định & Quy chế | Cổng Nghiên cứu sinh",
  description: "Tra cứu quy định và quy chế đào tạo sau đại học.",
};

export default function StudentRegulationsPage() {
  return <RegulationsView backHref="/student/progress" backLabel="Tiến độ đào tạo NCS" />;
}
