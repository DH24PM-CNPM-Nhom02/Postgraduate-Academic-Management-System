"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Gauge, RefreshCw, Users } from "lucide-react";
import {
  useMySupervisorProfile,
  useMySupervisedStudents,
} from "@/src/hooks/use-academic";
import { computeSupervisorQuota } from "@/src/services/gvhd";
import type {
  SupervisedStudent,
  SupervisorDashboardContainerProps,
} from "@/src/types/ui/supervisor";
import { SupervisorStatsBanner } from "./supervisor-stats-banner";
import { StudentListTable } from "./student-list-table";
import { StudentProgressDrawer } from "./student-progress-drawer";

export type { SupervisorDashboardContainerProps };

export function SupervisorDashboardContainer({
  profile: propProfile,
  quota: propQuota,
  students: propStudents,
  isLoading: propIsLoading = false,
  error: propError = null,
  onRetry: propOnRetry,
}: SupervisorDashboardContainerProps) {
  const {
    data: liveProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useMySupervisorProfile();

  const {
    data: liveStudents,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    error: studentsError,
    refetch: refetchStudents,
  } = useMySupervisedStudents();

  const profile = propProfile || liveProfile || {
    id: "",
    hoTen: "Giảng viên Hướng dẫn",
    hocHamHocVi: "TS.",
    maCanBo: "N/A",
    donVi: "Trường Đại học An Giang",
    chuyenMon: "Sau Đại học",
    email: "",
    soDienThoai: "",
    hanMucToiDa: 3.0,
  };

  const students = useMemo(
    () => propStudents || liveStudents || [],
    [propStudents, liveStudents]
  );

  const quota = useMemo(
    () =>
      propQuota ||
      computeSupervisorQuota(students, profile.hanMucToiDa ?? 3.0),
    [propQuota, students, profile.hanMucToiDa]
  );

  const isDataLoading =
    (!propProfile && !liveProfile && isProfileLoading) ||
    (!propStudents && !liveStudents && isStudentsLoading);

  const isLoading = propIsLoading || isDataLoading;

  const dataError =
    !propStudents && isStudentsError
      ? studentsError instanceof Error
        ? studentsError.message
        : "Không thể kết nối máy chủ để tải danh sách NCS."
      : !propProfile && isProfileError
      ? profileError instanceof Error
        ? profileError.message
        : "Không thể kết nối máy chủ để tải thông tin hồ sơ GVHD."
      : null;

  const error = propError || dataError;

  const onRetry =
    propOnRetry ||
    (() => {
      void refetchProfile();
      void refetchStudents();
    });

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) ?? null,
    [students, selectedStudentId]
  );

  const handleSelectStudent = (student: SupervisedStudent) => {
    setSelectedStudentId(student.id);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2744]">
            Bàn làm việc Giảng viên hướng dẫn
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi tổng quan tiến độ 9 mốc đào tạo của Nghiên cứu sinh và giám sát định mức hướng dẫn theo Quy chế BR-09.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/supervisor/students"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-[#0F2744] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <Users className="size-4 text-[#164E9B]" aria-hidden="true" />
            <span>Danh sách NCS</span>
          </Link>
          <Link
            href="/supervisor/quota"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <Gauge className="size-4" aria-hidden="true" />
            <span>Chi tiết định mức</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      {error && !isLoading && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-900 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-600" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-semibold">Không thể đồng bộ dữ liệu bàn làm việc GVHD</p>
              <p className="mt-0.5 text-rose-800">{error}</p>
            </div>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-800 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 motion-reduce:transition-none"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              <span>Thử lại</span>
            </button>
          )}
        </div>
      )}

      <SupervisorStatsBanner
        profile={profile}
        quota={quota}
        students={students}
        isLoading={isLoading}
      />

      <StudentListTable
        students={students}
        selectedStudentId={selectedStudent?.id ?? null}
        onSelectStudent={handleSelectStudent}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
      />

      <StudentProgressDrawer
        student={selectedStudent}
        isOpen={isDrawerOpen && selectedStudent !== null}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}

export default SupervisorDashboardContainer;
