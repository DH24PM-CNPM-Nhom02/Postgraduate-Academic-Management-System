import type { Metadata } from "next";
import { SupervisorExtensionsLiveView } from "@/src/components/supervisor";

export const metadata: Metadata = {
  title: "Thẩm định đơn của NCS | Cổng GVHD",
  description:
    "Xem hồ sơ và xác nhận đồng ý hoặc từ chối đơn gia hạn thời gian đào tạo và đơn đổi đề tài luận án của Nghiên cứu sinh.",
};

export default function SupervisorExtensionsPage() {
  return <SupervisorExtensionsLiveView />;
}
