"use client";

import React, { useState } from "react";
import {
  SupervisorProfile,
  SupervisorStudentItem,
  mockSupervisorProfile,
  mockSupervisorStudents,
} from "@/src/lib/mockData";
import { SupervisorStatsBanner } from "./supervisor-stats-banner";
import { StudentListTable } from "./student-list-table";
import { StudentProgressDrawer } from "./student-progress-drawer";

export interface SupervisorDashboardContainerProps {
  initialProfile?: SupervisorProfile;
  initialStudents?: SupervisorStudentItem[];
}

/**
 * Container Component cho Bàn làm việc Giảng viên Hướng dẫn (Supervisor Dashboard).
 * Quản lý trạng thái học viên được chọn, mở Slide-over Drawer và kết nối dữ liệu Master-Detail.
 */
export function SupervisorDashboardContainer({
  initialProfile = mockSupervisorProfile,
  initialStudents = mockSupervisorStudents,
}: SupervisorDashboardContainerProps) {
  const [profile] = useState<SupervisorProfile>(initialProfile);
  const [students] = useState<SupervisorStudentItem[]>(initialStudents);
  const [selectedStudent, setSelectedStudent] =
    useState<SupervisorStudentItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSelectStudent = (student: SupervisorStudentItem) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-7xl mx-auto">
      {/* 1. Bảng Thông tin GVHD & Quota Hướng dẫn (Top Banner / Stats Card) */}
      <SupervisorStatsBanner profile={profile} students={students} />

      {/* 2. Danh sách Nghiên cứu sinh & Chi tiết Tiến độ (View 1 - Main Content Table) */}
      <section aria-label="Bảng quản lý Nghiên cứu sinh">
        <StudentListTable
          students={students}
          selectedStudentId={selectedStudent?.id}
          onSelectStudent={handleSelectStudent}
        />
      </section>

      {/* 3. Chi tiết luồng 9 mốc đào tạo Read-only (View 2 - Slide-over Drawer) */}
      <StudentProgressDrawer
        student={selectedStudent}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}

export default SupervisorDashboardContainer;
