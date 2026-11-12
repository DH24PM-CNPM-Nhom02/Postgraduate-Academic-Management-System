"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import { mockAuditLogs } from "@/src/mocks/admin";
import {
  type AuditActionFilterValue,
  type AuditLogViewItem,
  formatAuditDateTime,
  getAuditClientIp,
  getAuditCorrelationId,
  getAuditNcsName,
  getEntityTypeLabel,
} from "./audit-meta";
import { getAuditActionMeta } from "./audit-badge";
import { AuditFilters } from "./audit-filters";
import { AuditTable } from "./audit-table";
import { AuditDetailDialog } from "./audit-detail-dialog";

function escapeCsvCell(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value);
  return `"${raw.replace(/"/g, '""')}"`;
}

export function AuditLogWorkspace() {
  // Dữ liệu nhật ký kiểm toán khởi tạo từ mockAuditLogs
  const [logs] = useState<AuditLogViewItem[]>(() =>
    [...mockAuditLogs].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  // Bộ lọc & phân trang
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] =
    useState<AuditActionFilterValue>("ALL");
  const [entityTypeFilter, setEntityTypeFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  // Trạng thái làm mới & thông báo
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Modal chi tiết & Visual Diff
  const [selectedLog, setSelectedLog] = useState<AuditLogViewItem | null>(null);
  const [selectedInitialTab, setSelectedInitialTab] = useState<
    "overview" | "diff"
  >("overview");

  // Lọc danh sách bản ghi
  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const fromBoundary = fromDate
      ? new Date(`${fromDate}T00:00:00`).getTime()
      : null;
    const toBoundary = toDate
      ? new Date(`${toDate}T23:59:59.999`).getTime()
      : null;

    return logs.filter((log) => {
      if (actionFilter !== "ALL" && log.action !== actionFilter) {
        return false;
      }
      if (entityTypeFilter !== "ALL" && log.entityType !== entityTypeFilter) {
        return false;
      }

      const logTime = new Date(log.createdAt).getTime();
      if (fromBoundary !== null && !Number.isNaN(logTime)) {
        if (logTime < fromBoundary) return false;
      }
      if (toBoundary !== null && !Number.isNaN(logTime)) {
        if (logTime > toBoundary) return false;
      }

      if (!query) return true;

      const actionMeta = getAuditActionMeta(log.action);
      const entityLabel = getEntityTypeLabel(log.entityType);
      const ncsName = getAuditNcsName(log.ncs) ?? "";

      return (
        log.id.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        actionMeta.label.toLowerCase().includes(query) ||
        log.entityType.toLowerCase().includes(query) ||
        entityLabel.toLowerCase().includes(query) ||
        log.entityId.toLowerCase().includes(query) ||
        log.summary.toLowerCase().includes(query) ||
        (log.actor?.fullName.toLowerCase().includes(query) ?? false) ||
        (log.actor?.username.toLowerCase().includes(query) ?? false) ||
        (log.actorId?.toLowerCase().includes(query) ?? false) ||
        ncsName.toLowerCase().includes(query) ||
        (log.ncs?.mshv.toLowerCase().includes(query) ?? false)
      );
    });
  }, [logs, searchQuery, actionFilter, entityTypeFilter, fromDate, toDate]);

  const total = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);

  const paginatedLogs = useMemo(() => {
    const start = (safePage - 1) * limit;
    return filteredLogs.slice(start, start + limit);
  }, [filteredLogs, safePage, limit]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setActionFilter("ALL");
    setEntityTypeFilter("ALL");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setFeedbackMessage("Đã làm mới dữ liệu nhật ký kiểm toán.");
    }, 250);
  };

  const handleExportCsv = () => {
    if (filteredLogs.length === 0) return;

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

    const rows = filteredLogs.map((log) => [
      log.id,
      formatAuditDateTime(log.createdAt),
      log.action,
      getAuditActionMeta(log.action).label,
      getEntityTypeLabel(log.entityType),
      log.entityId,
      log.actor?.fullName ?? "Tài khoản không còn tồn tại",
      log.actor?.username ?? log.actorId ?? "",
      getAuditNcsName(log.ncs) ?? "",
      log.ncs?.mshv ?? "",
      getAuditClientIp(log),
      getAuditCorrelationId(log),
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
    link.setAttribute("download", `nhat-ky-kiem-toan-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setFeedbackMessage(
      `Đã xuất tệp CSV gồm ${filteredLogs.length} bản ghi kiểm toán.`
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
          <ShieldCheck className="size-4 text-rose-600" aria-hidden="true" />
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
        totalCount={logs.length}
        filteredCount={total}
        isRefreshing={isRefreshing}
      />

      {/* Audit Log Table */}
      <AuditTable
        logs={paginatedLogs}
        isLoading={isRefreshing}
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
        log={selectedLog}
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        initialTab={selectedInitialTab}
      />
    </div>
  );
}

export default AuditLogWorkspace;
