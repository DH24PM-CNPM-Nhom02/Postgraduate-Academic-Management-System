import React from "react";
import type { Metadata } from "next";
import { StudentProgressContainer } from "@/src/components/student/progress";

export const metadata: Metadata = {
  title: "Theo dõi tiến trình 9 mốc | Cổng thông tin Nghiên cứu sinh AGU",
  description:
    "Theo dõi và quản lý hồ sơ tiến trình 9 mốc đào tạo tiến sĩ của Nghiên cứu sinh.",
};

/**
 * Thin Page cho Phân hệ Tiến trình 9 mốc NCS (/student/progress).
 * Tuân thủ kiến trúc Thin Page: Chỉ định nghĩa Server Metadata và ủy thác toàn bộ
 * logic, state và UI cho Container Component.
 */
export default function StudentProgressPage() {
  return <StudentProgressContainer />;
}
