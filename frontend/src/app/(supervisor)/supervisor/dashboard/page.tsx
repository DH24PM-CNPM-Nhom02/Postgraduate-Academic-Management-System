import React from "react";
import type { Metadata } from "next";
import { SupervisorDashboardContainer } from "@/src/components/supervisor";

export const metadata: Metadata = {
  title: "Bàn làm việc Giảng viên Hướng dẫn | Cổng thông tin AGU",
  description:
    "Quản lý danh sách Nghiên cứu sinh, định mức hạn ngạch hướng dẫn và theo dõi luồng 9 mốc đào tạo tiến sĩ.",
};

/**
 * Thin Page cho Module Giảng viên Hướng dẫn (/supervisor/dashboard).
 * Tuân thủ kiến trúc Thin Page: Chỉ quản lý Server Metadata và ủy thác
 * toàn bộ giao diện, state và logic cho SupervisorDashboardContainer.
 */
export default function SupervisorDashboardPage() {
  return <SupervisorDashboardContainer />;
}
