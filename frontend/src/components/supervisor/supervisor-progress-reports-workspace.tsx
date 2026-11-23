"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  Filter,
  MessageSquareText,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { DocumentViewButton } from "@/src/components/student/progress/document-view-button";
import { useDocumentMetadata } from "@/src/hooks/api/use-documents";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { SupervisorSelect } from "./supervisor-select";
import type { ColumnDef } from "@tanstack/react-table";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";
import type { EvidenceStatus } from "@/src/types/ui/progress";
import type {
  SupervisorProgressReportItem,
  SupervisorProgressReportsWorkspaceProps,
} from "@/src/types/ui/supervisor";
import {
  formatFileSizeBytes,
  formatSupervisorDateUtc,
  getMilestoneEvidenceStatusMeta,
  getRoleShortLabel,
} from "./supervisor-ui-helpers";

export type { SupervisorProgressReportsWorkspaceProps };

function ReportAttachment({ report, view = false }: { report: SupervisorProgressReportItem; view?: boolean }) {
  const metadata = useDocumentMetadata(report.fileId);
  const name = metadata.data?.originalName ?? report.fileName;
  if (view) {
    return report.fileId ? <DocumentViewButton fileId={report.fileId} fileName={name} variant="default" /> :
      <span className="text-xs text-muted-foreground">Chưa có tệp</span>;
  }

  const size = formatFileSizeBytes(metadata.data?.size);
  return (
    <>
      <p className="truncate text-xs font-semibold text-foreground">{report.fileId ? name : "Chưa có tệp đính kèm"}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Lần nộp #{report.lanNop}{size ? ` · ${size}` : ""}
      </p>
    </>
  );
}

function hasReportNotes(report: SupervisorProgressReportItem) {
  return Boolean(report.ghiChuNcs || report.nhanXetGvhd || report.lyDoTuChoi);
}

function ReportNotes({ report }: { report: SupervisorProgressReportItem }) {
  return (
    <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
                                  {report.ghiChuNcs && (
                                    <div className="rounded-lg bg-card p-3">
                                      <p className="font-semibold text-[#0F2744]">
                                        Ghi chú của Nghiên cứu sinh:
                                      </p>
                                      <p className="mt-1 leading-relaxed text-foreground">
                                        {report.ghiChuNcs}
                                      </p>
                                    </div>
                                  )}
                                  {report.nhanXetGvhd && (
                                    <div className="rounded-lg bg-card p-3">
                                      <p className="font-semibold text-[#164E9B]">
                                        Nhận xét / Theo dõi của GVHD:
                                      </p>
                                      <p className="mt-1 leading-relaxed text-foreground">
                                        {report.nhanXetGvhd}
                                      </p>
                                    </div>
                                  )}
                                  {report.lyDoTuChoi && (
                                    <div className="rounded-lg bg-rose-50 p-3 text-rose-900 md:col-span-2">
                                      <p className="font-semibold">
                                        Lý do Giáo vụ trả lại hồ sơ:
                                      </p>
                                      <p className="mt-1 leading-relaxed">{report.lyDoTuChoi}</p>
                                    </div>
                                  )}
                                </div>
  );
}

const MILESTONE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function SupervisorProgressReportsWorkspace({
  reports,
  students = [],
  isLoading = false,
  error = null,
  onRetry,
}: SupervisorProgressReportsWorkspaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("ALL");
  const [selectedMilestone, setSelectedMilestone] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<EvidenceStatus | "ALL">("ALL");
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  const studentFilterOptions = useMemo(() => {
    const namesMap = new Map<string, { mshv: string; hoTen: string }>();
    for (const st of students) {
      namesMap.set(st.id, { mshv: st.mshv, hoTen: st.hoTen });
    }
    for (const rp of reports) {
      if (!namesMap.has(rp.studentId)) {
        namesMap.set(rp.studentId, { mshv: rp.mshv, hoTen: rp.hoTenNcs });
      }
    }
    return Array.from(namesMap.entries()).map(([id, value]) => ({
      id,
      ...value,
    }));
  }, [reports, students]);

  const counts = useMemo(() => {
    const pending = reports.filter((r) => r.trangThai === "PENDING_REVIEW").length;
    const passed = reports.filter((r) => r.trangThai === "PASSED").length;
    const rejected = reports.filter((r) => r.trangThai === "REJECTED").length;
    return {
      total: reports.length,
      pending,
      passed,
      rejected,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return reports.filter((report) => {
      if (selectedStudentId !== "ALL" && report.studentId !== selectedStudentId) {
        return false;
      }
      if (
        selectedMilestone !== "ALL" &&
        report.mocSo !== Number(selectedMilestone)
      ) {
        return false;
      }
      if (selectedStatus !== "ALL" && report.trangThai !== selectedStatus) {
        return false;
      }
      if (!keyword) return true;
      return (
        report.hoTenNcs.toLowerCase().includes(keyword) ||
        report.mshv.toLowerCase().includes(keyword) ||
        report.tenMoc.toLowerCase().includes(keyword)
      );
    });
  }, [reports, searchQuery, selectedStudentId, selectedMilestone, selectedStatus]);

  const hasActiveFilter =
    searchQuery.trim() !== "" ||
    selectedStudentId !== "ALL" ||
    selectedMilestone !== "ALL" ||
    selectedStatus !== "ALL";

  const columns = useMemo<ColumnDef<SupervisorProgressReportItem>[]>(() => [
    {
      id: "student",
      header: "Nghiên cứu sinh",
      cell: ({ row: { original: report } }) => {
        return (
          <>
            <p className="font-semibold text-[#0F2744]">
              {report.hoTenNcs}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {report.mshv} • {getRoleShortLabel(report.vaiTro)}
            </p>
          </>
        );
      },
    },
    {
      id: "milestone",
      header: "Mốc đào tạo",
      cell: ({ row: { original: report } }) => {
        return (
          <>
            <span className="inline-flex items-center rounded-md bg-[#164E9B]/10 px-2 py-0.5 text-xs font-semibold text-[#164E9B]">
              Mốc {report.mocSo}
            </span>
            <p className="mt-1 text-xs font-medium text-foreground">
              {report.tenMoc.replace(/^Mốc \d+:\s*/, "")}
            </p>
            {report.diemTrungBinh !== undefined && (
              <p className="mt-0.5 text-xs font-semibold text-emerald-700">
                Điểm đánh giá: {report.diemTrungBinh}/10
              </p>
            )}
          </>
        );
      },
    },
    {
      id: "attachment",
      header: "Minh chứng PDF",
      cell: ({ row: { original: report } }) => {
        return (
          <>
            <div className="flex items-start gap-2">
              <FileText
                className="mt-0.5 size-4 shrink-0 text-[#164E9B]"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <ReportAttachment report={report} />
              </div>
            </div>
          </>
        );
      },
    },
    {
      id: "submitted",
      header: "Ngày nộp",
      cell: ({ row: { original: report } }) => {
        return (
          <>
            <p className="font-medium tabular-nums">
              {formatSupervisorDateUtc(report.ngayNop)}
            </p>
            {report.ngayDuyet && (
              <p className="mt-0.5 text-muted-foreground tabular-nums">
                Xử lý: {formatSupervisorDateUtc(report.ngayDuyet)}
              </p>
            )}
          </>
        );
      },
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row: { original: report } }) => {
        const statusMeta = getMilestoneEvidenceStatusMeta(report.trangThai);
        return (
          <>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusMeta.badgeClass}`}
            >
              {statusMeta.label}
            </span>
            {report.nguoiDuyet && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                {report.nguoiDuyet}
              </p>
            )}
          </>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row: { original: report } }) => {
        const isExpanded = expandedReportId === report.id;
        const hasNotes = hasReportNotes(report);
        return (
          <>
            <div className="inline-flex flex-wrap items-center justify-end gap-2">
              {hasNotes && (
                <Button variant="outline" size="sm"
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() =>
                    setExpandedReportId(isExpanded ? null : report.id)
                  }
                >
                  <MessageSquareText className="size-3.5 text-[#164E9B]" aria-hidden="true" />
                  <span>{isExpanded ? "Thu gọn" : "Ghi chú"}</span>
                </Button>
              )}

              <ReportAttachment report={report} view />
            </div>
          </>
        );
      },
    },
  ], [expandedReportId]);

  const table = useManagementDataTable({
    data: filteredReports,
    columns,
    getRowId: (item) => item.id,
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStudentId("ALL");
    setSelectedMilestone("ALL");
    setSelectedStatus("ALL");
  };

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2744]">
            Báo cáo tiến độ của Nghiên cứu sinh
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi toàn bộ minh chứng các mốc đào tạo do NCS đang hướng dẫn đã nộp và mở trực tiếp tài liệu PDF để thẩm định chuyên môn.
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
            href="/supervisor/extensions"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <CalendarClock className="size-4" aria-hidden="true" />
            <span>Thẩm định gia hạn</span>
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
              <p className="font-semibold">
                {reports.length ? "Chưa tải được toàn bộ báo cáo tiến độ" : "Không thể tải danh sách báo cáo tiến độ"}
              </p>
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
        <div
          role="status"
          aria-label="Đang tải thống kê báo cáo tiến độ"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse motion-reduce:animate-none"
        >
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="h-24 rounded-xl border border-border bg-card p-4">
              <div className="h-4 w-28 rounded bg-muted" />
              <div className="mt-3 h-7 w-14 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : error && reports.length === 0 ? null : (
        <section
          aria-label="Tổng hợp trạng thái báo cáo tiến độ"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Tổng hồ sơ đã nộp</span>
              <ClipboardCheck className="size-4 text-[#164E9B]" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F2744]">
              {counts.total}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Thuộc {studentFilterOptions.length} Nghiên cứu sinh
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Đang chờ Giáo vụ duyệt</span>
              <Clock className="size-4 text-amber-600" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-amber-700">
              {counts.pending}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Chờ GVHD xem & Giáo vụ kiểm tra
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Đã phê duyệt đạt mốc</span>
              <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-700">
              {counts.passed}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Đã lưu vào hồ sơ tiến trình 9 mốc
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Trả lại cần bổ sung</span>
              <AlertCircle className="size-4 text-rose-600" aria-hidden="true" />
            </div>
            <p
              className={`mt-2 text-2xl font-bold tabular-nums ${
                counts.rejected > 0 ? "text-rose-700" : "text-[#0F2744]"
              }`}
            >
              {counts.rejected}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Cần nhắc NCS hoàn thiện bản nộp lại
            </p>
          </div>
        </section>
      )}

      <section
        aria-label="Bảng báo cáo tiến độ và bộ lọc"
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="border-b border-border p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-[#164E9B]" aria-hidden="true" />
              <h2 className="text-base font-bold text-[#0F2744]">
                Danh sách minh chứng mốc đào tạo đã nộp
              </h2>
            </div>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex min-h-10 items-center gap-1.5 self-start rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-[#164E9B] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="pr-search-input"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                Tìm nhanh
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="pr-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  placeholder="Tên NCS, MSHV, tên mốc..."
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="pr-student-filter"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                Nghiên cứu sinh
              </label>
              <SupervisorSelect
                id="pr-student-filter"
                value={selectedStudentId}
                onValueChange={setSelectedStudentId}
                options={[
                  { value: "ALL", label: "Tất cả Nghiên cứu sinh" },
                  ...studentFilterOptions.map(({ id, hoTen, mshv }) => ({
                    value: id, label: `${hoTen} (${mshv})`,
                  })),
                ]}
              />
            </div>

            <div>
              <label
                htmlFor="pr-milestone-filter"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                Mốc đào tạo (1 - 9)
              </label>
              <SupervisorSelect
                id="pr-milestone-filter"
                value={selectedMilestone}
                onValueChange={setSelectedMilestone}
                options={[
                  { value: "ALL", label: "Tất cả 9 mốc" },
                  ...MILESTONE_NUMBERS.map((number) => ({ value: String(number), label: `Mốc ${number}` })),
                ]}
              />
            </div>

            <div>
              <label
                htmlFor="pr-status-filter"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                Trạng thái xử lý
              </label>
              <SupervisorSelect
                id="pr-status-filter"
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                options={[
                  { value: "ALL", label: "Tất cả trạng thái" },
                  { value: "PENDING_REVIEW", label: "Đang chờ duyệt" },
                  { value: "PASSED", label: "Đã duyệt" },
                  { value: "REJECTED", label: "Cần bổ sung" },
                ]}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5 animate-pulse motion-reduce:animate-none">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="h-14 rounded-lg bg-muted" />
            ))}
          </div>
        ) : error && reports.length === 0 ? null : filteredReports.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText
              className="mx-auto size-10 text-muted-foreground/60"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm font-semibold text-[#0F2744]">
              {hasActiveFilter
                ? "Không tìm thấy báo cáo nào khớp với bộ lọc hiện tại"
                : "Chưa có báo cáo tiến độ nào do Nghiên cứu sinh nộp"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {hasActiveFilter
                ? "Thử thay đổi tên NCS, chọn mốc khác hoặc xóa bộ lọc để xem toàn bộ danh sách."
                : "Khi NCS tải minh chứng các mốc lên hệ thống, tài liệu sẽ hiển thị tại đây."}
            </p>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 p-4">
            <ManagementDataTable
              table={table}
              minWidth="min-w-[880px]"
              itemLabel="báo cáo tiến độ"
              cellStyles={{ milestone: "max-w-48 whitespace-normal px-3 py-3.5", attachment: "max-w-52 px-3 py-3.5" }}
              emptyState="Chưa có báo cáo tiến độ"
              renderRowDetails={(report) =>
                report.id === expandedReportId && hasReportNotes(report) && <ReportNotes report={report} />
              }
            />
          </div>
        )}
      </section>

    </div>
  );
}

export default SupervisorProgressReportsWorkspace;
