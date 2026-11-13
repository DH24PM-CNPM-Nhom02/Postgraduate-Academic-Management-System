import type { Metadata } from "next";
import { SupervisorDashboardContainer } from "@/src/components/supervisor";

export const metadata: Metadata = {
  title: "Bàn làm việc GVHD | Hệ thống Quản lý Sau đại học",
  description:
    "Tổng quan tiến độ Nghiên cứu sinh đang hướng dẫn và định mức hướng dẫn BR-09 dành cho Giảng viên hướng dẫn.",
};

export default function SupervisorDashboardPage() {
  return <SupervisorDashboardContainer />;
}
