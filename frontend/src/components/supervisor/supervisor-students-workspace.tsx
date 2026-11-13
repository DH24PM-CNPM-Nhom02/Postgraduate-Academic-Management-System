"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ClipboardCheck,
  Gauge,
  RefreshCw,
  Scale,
  UserCheck,
  Users,
} from "lucide-react";
import type {
  SupervisedStudent,
  SupervisorStudentsWorkspaceProps,
} from "@/src/types/ui/supervisor";
import {
  useMySupervisorProfile,
  useMySupervisedStudents,
} from "@/src/hooks/use-academic";
import { computeSupervisorQuota } from "@/src/services/gvhd";
import { StudentListTable } from "./student-list-table";
import { StudentProgressDrawer } from "./student-progress-drawer";

export type { SupervisorStudentsWorkspaceProps };

export function SupervisorStudentsWorkspace({
  students: propStudents,
  quota: propQuota,
  isLoading: propIsLoading = false,
  error: propError = null,
  onRetry: propOnRetry,
}: SupervisorStudentsWorkspaceProps) {
  const {
    data: liveProfile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useMySupervisorProfile();

  const {
    data: liveStudents,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
    error: studentsError,
    refetch: refetchStudents,
  } = useMySupervisedStudents();

  const students = useMemo(
    () => propStudents || liveStudents || [],
    [propStudents, liveStudents]
  );

  const quota = useMemo(
    () =>
      propQuota ||
      computeSupervisorQuota(students, liveProfile?.hanMucToiDa ?? 3.0),
    [propQuota, students, liveProfile?.hanMucToiDa]
  );

  const isDataLoading =
    (!propStudents && !liveStudents && isStudentsLoading) ||
    (!propQuota && isProfileLoading);

  const isLoading = propIsLoading || isDataLoading;

  const dataError =
    !propStudents && isStudentsError
      ? studentsError instanceof Error
        ? studentsError.message
        : "Không thể kết nối máy chủ để tải danh sách NCS."
      : null;

  const error = propError || dataError;

  const onRetry =
    propOnRetry ||
    (() => {
      void refetchStudents();
      void refetchProfile();
    });

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) ?? null,
    [students, selectedStudentId]
  );

  const attentionCount = useMemo(
    () =>
      students.filter(
        (student) =>
          student.coMocCanHoanThien || student.trangThaiHocTap === "CAN_HOAN_THIEN"
      ).length,
    [students]
  );

  const handleSelectStudent = (student: SupervisedStudent) => {
    setSelectedStudentId(student.id);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2744]">
            Danh sách Nghiên cứu sinh đang hướng dẫn
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý toàn bộ Nghiên cứu sinh thuộc phạm vi phụ trách, vai trò phân công và tiến độ chi tiết 9 mốc đào tạo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/supervisor/progress-reports"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-[#0F2744] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <ClipboardCheck className="size-4 text-[#164E9B]" aria-hidden="true" />
            <span>Báo cáo định kỳ</span>
          </Link>
          <Link
            href="/supervisor/quota"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <Gauge className="size-4" aria-hidden="true" />
            <span>Xem định mức ({quota.tongTrongSo.toFixed(1)}/{quota.hanMucToiDa.toFixed(1)})</span>
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
              <p className="font-semibold">Lỗi tải danh sách Nghiên cứu sinh</p>
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
              <span>Tải lại</span>
            </button>
          )}
        </div>
      )}

      {isLoading ? (
        <div
          role="status"
          aria-label="Đang tải số liệu tóm tắt NCS"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse motion-reduce:animate-none"
        >
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="h-24 rounded-xl border border-border bg-card p-4">
              <div className="h-4 w-28 rounded bg-muted" />
              <div className="mt-3 h-7 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <section
          aria-label="Số liệu tóm tắt Nghiên cứu sinh"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Tổng số NCS phụ trách</span>
              <Users className="size-4 text-[#164E9B]" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F2744]">
              {students.length}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Đang theo dõi tiến độ đào tạo
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Hướng dẫn chính (×1.0)</span>
              <UserCheck className="size-4 text-[#164E9B]" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F2744]">
              {quota.soLuongHuongDanChinh}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Đóng góp {quota.trongSoChinh.toFixed(1)} điểm định mức
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Đồng hướng dẫn (×0.5)</span>
              <Scale className="size-4 text-sky-700" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F2744]">
              {quota.soLuongDongHuongDan}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Đóng góp {quota.trongSoPhu.toFixed(1)} điểm định mức
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Mốc cần bổ sung gấp</span>
              <AlertCircle
                className={`size-4 ${attentionCount > 0 ? "text-rose-600" : "text-emerald-600"}`}
                aria-hidden="true"
              />
            </div>
            <p
              className={`mt-2 text-2xl font-bold tabular-nums ${attentionCount > 0 ? "text-rose-700" : "text-emerald-700"
                }`}
            >
              {attentionCount}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {attentionCount > 0
                ? "Cần nhắc NCS nộp lại minh chứng"
                : "Không có hồ sơ bị từ chối"}
            </p>
          </div>
        </section>
      )}

      <StudentListTable
        students={students}
        selectedStudentId={selectedStudent?.id ?? null}
        onSelectStudent={handleSelectStudent}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        title="Bảng danh sách Nghiên cứu sinh đang hướng dẫn"
        subtitle="Lọc theo từ khóa, vai trò hướng dẫn hoặc trạng thái mốc đào tạo; nhấn từng dòng để mở ngăn kéo 9 mốc."
      />

      <StudentProgressDrawer
        student={selectedStudent}
        isOpen={isDrawerOpen && selectedStudent !== null}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

export default SupervisorStudentsWorkspace;
