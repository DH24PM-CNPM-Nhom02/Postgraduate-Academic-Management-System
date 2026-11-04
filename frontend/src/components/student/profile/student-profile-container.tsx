"use client";

import React from "react";
import { ProfileLayout } from "./profile-layout";
import { StudentProfileData } from "./general-info-form";
import { mockStudentProfile } from "./mock-data";

export interface StudentProfileContainerProps {
  initialData?: Partial<StudentProfileData>;
}

/**
 * Container Component cho Màn hình Hồ sơ Nghiên cứu sinh (/student/profile).
 * Đóng gói toàn bộ logic quản lý dữ liệu học vụ, cấu trúc layout và ủy thác
 * hiển thị biểu mẫu cho ProfileLayout.
 */
export function StudentProfileContainer({
  initialData = mockStudentProfile,
}: StudentProfileContainerProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ProfileLayout initialData={initialData} />
    </main>
  );
}

export default StudentProfileContainer;
