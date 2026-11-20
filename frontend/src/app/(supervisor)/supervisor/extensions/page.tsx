import type { Metadata } from "next";
import { SupervisorExtensionsLiveView } from "@/src/components/supervisor";

export const metadata: Metadata = {
  title: "Thẩm định đơn gia hạn | Cổng GVHD",
  description:
    "Kiểm tra báo cáo tiến độ và xác nhận đồng ý hoặc từ chối đơn gia hạn thời gian đào tạo của Nghiên cứu sinh.",
};

export default function SupervisorExtensionsPage() {
  return <SupervisorExtensionsLiveView />;
}
