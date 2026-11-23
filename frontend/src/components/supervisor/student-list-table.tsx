"use client";

import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  RefreshCw,
  Search,
} from "lucide-react";
import type {
  SupervisedStudent,
  StudentListTableProps,
} from "@/src/types/ui/supervisor";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { SupervisorSelect } from "./supervisor-select";
import type { ColumnDef } from "@tanstack/react-table";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";

function renderStatusBadge(student: SupervisedStudent) {
  if (student.trangThaiHocTap === "CAN_HOAN_THIEN" || student.coMocCanHoanThien) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
        <AlertCircle className="size-3.5 shrink-0 text-rose-600" aria-hidden="true" />
        <span>Mốc {student.mocHienTai}: Cần nộp lại</span>
      </span>
    );
  }
  if (student.trangThaiHocTap === "CHO_DUYET") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
        <Clock className="size-3.5 shrink-0 text-amber-600" aria-hidden="true" />
        <span>Mốc {student.mocHienTai}: Chờ duyệt</span>
      </span>
    );
  }
  if (student.trangThaiHocTap === "TOT_NGHIEP") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
        <span>Đã tốt nghiệp</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#164E9B]/25 bg-[#164E9B]/10 px-2.5 py-1 text-xs font-semibold text-[#164E9B]">
      <Layers className="size-3.5 shrink-0 text-[#164E9B]" aria-hidden="true" />
      <span>Mốc {student.mocHienTai}: Đang thực hiện</span>
    </span>
  );
}

/**
 * StudentListTable
 *
 * Hiển thị danh sách Nghiên cứu sinh đang hướng dẫn nhận qua Props.
 * Hỗ trợ đầy đủ trạng thái Loading, Error (có nút thử lại), Empty, tìm kiếm và lọc vai trò/trạng thái.
 */
export function StudentListTable({
  students,
  selectedStudentId,
  onSelectStudent,
  isLoading = false,
  error = null,
  onRetry,
  title = "Danh sách Nghiên cứu sinh đang hướng dẫn",
  subtitle = "Theo dõi lộ trình và minh chứng học tập của từng NCS.",
}: StudentListTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return students.filter((s) => {
      const matchSearch =
        query === "" ||
        s.hoTen.toLowerCase().includes(query) ||
        s.mshv.toLowerCase().includes(query) ||
        s.tenDeTai.toLowerCase().includes(query) ||
        s.chuyenNganh.toLowerCase().includes(query);

      if (!matchSearch) return false;

      if (statusFilter === "CAN_HOAN_THIEN") {
        return s.trangThaiHocTap === "CAN_HOAN_THIEN" || s.coMocCanHoanThien;
      }
      if (statusFilter === "CHO_DUYET") {
        return s.trangThaiHocTap === "CHO_DUYET";
      }
      if (statusFilter === "DANG_THUC_HIEN") {
        return s.trangThaiHocTap === "DANG_THUC_HIEN";
      }
      if (statusFilter === "HUONG_DAN_CHINH") {
        return s.vaiTro === "HUONG_DAN_CHINH";
      }
      if (statusFilter === "DONG_HUONG_DAN") {
        return s.vaiTro === "DONG_HUONG_DAN";
      }

      return true;
    });
  }, [students, searchQuery, statusFilter]);

  const columns = useMemo<ColumnDef<SupervisedStudent>[]>(() => [
    {
      id: "student",
      header: "Nghiên cứu sinh và vai trò",
      cell: ({ row: { original: student } }) => {
        const isMain = student.vaiTro === "HUONG_DAN_CHINH";
        const isSelected = selectedStudentId === student.id;
        return (
          <>
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  student.coMocCanHoanThien
                    ? "bg-rose-100 text-rose-700"
                    : isSelected
                      ? "bg-[#164E9B] text-white"
                      : "bg-[#164E9B]/10 text-[#164E9B]"
                }`}
              >
                {student.hoTen.trim().charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground transition-colors group-hover:text-[#164E9B]">
                  {student.hoTen}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                    {student.mshv}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {student.lop}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                      isMain
                        ? "bg-[#164E9B]/10 text-[#164E9B]"
                        : student.vaiTro === "DONG_HUONG_DAN"
                        ? "bg-slate-100 text-slate-700"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {isMain
                      ? `Chính (${student.trongSo})`
                      : student.vaiTro === "DONG_HUONG_DAN"
                      ? `Đồng HD (${student.trongSo})`
                      : `Chưa xác định (${student.trongSo})`}
                  </span>
                </div>
              </div>
            </div>
          </>
        );
      },
    },
    {
      id: "topic",
      header: "Đề tài luận án",
      cell: ({ row: { original: student } }) => {
        return (
          <>
            <p
              className="line-clamp-2 font-medium leading-relaxed text-foreground"
              title={student.tenDeTai}
            >
              {student.tenDeTai}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              Chuyên ngành:{" "}
              <strong className="font-semibold text-foreground">
                {student.chuyenNganh}
              </strong>
            </p>
          </>
        );
      },
    },
    {
      id: "milestone",
      header: "Mốc hiện tại",
      cell: ({ row: { original: student } }) => {
        return (
          <>
            <div className="inline-flex flex-col items-center">
              <span className="inline-flex items-center justify-center rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-bold tabular-nums text-foreground">
                {student.tongSoMoc > 0
                  ? `Mốc ${student.mocHienTai}/${student.tongSoMoc}`
                  : "Chưa có mốc"}
              </span>
              <span className="mt-1 max-w-[140px] truncate text-[11px] text-muted-foreground">
                {student.tenMocHienTai.replace(/^Mốc \d+:\s*/, "")}
              </span>
            </div>
          </>
        );
      },
    },
    {
      id: "progress",
      header: "Tiến độ 9 mốc",
      cell: ({ row: { original: student } }) => {
        const progressSafe = student.tongSoMoc > 0
          ? Math.min(Math.max(student.tienDoPhanTram, 0), 100)
          : 0;
        return (
          <>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono font-bold tabular-nums text-foreground">
                  {progressSafe}%
                </span>
                <span className="font-mono tabular-nums text-muted-foreground">
                  {student.tongSoMoc > 0
                    ? `${student.soMocHoanThanh}/${student.tongSoMoc} mốc`
                    : "0 mốc"}
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={progressSafe}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Tiến độ ${student.hoTen}: ${progressSafe}%`}
                className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className={`rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    student.coMocCanHoanThien
                      ? "bg-rose-500"
                      : progressSafe >= 70
                        ? "bg-emerald-600"
                        : "bg-[#164E9B]"
                  }`}
                  style={{ width: `${progressSafe}%` }}
                />
              </div>
            </div>
          </>
        );
      },
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row: { original: student } }) => {
        return renderStatusBadge(student);
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row: { original: student } }) => {
        const isSelected = selectedStudentId === student.id;
        return (
          <>
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectStudent(student);
              }}
              size="sm"
              variant={isSelected ? "default" : "outline"}
            >
              <span>Chi tiết 9 mốc</span>
              <ChevronRight className="size-3.5" aria-hidden="true" />
            </Button>
          </>
        );
      },
    },
  ], [onSelectStudent, selectedStudentId]);

  const table = useManagementDataTable({
    data: filteredStudents,
    columns,
    getRowId: (item) => item.id,
  });

  if (isLoading) {
    return (
      <section
        role="status"
        aria-label="Đang tải danh sách nghiên cứu sinh"
        className="animate-pulse motion-reduce:animate-none overflow-hidden rounded-xl border border-border bg-card shadow-2xs"
      >
        <div className="border-b border-border bg-muted/35 p-5">
          <div className="h-5 w-64 rounded bg-muted" />
          <div className="mt-2 h-3.5 w-96 rounded bg-muted" />
        </div>
        <div className="divide-y divide-border p-5">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-4 w-44 rounded bg-muted" />
                  <div className="h-3 w-32 rounded bg-muted" />
                </div>
              </div>
              <div className="h-9 w-28 rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        role="alert"
        className="rounded-xl border border-rose-200 bg-rose-50/70 p-6 text-rose-950"
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-600" aria-hidden="true" />
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-rose-900">
                Không thể tải danh sách nghiên cứu sinh
              </h2>
              <p className="text-xs leading-relaxed text-rose-800">{error}</p>
            </div>
          </div>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-[#164E9B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              <span>Thử lại</span>
            </button>
          )}
        </div>
      </section>
    );
  }

  const hasActiveFilter = searchQuery.trim() !== "" || statusFilter !== "ALL";

  return (
    <section
      aria-label={title}
      className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs"
    >
      {/* Header thanh công cụ */}
      <div className="flex flex-col gap-3.5 border-b border-border bg-muted/30 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="flex flex-wrap items-center gap-2 text-base font-bold tracking-tight text-foreground">
            <span>{title}</span>
            <span className="rounded-full bg-[#164E9B]/10 px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums text-[#164E9B]">
              {filteredStudents.length} / {students.length} NCS
            </span>
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>

        {/* Search & Filter */}
        <div className="grid gap-2.5 sm:grid-cols-2">
          <div className="relative min-w-[220px] sm:min-w-[260px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              aria-label="Tìm kiếm nghiên cứu sinh"
              placeholder="Tìm theo tên, MSHV, đề tài..."
              className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-[#164E9B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]/20"
            />
          </div>

          <SupervisorSelect
            label="Lọc theo trạng thái hoặc vai trò hướng dẫn"
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={[
              { value: "ALL", label: "Tất cả NCS" },
              { value: "CAN_HOAN_THIEN", label: "Cần nộp lại minh chứng" },
              { value: "CHO_DUYET", label: "Đang chờ duyệt" },
              { value: "DANG_THUC_HIEN", label: "Đang thực hiện" },
              { value: "HUONG_DAN_CHINH", label: "Hướng dẫn chính (1.0)" },
              { value: "DONG_HUONG_DAN", label: "Đồng hướng dẫn (0.5)" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-3 p-4">
        <ManagementDataTable
          table={table}
          onRowClick={onSelectStudent}
          minWidth="min-w-[860px]"
          itemLabel="nghiên cứu sinh"
          cellStyles={{ topic: "max-w-64 whitespace-normal px-3 py-3.5", progress: "min-w-32 px-3 py-3.5" }}
          emptyState={
            <div className="space-y-3 px-3">
              <p className="font-semibold text-foreground">
                {hasActiveFilter ? "Không tìm thấy NCS phù hợp" : "Chưa có Nghiên cứu sinh nào được phân công"}
              </p>
              {hasActiveFilter && (
                <Button variant="outline" size="sm" onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                }}>
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          }
        />
      </div>
    </section>
  );
}
