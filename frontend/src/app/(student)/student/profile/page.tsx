import React from "react";
import type { Metadata } from "next";
import { ProfileLayout } from "@/src/components/student/profile";
import type { StudentProfileData } from "@/src/components/student/profile";

export const metadata: Metadata = {
  title: "Hồ sơ nghiên cứu sinh | Hệ thống Quản trị Đào tạo Sau Đại học",
  description:
    "Trang quản lý thông tin cá nhân, hồ sơ học vụ và cài đặt bảo mật cho Nghiên cứu sinh.",
};

/**
 * Mock data hồ sơ nghiên cứu sinh (chuẩn sát thực tế nghiệp vụ đào tạo Sau Đại học)
 */
const mockStudentProfile: StudentProfileData = {
  mshv: "NCS2024001",
  emailTruong: "a.nguyen@agu.edu.vn",
  lop: "K32-CNTT",
  chuyenNganh: "Khoa học máy tính & Trí tuệ nhân tạo",
  khoaQuanLy: "Khoa Công nghệ thông tin",
  khoaDaoTao: "NCS Khóa 32 (2024 - 2028)",
  ngayNhapHoc: "15/01/2024",
  hoTen: "Nguyễn Văn A",
  soDienThoai: "0912 345 678",
  googleScholarUrl: "https://scholar.google.com/citations?user=a_nguyen_agu",
};

export default function StudentProfilePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ProfileLayout initialData={mockStudentProfile} />
    </main>
  );
}
