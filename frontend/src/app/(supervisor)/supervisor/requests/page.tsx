import type { Metadata } from "next";
import { SupervisorRequestsLiveView } from "@/src/components/supervisor/supervisor-requests-live-view";

export const metadata: Metadata = {
  title: "Đề xuất thay NCS | Cổng GVHD",
  description:
    "Khởi tạo và theo dõi đơn đề xuất đổi tên đề tài luận án hoặc thay đổi Giảng viên hướng dẫn thay cho Nghiên cứu sinh.",
};

export default function SupervisorRequestsPage() {
  return <SupervisorRequestsLiveView />;
}
