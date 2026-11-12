import type { Metadata } from "next";
import { SupervisorExtensionsWorkspace } from "@/src/components/supervisor";
import {
  mockSupervisorExtensionRequests,
  mockSupervisorProfile,
} from "@/src/mocks/supervisor";

export const metadata: Metadata = {
  title: "Thẩm định đơn gia hạn | Cổng GVHD",
  description:
    "Kiểm tra báo cáo tiến độ và xác nhận đồng ý hoặc từ chối đơn gia hạn thời gian đào tạo của Nghiên cứu sinh.",
};

export default function SupervisorExtensionsPage() {
  return (
    <SupervisorExtensionsWorkspace
      requests={mockSupervisorExtensionRequests}
      currentSupervisorId={mockSupervisorProfile.id}
    />
  );
}
