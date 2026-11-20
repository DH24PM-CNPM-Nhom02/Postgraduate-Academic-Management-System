import React from "react";
import type { Metadata } from "next";
import { UserProfileContainer } from "@/src/components/profile/user-profile-container";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân | Hệ thống Quản trị Đào tạo Sau Đại học",
  description: "Thông tin tài khoản và cài đặt bảo mật.",
};

/**
 * Thin Page cho Phân hệ Hồ sơ NCS (/student/profile).
 * Tuân thủ kiến trúc Thin Page: Chỉ quản lý Server Metadata và ủy thác
 * toàn bộ giao diện và logic cho Container Component tương ứng.
 */
export default function StudentProfilePage() {
  return <UserProfileContainer />;
}
