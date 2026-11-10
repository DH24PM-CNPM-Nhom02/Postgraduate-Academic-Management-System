import React from "react";
import type { Metadata } from "next";
import { StudentProfileContainer } from "@/src/components/student/profile";

export const metadata: Metadata = {
  title: "Hồ sơ nghiên cứu sinh | Hệ thống Quản trị Đào tạo Sau Đại học",
  description:
    "Trang quản lý thông tin cá nhân, hồ sơ học vụ và cài đặt bảo mật cho Nghiên cứu sinh.",
};

/**
 * Thin Page cho Phân hệ Hồ sơ NCS (/student/profile).
 * Tuân thủ kiến trúc Thin Page: Chỉ quản lý Server Metadata và ủy thác
 * toàn bộ giao diện và logic cho Container Component tương ứng.
 */
export default function StudentProfilePage() {
  return <StudentProfileContainer />;
}
