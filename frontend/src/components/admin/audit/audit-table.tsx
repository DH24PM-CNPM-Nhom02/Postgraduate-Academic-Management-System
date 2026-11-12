"use client";

import { useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  GitCompare,
  History,
  RefreshCw,
  RotateCcw,
  UserX,
} from "lucide-react";
import { SYSTEM_ROLE_META } from "../users/user-meta";
import { AuditBadge } from "./audit-badge";
import {
  type AuditLogViewItem,
  formatAuditDateTime,
  formatRelativeAuditTime,
  getAuditNcsName,
  getEntityTypeLabel,
  shortenEntityId,
} from "./audit-meta";

export interface AuditTableProps {
  logs: AuditLogViewItem[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onResetFilters?: () => void;
  onSelectDetail: (
    log: AuditLogViewItem,
    initialTab?: "overview" | "diff"
  ) => void;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function AuditTable({
  logs,
  isLoading = false,
  error = null,
  onRetry,
  onResetFilters,
  onSelectDetail,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: AuditTableProps) {
  const [copiedEntityKey, setCopiedEntityKey] = useState<string | null>(null);

  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotalPages);
  const startIndex = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const endIndex = Math.min(safePage * limit, total);

  const handleCopyEntityId = async (rowId: string, entityId: string) => {
    try {
      await navigator.clipboard.writeText(entityId);
      setCopiedEntityKey(rowId);
      setTimeout(() => setCopiedEntityKey(null), 1600);
    } catch {
      setCopiedEntityKey(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
              <th scope="col" className="px-4 py-3">
                Thời gian
              </th>
              <th scope="col" className="px-4 py-3">
                Người thao tác
              </th>
              <th scope="col" className="px-4 py-3">
                Hành động
              </th>
              <th scope="col" className="px-4 py-3">
                Đối tượng
              </th>
              <th scope="col" className="px-4 py-3">
                NCS liên quan
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Chi tiết
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {isLoading &&
              Array.from({ length: Math.min(limit, 6) }).map((_, index) => (
                <tr key={`audit-skeleton-${index}`} aria-hidden="true">
                  <td className="px-4 py-3.5">
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-32 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                      <div className="h-3 w-20 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-36 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                      <div className="h-3 w-24 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-1.5">
                      <div className="h-5 w-40 rounded-full bg-muted animate-pulse motion-reduce:animate-none" />
                      <div className="h-3 w-52 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-4 w-32 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-3.5 w-28 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="ml-auto h-8 w-28 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                  </td>
                </tr>
              ))}

            {!isLoading && error && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
                      <AlertCircle className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-foreground">
                      Không thể tải nhật ký kiểm toán
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{error}</p>
                    {onRetry && (
                      <button
                        type="button"
                        onClick={onRetry}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                      >
                        <RefreshCw className="size-3.5" aria-hidden="true" />
                        <span>Thử lại</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && !error && logs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <History className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-foreground">
                      Không có bản ghi kiểm toán phù hợp
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Thử mở rộng khoảng ngày hoặc đặt lại bộ lọc hành động và
                      loại đối tượng để xem thêm nhật ký.
                    </p>
                    {onResetFilters && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                      >
                        <RotateCcw className="size-3.5" aria-hidden="true" />
                        <span>Đặt lại lọc</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              logs.map((log) => {
                const ncsName = getAuditNcsName(log.ncs);
                const hasDiff =
                  (log.oldValue && Object.keys(log.oldValue).length > 0) ||
                  (log.newValue && Object.keys(log.newValue).length > 0);
                const isCopied = copiedEntityKey === log.id;

                return (
                  <tr
                    key={log.id}
                    className="transition-colors duration-150 hover:bg-muted/35"
                  >
                    {/* Thời gian */}
                    <td className="px-4 py-3.5 align-top whitespace-nowrap">
                      <div className="text-xs font-medium text-foreground tabular-nums">
                        {formatAuditDateTime(log.createdAt)}
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatRelativeAuditTime(log.createdAt)}
                      </div>
                    </td>

                    {/* Người thao tác */}
                    <td className="px-4 py-3.5 align-top">
                      {log.actor === null ? (
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-foreground">
                            <UserX
                              className="size-3.5 text-amber-600"
                              aria-hidden="true"
                            />
                            <span>
                              {shortenEntityId(log.actorId || "unknown-actor")}
                            </span>
                          </div>
                          <div>
                            <span className="inline-block rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/60 dark:text-amber-300">
                              Tài khoản người dùng này không còn tồn tại trên hệ
                              thống
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs font-semibold text-foreground">
                            {log.actor.fullName}
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span className="font-mono">
                              @{log.actor.username}
                            </span>
                            <span aria-hidden="true">•</span>
                            <span
                              className={`inline-flex rounded border px-1.5 py-0 text-[10px] font-semibold ${
                                SYSTEM_ROLE_META[log.actor.role].badgeClass
                              }`}
                            >
                              {log.actor.role}
                            </span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Hành động */}
                    <td className="px-4 py-3.5 align-top">
                      <AuditBadge action={log.action} />
                      <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground" title={log.summary}>
                        {log.summary}
                      </p>
                    </td>

                    {/* Đối tượng */}
                    <td className="px-4 py-3.5 align-top">
                      <div className="text-xs font-medium text-foreground">
                        {getEntityTypeLabel(log.entityType)}
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1">
                        <code
                          title={log.entityId}
                          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground/85"
                        >
                          {shortenEntityId(log.entityId)}
                        </code>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyEntityId(log.id, log.entityId)
                          }
                          aria-label={`Sao chép ID đối tượng ${log.entityId}`}
                          title="Sao chép ID / UUID đầy đủ"
                          className="inline-flex size-6 items-center justify-center rounded border border-border bg-background text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                        >
                          {isCopied ? (
                            <Check className="size-3 text-emerald-600" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* NCS liên quan */}
                    <td className="px-4 py-3.5 align-top">
                      {log.ncs && ncsName ? (
                        <div>
                          <div className="text-xs font-medium text-foreground">
                            {ncsName}
                          </div>
                          <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                            {log.ncs.mshv}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Chi tiết */}
                    <td className="px-4 py-3.5 align-top text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {hasDiff && (
                          <button
                            type="button"
                            onClick={() => onSelectDetail(log, "diff")}
                            aria-label={`So sánh thay đổi bản ghi ${log.id}`}
                            title="Mở nhanh so sánh Visual Diff"
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 text-xs font-medium text-rose-700 transition-colors duration-150 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-950"
                          >
                            <GitCompare
                              className="size-3.5"
                              aria-hidden="true"
                            />
                            <span className="hidden xl:inline">Diff</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectDetail(log, "overview")}
                          aria-label={`Xem chi tiết bản ghi ${log.id}`}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                        >
                          <Eye className="size-3.5" aria-hidden="true" />
                          <span>Xem chi tiết</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col gap-3 border-t border-border bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground tabular-nums">
          <span>
            Hiển thị{" "}
            <strong className="font-semibold text-foreground">
              {startIndex}–{endIndex}
            </strong>{" "}
            trên tổng{" "}
            <strong className="font-semibold text-foreground">{total}</strong>{" "}
            bản ghi
          </span>

          {onLimitChange && (
            <div className="flex items-center gap-1.5">
              <label htmlFor="audit-page-limit" className="text-xs">
                Số dòng:
              </label>
              <select
                id="audit-page-limit"
                value={limit}
                onChange={(event) => onLimitChange(Number(event.target.value))}
                className="h-7 rounded-md border border-border bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={15}>15</option>
                <option value={30}>30</option>
              </select>
            </div>
          )}
        </div>

        <nav
          aria-label="Phân trang nhật ký kiểm toán"
          className="flex items-center gap-1"
        >
          <button
            type="button"
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage <= 1 || isLoading}
            aria-label="Trang trước"
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            <span>Trước</span>
          </button>

          {Array.from({ length: safeTotalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === safePage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Trang ${pageNum}`}
                className={`inline-flex size-8 items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 ${
                  isActive
                    ? "bg-rose-600 text-white"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage >= safeTotalPages || isLoading}
            aria-label="Trang sau"
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span>Sau</span>
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
}

export default AuditTable;
