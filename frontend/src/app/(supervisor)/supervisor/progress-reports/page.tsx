import type { Metadata } from "next";
import { SupervisorProgressReportsLiveView } from "@/src/components/supervisor/supervisor-progress-reports-live-view";

export const metadata: Metadata = {
  title: "Báo cáo tiến độ NCS | Cổng GVHD",
  description:
    "Theo dõi danh sách minh chứng các mốc đào tạo của Nghiên cứu sinh đang hướng dẫn và mở tài liệu PDF.",
};

export default function SupervisorProgressReportsPage() {
  return <SupervisorProgressReportsLiveView />;
}
