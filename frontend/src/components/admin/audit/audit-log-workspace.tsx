"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { useAuditLogDetail, useAuditLogs } from "@/src/hooks/api/use-audit";
import type { ListAuditQueryParams } from "@/src/types/api/audit";
import {
  type AuditActionFilterValue,
  type AuditLogViewItem,
  BACKEND_AUDIT_ENTITY_OPTIONS,
  formatAuditDateTime,
  getAuditClientIp,
  getAuditNcsName,
  getEntityTypeLabel,
  mapAuditLogApiToView,
} from "./audit-meta";
import { getAuditActionMeta } from "./audit-badge";
import { AuditFilters } from "./audit-filters";
import { AuditTable } from "./audit-table";
import { AuditDetailDialog } from "./audit-detail-dialog";

function escapeCsvCell(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value);
  return `"${raw.replace(/"/g, '""')}"`;
}

const getActionLabel = (action: string) => getAuditActionMeta(action).label;

export function AuditLogWorkspace() {
  // Bộ lọc & phân trang (server-side, GET /audit-logs)
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionFilter, setActionFilter] =
    useState<AuditActionFilterValue>("ALL");
  const [entityTypeFilter, setEntityTypeFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Modal chi tiết & Visual Diff
  const [selectedLog, setSelectedLog] = useState<AuditLogViewItem | null>(null);
  const [selectedInitialTab, setSelectedInitialTab] = useState<
    "overview" | "diff"
  >("overview");

  // Debounce ô tìm kiếm 400ms trước khi gọi API
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const queryParams: ListAuditQueryParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      action: actionFilter !== "ALL" ? actionFilter : undefined,
      entityType: entityTypeFilter !== "ALL" ? entityTypeFilter : undefined,
      // Gửi kèm offset giờ Việt Nam (+07:00): backend `new Date(...)` parse đúng mốc thời gian,
      // và vì chuỗi dài hơn 10 ký tự nên backend không gọi setHours theo múi giờ của server.
      fromDate: fromDate ? `${fromDate}T00:00:00+07:00` : undefined,
      toDate: toDate ? `${toDate}T23:59:59.999+07:00` : undefined,
    }),
    [page, limit, debouncedSearch, actionFilter, entityTypeFilter, fromDate, toDate]
  );

  const logsQuery = useAuditLogs(queryParams);
  const detailQuery = useAuditLogDetail(selectedLog?.id ?? null);

  const logs = useMemo(
    () =>
      (logsQuery.data?.data ?? []).map((log) =>
        mapAuditLogApiToView(log, getActionLabel)
      ),
    [logsQuery.data]
  );

  // Ưu tiên dữ liệu chi tiết mới nhất từ GET /audit-logs/:id khi đã tải xong
  const dialogLog = useMemo(() => {
    if (!selectedLog) return null;
    if (detailQuery.data && detailQuery.data.id === selectedLog.id) {
      return mapAuditLogApiToView(detailQuery.data, getActionLabel);
    }
    return selectedLog;
  }, [selectedLog, detailQuery.data]);

  const total = logsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, logsQuery.data?.totalPages ?? 1);
  const safePage = Math.min(page, totalPages);

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setActionFilter("ALL");
    setEntityTypeFilter("ALL");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const handleRefresh = () => {
    setFeedbackMessage(null);
    logsQuery.refetch().then((result) => {
      if (!result.error) {
        setFeedbackMessage("Đã làm mới dữ liệu nhật ký kiểm toán.");
      }
    });
  };

  // Xuất CSV các bản ghi của trang hiện tại (dữ liệu phân trang server-side)
  const handleExportCsv = () => {
    if (logs.length === 0) return;

    const headers = [
      "ID",
      "Thời gian",
      "Hành động (Mã)",
      "Hành động (Mô tả)",
      "Loại đối tượng",
      "ID đối tượng",
      "Người thao tác",
      "Username",
      "NCS liên quan",
      "MSHV",
      "IP",
      "Correlation ID",
      "Tóm tắt",
    ];

    const rows = logs.map((log) => [
      log.id,
      formatAuditDateTime(log.createdAt),
      log.action,
      getAuditActionMeta(log.action).label,
      getEntityTypeLabel(log.entityType),
      log.entityId,
      log.actor?.fullName ?? "Không xác định",
      log.actor?.username ?? log.actorId ?? "",
      getAuditNcsName(log.ncs) ?? "",
      log.ncs?.mshv ?? "",
      getAuditClientIp(log),
      log.correlationId ?? "",
      log.summary,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((row) => row.map((cell) => escapeCsvCell(cell)).join(","))
        .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute("download", `nhat-ky-kiem-toan-${today}-trang-${safePage}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setFeedbackMessage(
      `Đã xuất tệp CSV gồm ${logs.length} bản ghi của trang ${safePage}/${totalPages}.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Nhật ký kiểm toán thao tác
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi toàn bộ dấu vết nghiệp vụ bất biến và so sánh trực quan
            thay đổi dữ liệu (Visual Diff) trước và sau mỗi thao tác.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground sm:self-auto">
          <ShieldCheck className="size-4 text-[#164E9B]" aria-hidden="true" />
          <span>Chế độ chỉ đọc (Immutable Log)</span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-xs font-medium text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-200"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            aria-label="Đóng thông báo"
            className="rounded p-1 text-emerald-700 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Lỗi tải dữ liệu (403 khi không có quyền audit.read, 5xx...) */}
      {logsQuery.isError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-xs font-medium text-rose-800 dark:border-rose-800/70 dark:bg-rose-950/50 dark:text-rose-200"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{logsQuery.error.message}</span>
          </div>
          <button
            type="button"
            onClick={() => logsQuery.refetch()}
            className="rounded-lg border border-rose-200 bg-white px-3 py-1 font-semibold hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Filter Panel */}
      <AuditFilters
        searchQuery={searchQuery}
        actionFilter={actionFilter}
        entityTypeFilter={entityTypeFilter}
        fromDate={fromDate}
        toDate={toDate}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onActionChange={(value) => {
          setActionFilter(value);
          setPage(1);
        }}
        onEntityTypeChange={(value) => {
          setEntityTypeFilter(value);
          setPage(1);
        }}
        onFromDateChange={(value) => {
          setFromDate(value);
          setPage(1);
        }}
        onToDateChange={(value) => {
          setToDate(value);
          setPage(1);
        }}
        onResetFilters={handleResetFilters}
        onRefresh={handleRefresh}
        onExportCsv={handleExportCsv}
        entityTypeOptions={BACKEND_AUDIT_ENTITY_OPTIONS}
        totalCount={total}
        filteredCount={total}
        isRefreshing={logsQuery.isFetching}
      />

      {/* Audit Log Table */}
      <AuditTable
        logs={logs}
        isLoading={logsQuery.isLoading}
        onResetFilters={handleResetFilters}
        onSelectDetail={(log, initialTab = "overview") => {
          setSelectedInitialTab(initialTab);
          setSelectedLog(log);
        }}
        page={safePage}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={(nextPage) => setPage(nextPage)}
        onLimitChange={(nextLimit) => {
          setLimit(nextLimit);
          setPage(1);
        }}
      />

      {/* Detail & Visual Diff Modal */}
      <AuditDetailDialog
        log={dialogLog}
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        initialTab={selectedInitialTab}
      />
    </div>
  );
}

export default AuditLogWorkspace;
