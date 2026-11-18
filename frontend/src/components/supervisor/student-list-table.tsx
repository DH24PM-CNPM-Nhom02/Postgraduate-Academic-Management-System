"use client";

import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Layers,
  RefreshCw,
  Search,
} from "lucide-react";
import type {
  SupervisedStudent,
  StudentListTableProps,
} from "@/src/types/ui/supervisor";

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
  subtitle = "Chọn từng dòng hoặc nhấn nút Chi tiết 9 mốc để theo dõi lộ trình và minh chứng học tập.",
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
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px] sm:min-w-[260px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Tìm kiếm nghiên cứu sinh"
              placeholder="Tìm theo tên, MSHV, đề tài..."
              className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-[#164E9B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]/20"
            />
          </div>

          <div className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs text-foreground">
            <Filter className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <select
              aria-label="Lọc theo trạng thái hoặc vai trò hướng dẫn"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-full cursor-pointer bg-transparent text-xs font-semibold text-foreground focus:outline-none"
            >
              <option value="ALL">Tất cả NCS</option>
              <option value="CAN_HOAN_THIEN">Cần nộp lại minh chứng</option>
              <option value="CHO_DUYET">Đang chờ duyệt</option>
              <option value="DANG_THUC_HIEN">Đang thực hiện</option>
              <option value="HUONG_DAN_CHINH">Hướng dẫn chính (1.0)</option>
              <option value="DONG_HUONG_DAN">Đồng hướng dẫn (0.5)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu NCS */}
      {students.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <BookOpen className="size-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-bold text-foreground">
            Chưa có Nghiên cứu sinh nào được phân công
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
            Hệ thống chưa ghi nhận Quyết định phân công hướng dẫn nào cho tài khoản
            giảng viên hiện tại.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-muted/45 text-xs font-semibold text-muted-foreground">
                <th scope="col" className="px-4 py-3.5 sm:px-5">
                  Nghiên cứu sinh &amp; Vai trò
                </th>
                <th scope="col" className="hidden px-4 py-3.5 md:table-cell">
                  Đề tài Luận án
                </th>
                <th scope="col" className="px-4 py-3.5 text-center">
                  Mốc hiện tại
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Tiến độ 9 mốc
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Trạng thái
                </th>
                <th scope="col" className="px-4 py-3.5 text-right sm:px-5">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 px-4">
                      <BookOpen className="size-8 text-muted-foreground" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">
                        Không tìm thấy Nghiên cứu sinh phù hợp
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Thử đổi từ khóa tìm kiếm hoặc xóa bộ lọc hiện tại.
                      </p>
                      {hasActiveFilter && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("ALL");
                          }}
                          className="mt-2 inline-flex h-9 cursor-pointer items-center rounded-lg border border-border bg-card px-3 text-xs font-semibold text-[#164E9B] transition-colors hover:bg-muted"
                        >
                          Xóa bộ lọc
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isSelected = selectedStudentId === student.id;
                  const isMain = student.vaiTro === "HUONG_DAN_CHINH";
                  const progressSafe =
                    student.tongSoMoc > 0
                      ? Math.min(Math.max(student.tienDoPhanTram, 0), 100)
                      : 0;

                  return (
                    <tr
                      key={student.id}
                      onClick={() => onSelectStudent(student)}
                      className={`group cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[#164E9B]/8 hover:bg-[#164E9B]/10"
                          : student.coMocCanHoanThien
                            ? "bg-rose-50/35 hover:bg-rose-50/60"
                            : "hover:bg-muted/35"
                      }`}
                    >
                      <td className="px-4 py-3.5 sm:px-5">
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
                      </td>

                      <td className="hidden max-w-[290px] px-4 py-3.5 md:table-cell">
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
                      </td>

                      <td className="px-4 py-3.5 text-center">
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
                      </td>

                      <td className="min-w-[140px] px-4 py-3.5">
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
                      </td>

                      <td className="px-4 py-3.5">{renderStatusBadge(student)}</td>

                      <td className="px-4 py-3.5 text-right sm:px-5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStudent(student);
                          }}
                          className={`inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] ${
                            isSelected
                              ? "bg-[#164E9B] text-white"
                              : "bg-muted text-[#164E9B] hover:bg-[#164E9B] hover:text-white"
                          }`}
                        >
                          <span>Chi tiết 9 mốc</span>
                          <ChevronRight className="size-3.5" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default StudentListTable;
