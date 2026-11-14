import React from "react";
import type { Metadata } from "next";
import { StudentThesisLiveView } from "@/src/components/thesis";

export const metadata: Metadata = {
  title: "Đề tài luận án của tôi | Cổng thông tin Nghiên cứu sinh AGU",
  description:
    "Theo dõi đề tài luận án tiến sĩ hiện tại, quyết định giao đề tài và lịch sử điều chỉnh đề tài của Nghiên cứu sinh.",
};

/**
 * Thin Page cho màn hình Đề tài luận án của tôi (/student/thesis).
 * Tuân thủ kiến trúc Server Component: Quản lý Metadata và ủy thác
 * toàn bộ việc gọi API + hiển thị cho StudentThesisLiveView.
 */
export default function StudentThesisPage() {
  return <StudentThesisLiveView />;
}
