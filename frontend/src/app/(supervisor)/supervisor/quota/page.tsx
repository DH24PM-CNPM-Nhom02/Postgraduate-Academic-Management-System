import type { Metadata } from "next";
import { SupervisorQuotaWorkspace } from "@/src/components/supervisor";
import { mockSupervisorQuotaScenarios } from "@/src/mocks/supervisor";

export const metadata: Metadata = {
  title: "Định mức hướng dẫn BR-09 | Cổng GVHD",
  description:
    "Theo dõi chi tiết tải hướng dẫn quy đổi (Chính = 1.0, Đồng hướng dẫn = 0.5) theo Quy chế Sau đại học BR-09.",
};

export default function SupervisorQuotaPage() {
  return (
    <SupervisorQuotaWorkspace
      scenarios={mockSupervisorQuotaScenarios}
    />
  );
}
