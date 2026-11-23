"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";

import React, { useMemo, useState } from "react";
import { SupervisorSelect } from "./supervisor-select";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  Gauge,
  RefreshCw,
  Scale,
} from "lucide-react";
import type {
  SupervisedStudent,
  SupervisorQuotaWorkspaceProps,
} from "@/src/types/ui/supervisor";
import {
  useMySupervisorProfile,
  useMySupervisedStudents,
} from "@/src/hooks/use-academic";
import { computeSupervisorQuota } from "@/src/services/gvhd";
import { QuotaBar } from "./QuotaBar";

export type { SupervisorQuotaWorkspaceProps };

function formatDateUtc(isoString?: string): string {
  if (!isoString) return "--/--/----";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function getStudentEffectiveWeight(student: SupervisedStudent): number {
  if (
    student.trangThaiHocTap === "TOT_NGHIEP" ||
    student.trangThaiHocTap === "TAM_DUNG"
  ) {
    return 0;
  }
  return student.trongSo;
}

function getStudentStatusLabel(student: SupervisedStudent): {
  label: string;
  badgeClass: string;
} {
  switch (student.trangThaiHocTap) {
    case "TOT_NGHIEP":
      return {
        label: "Đã tốt nghiệp (Không tính định mức)",
        badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case "TAM_DUNG":
      return {
        label: "Tạm dừng (Không tính định mức)",
        badgeClass: "border-slate-200 bg-slate-100 text-slate-700",
      };
    case "CAN_HOAN_THIEN":
      return {
        label: "Cần hoàn thiện mốc",
        badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
      };
    case "CHO_DUYET":
      return {
        label: "Chờ Giáo vụ duyệt",
        badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
      };
    case "DANG_THUC_HIEN":
    default:
      return {
        label: "Đang thực hiện",
        badgeClass: "border-[#164E9B]/25 bg-[#164E9B]/10 text-[#164E9B]",
      };
  }
}

const columns: ColumnDef<SupervisedStudent>[] = [
  {
    id: "number",
    header: "STT",
    cell: ({ row: { index } }) => {
      return index + 1;
    },
  },
  {
    id: "student",
    header: "Nghiên cứu sinh",
    cell: ({ row: { original: student } }) => {
      return (
        <>
          <p className="font-semibold text-[#0F2744]">{student.hoTen}</p>
          <p className="text-xs text-muted-foreground">
            {student.mshv} • {student.khoaDaoTao}
          </p>
        </>
      );
    },
  },
  {
    id: "topic",
    header: "Tên đề tài luận án",
    cell: ({ row: { original: student } }) => {
      return <span className="line-clamp-2">{student.tenDeTai}</span>;
    },
  },
  {
    id: "role",
    header: "Vai trò",
    cell: ({ row: { original: student } }) => {
      const isMain = student.vaiTro === "HUONG_DAN_CHINH";
      return (
        <>
          <span
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
              isMain
                ? "bg-[#164E9B]/10 text-[#164E9B]"
                : student.vaiTro === "DONG_HUONG_DAN"
                ? "bg-sky-50 text-sky-800"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {isMain
              ? "Hướng dẫn chính"
              : student.vaiTro === "DONG_HUONG_DAN"
              ? "Đồng hướng dẫn"
              : "Chưa xác định"}
          </span>
        </>
      );
    },
  },
  {
    id: "weight",
    header: "Trọng số",
    cell: ({ row: { original: student } }) => {
      const effectiveWeight = getStudentEffectiveWeight(student);
      return effectiveWeight.toFixed(1);
    },
  },
  {
    id: "decision",
    header: "Số QĐ phân công",
    cell: ({ row: { original: student } }) => {
      return (
        <>
          <div className="flex items-center gap-1.5 font-medium">
            <FileText className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span>{student.soQuyetDinhPhanCong}</span>
          </div>
          <p className="mt-0.5 text-muted-foreground">
            Ngày {formatDateUtc(student.ngayPhanCong)}
          </p>
        </>
      );
    },
  },
  {
    id: "status",
    header: "Trạng thái",
    cell: ({ row: { original: student } }) => {
      const statusMeta = getStudentStatusLabel(student);
      return (
        <>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusMeta.badgeClass}`}
          >
            {statusMeta.label}
          </span>
        </>
      );
    },
  },
];

export function SupervisorQuotaWorkspace({
  profile: propProfile,
  quota: propQuota,
  students: propStudents,
  isLoading: propIsLoading = false,
  error: propError = null,
  onRetry: propOnRetry,
}: SupervisorQuotaWorkspaceProps) {
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

  const profile = propProfile ?? liveProfile;

  const students = useMemo(
    () => propStudents || liveStudents || [],
    [propStudents, liveStudents]
  );

  const maxQuota = profile?.hanMucToiDa;
  const quota = propQuota ?? (
    (propStudents || liveStudents) && maxQuota !== undefined
      ? computeSupervisorQuota(students, maxQuota)
      : undefined
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

  const [roleFilter, setRoleFilter] = useState("ALL");
  const filteredStudents = useMemo(
    () => roleFilter === "ALL" ? students : students.filter((student) => student.vaiTro === roleFilter),
    [students, roleFilter],
  );

  const table = useManagementDataTable({
    data: filteredStudents,
    columns,
    getRowId: (item) => item.id,
  });

  const totalRosterWeight = useMemo(
    () =>
      students.reduce(
        (sum, student) => sum + getStudentEffectiveWeight(student),
        0
      ),
    [students]
  );

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2744]">
            Định mức hướng dẫn Nghiên cứu sinh
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile && [profile.hoTen, profile.hocHamHocVi, profile.maCanBo, profile.donVi].join(" · ")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/supervisor/students"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-[#0F2744] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <ArrowLeft className="size-4 text-[#164E9B]" aria-hidden="true" />
            <span>Quay lại danh sách NCS</span>
          </Link>
          <Link
            href="/supervisor/regulations"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <BookOpen className="size-4" aria-hidden="true" />
            <span>Quy chế GVHD</span>
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
              <p className="font-semibold">Không thể tải dữ liệu định mức hướng dẫn</p>
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

      {isLoading ? (
        <p role="status" className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">Đang tải định mức hướng dẫn...</p>
      ) : !error && !quota ? (
        <p className="rounded-xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">Chưa có dữ liệu định mức hướng dẫn.</p>
      ) : null}

      {quota && !isLoading && !error && (
      <section
        aria-label="Chi tiết thanh định mức quy đổi"
        className="rounded-xl border border-border bg-card p-5 sm:p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <Gauge className="size-5 text-[#164E9B]" aria-hidden="true" />
          <h2 className="text-base font-bold text-[#0F2744]">
            Tổng hợp tải hướng dẫn hiện tại
          </h2>
        </div>

        <QuotaBar quota={quota} showDetails isLoading={isLoading} />

        {!isLoading && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-[#F0F5FA] p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Hướng dẫn chính (×1.0)
              </p>
              <p className="mt-1.5 text-xl font-bold tabular-nums text-[#0F2744]">
                {quota.soLuongHuongDanChinh} NCS
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Quy đổi {quota.trongSoChinh.toFixed(1)} điểm
              </p>
            </div>

            <div className="rounded-lg bg-[#F0F5FA] p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Đồng hướng dẫn (×0.5)
              </p>
              <p className="mt-1.5 text-xl font-bold tabular-nums text-[#0F2744]">
                {quota.soLuongDongHuongDan} NCS
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Quy đổi {quota.trongSoPhu.toFixed(1)} điểm
              </p>
            </div>

            <div className="rounded-lg bg-[#F0F5FA] p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Tổng trọng số đang tính
              </p>
              <p className="mt-1.5 text-xl font-bold tabular-nums text-[#164E9B]">
                {quota.tongTrongSo.toFixed(1)} / {quota.hanMucToiDa.toFixed(1)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Chiếm {quota.tyLeSuDungPhanTram}% hạn mức tối đa
              </p>
            </div>

            <div className="rounded-lg bg-[#F0F5FA] p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Phần định mức còn trống
              </p>
              <p
                className={`mt-1.5 text-xl font-bold tabular-nums ${
                  quota.trongSoConLai > 0 ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {quota.trongSoConLai.toFixed(1)} điểm
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {quota.trongSoConLai >= 1
                  ? `Tối đa +${Math.floor(quota.trongSoConLai)} Chính hoặc +${Math.floor(
                      quota.trongSoConLai / 0.5
                    )} Đồng HD`
                  : quota.trongSoConLai >= 0.5
                  ? "Chỉ đủ nhận thêm 1 Đồng HD (0.5)"
                  : "Đã hết hạn mức tiếp nhận mới"}
              </p>
            </div>
          </div>
        )}
      </section>
      )}

      {(!error || propStudents || liveStudents) && (
      <section
        aria-label="Bảng phân bổ trọng số theo từng Nghiên cứu sinh"
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F2744]">
              Bảng kê trọng số từng Nghiên cứu sinh
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tổng trọng số tính từ các phân công hướng dẫn hiện hành.
            </p>
          </div>
          <div className="w-full sm:w-52">
            <SupervisorSelect
              label="Lọc vai trò hướng dẫn"
              value={roleFilter}
              onValueChange={setRoleFilter}
              options={[
                { value: "ALL", label: "Tất cả vai trò" },
                { value: "HUONG_DAN_CHINH", label: "Hướng dẫn chính" },
                { value: "DONG_HUONG_DAN", label: "Đồng hướng dẫn" },
              ]}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5 animate-pulse motion-reduce:animate-none">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="h-12 rounded-lg bg-muted" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            Giảng viên chưa có Nghiên cứu sinh nào được phân công trong hệ thống.
          </div>
        ) : (
          <div className="space-y-3 p-4">
            <ManagementDataTable
              table={table}
              minWidth="min-w-[780px]"
              itemLabel="nghiên cứu sinh"
              cellStyles={{ topic: "max-w-64 whitespace-normal px-3 py-3.5", weight: "px-3 py-3.5 text-right font-bold tabular-nums" }}
              headerStyles={{ weight: "px-3 py-3 text-right" }}
              emptyState="Không có Nghiên cứu sinh theo vai trò đã chọn."
            />
            <div className="flex flex-wrap justify-between gap-2 rounded-lg bg-muted/40 px-4 py-3 text-sm">
              <p>Tổng trọng số <strong>{totalRosterWeight.toFixed(1)}</strong></p>
              {quota && <p>Trần quy chế <strong>{quota.hanMucToiDa.toFixed(1)}</strong></p>}
            </div>
          </div>
        )}
      </section>
      )}

      <section
        aria-label="Quy tắc áp dụng định mức"
        className="rounded-xl border border-border bg-card p-5 sm:p-6"
      >
        <div className="flex items-center gap-2">
          <Scale className="size-5 text-[#164E9B]" aria-hidden="true" />
          <h2 className="text-base font-bold text-[#0F2744]">
            Quy tắc quy đổi & ngưỡng kiểm soát
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-[#F0F5FA] p-4">
            <h3 className="text-sm font-semibold text-[#0F2744]">
              Hệ số quy đổi theo vai trò hướng dẫn
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-[#164E9B]" aria-hidden="true" />
                <span>
                  <strong>Hướng dẫn chính / Độc lập:</strong> tính trọng số{" "}
                  <strong>1.0</strong> điểm định mức / 1 NCS.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-[#164E9B]" aria-hidden="true" />
                <span>
                  <strong>Đồng hướng dẫn (GVHD phụ):</strong> tính trọng số{" "}
                  <strong>0.5</strong> điểm định mức / 1 NCS.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>
                  NCS đã bảo vệ thành công (Tốt nghiệp) hoặc Tạm dừng được giải phóng khỏi hạn mức hiện hành.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-[#F0F5FA] p-4">
            <h3 className="text-sm font-semibold text-[#0F2744]">
              Ngưỡng cảnh báo & điều kiện phân công mới
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-foreground">
              <li className="flex items-center gap-2">
                <span className="inline-block size-2.5 shrink-0 rounded-full bg-[#164E9B]" aria-hidden="true" />
                <span>
                  <strong>Dưới 75%:</strong> An toàn, đủ điều kiện tiếp nhận thêm NCS.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block size-2.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                <span>
                  <strong>Từ 75% đến dưới 100%:</strong> Cảnh báo gần chạm trần khi phân công mới.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block size-2.5 shrink-0 rounded-full bg-rose-600" aria-hidden="true" />
                <span>
                  <strong>Từ 100% trở lên:</strong> Khóa tiếp nhận phân công mới trên hệ thống học vụ.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SupervisorQuotaWorkspace;
