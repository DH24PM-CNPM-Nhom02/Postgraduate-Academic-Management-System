"use client";

import { Download, RefreshCw, RotateCcw, Search, X } from "lucide-react";
import type { AuditActionType } from "@/src/types/ui/admin";
import { AUDIT_ACTION_META } from "./audit-badge";
import type { AuditActionFilterValue } from "./audit-meta";

export interface AuditEntityTypeOption {
  value: string;
  label: string;
}

export const DEFAULT_AUDIT_ENTITY_OPTIONS: AuditEntityTypeOption[] = [
  { value: "NCS", label: "Nghiên cứu sinh (NCS)" },
  { value: "NCS_BATCH", label: "Import danh sách NCS" },
  { value: "THESIS", label: "Đề tài luận án (DeTai)" },
  { value: "SUPERVISOR_ASSIGNMENT", label: "Phân công GVHD (PhanCongGvhd)" },
  { value: "MILESTONE_PROGRESS", label: "Tiến độ 9 mốc (TienTrinhNcs)" },
  { value: "DECISION", label: "Quyết định (QuyetDinh)" },
  { value: "CHANGE_REQUEST", label: "Đơn đề nghị (DeNghiDieuChinh)" },
  { value: "GRADUATION", label: "Xét tốt nghiệp (TotNghiep)" },
];

export interface AuditFiltersProps {
  searchQuery: string;
  actionFilter: AuditActionFilterValue;
  entityTypeFilter: string;
  fromDate: string;
  toDate: string;
  entityTypeOptions?: AuditEntityTypeOption[];
  onSearchChange: (value: string) => void;
  onActionChange: (value: AuditActionFilterValue) => void;
  onEntityTypeChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onResetFilters: () => void;
  onRefresh?: () => void;
  onExportCsv?: () => void;
  totalCount?: number;
  filteredCount?: number;
  isRefreshing?: boolean;
  disabled?: boolean;
}

const ALL_ACTION_KEYS = Object.keys(AUDIT_ACTION_META) as AuditActionType[];

export function AuditFilters({
  searchQuery,
  actionFilter,
  entityTypeFilter,
  fromDate,
  toDate,
  entityTypeOptions = DEFAULT_AUDIT_ENTITY_OPTIONS,
  onSearchChange,
  onActionChange,
  onEntityTypeChange,
  onFromDateChange,
  onToDateChange,
  onResetFilters,
  onRefresh,
  onExportCsv,
  totalCount,
  filteredCount,
  isRefreshing = false,
  disabled = false,
}: AuditFiltersProps) {
  const hasActiveFilter =
    searchQuery.trim().length > 0 ||
    actionFilter !== "ALL" ||
    entityTypeFilter !== "ALL" ||
    fromDate.length > 0 ||
    toDate.length > 0;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
        {/* Tìm kiếm tự do */}
        <div className="sm:col-span-2 lg:col-span-4">
          <label
            htmlFor="audit-search-input"
            className="mb-1.5 block text-xs font-medium text-foreground"
          >
            Tìm kiếm nhật ký
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="audit-search-input"
              type="search"
              value={searchQuery}
              disabled={disabled}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Mã hành động, thực thể, ID, người thao tác, MSHV..."
              className="h-9.5 w-full rounded-lg border border-border bg-background pr-9 pl-9 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Xóa từ khóa tìm kiếm"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Lọc theo hành động */}
        <div className="lg:col-span-3">
          <label
            htmlFor="audit-action-filter"
            className="mb-1.5 block text-xs font-medium text-foreground"
          >
            Hành động
          </label>
          <select
            id="audit-action-filter"
            value={actionFilter}
            disabled={disabled}
            onChange={(event) =>
              onActionChange(event.target.value as AuditActionFilterValue)
            }
            className="h-9.5 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors duration-150 focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="ALL">Tất cả hành động</option>
            {ALL_ACTION_KEYS.map((actionKey) => (
              <option key={actionKey} value={actionKey}>
                {AUDIT_ACTION_META[actionKey].label} ({actionKey})
              </option>
            ))}
          </select>
        </div>

        {/* Lọc theo loại đối tượng */}
        <div className="lg:col-span-2">
          <label
            htmlFor="audit-entity-filter"
            className="mb-1.5 block text-xs font-medium text-foreground"
          >
            Loại đối tượng
          </label>
          <select
            id="audit-entity-filter"
            value={entityTypeFilter}
            disabled={disabled}
            onChange={(event) => onEntityTypeChange(event.target.value)}
            className="h-9.5 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors duration-150 focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="ALL">Tất cả đối tượng</option>
            {entityTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Khoảng ngày */}
        <div className="sm:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="audit-from-date"
                className="mb-1.5 block text-xs font-medium text-foreground"
              >
                Từ ngày
              </label>
              <input
                id="audit-from-date"
                type="date"
                value={fromDate}
                max={toDate || undefined}
                disabled={disabled}
                onChange={(event) => onFromDateChange(event.target.value)}
                className="h-9.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground tabular-nums transition-colors duration-150 focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="audit-to-date"
                className="mb-1.5 block text-xs font-medium text-foreground"
              >
                Đến ngày
              </label>
              <input
                id="audit-to-date"
                type="date"
                value={toDate}
                min={fromDate || undefined}
                disabled={disabled}
                onChange={(event) => onToDateChange(event.target.value)}
                className="h-9.5 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground tabular-nums transition-colors duration-150 focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Thanh hành động phụ */}
      <div className="flex flex-col gap-2.5 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-muted-foreground tabular-nums">
          {typeof totalCount === "number" && typeof filteredCount === "number" ? (
            <span>
              Đang hiển thị{" "}
              <strong className="font-semibold text-foreground">
                {filteredCount}
              </strong>{" "}
              / {totalCount} bản ghi kiểm toán
            </span>
          ) : (
            <span>Bộ lọc nhật ký thao tác hệ thống</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            disabled={!hasActiveFilter || disabled}
            className="inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            <span>Đặt lại lọc</span>
          </button>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={disabled || isRefreshing}
              className="inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <RefreshCw
                className={`size-3.5 ${
                  isRefreshing ? "animate-spin motion-reduce:animate-none" : ""
                }`}
                aria-hidden="true"
              />
              <span>{isRefreshing ? "Đang tải..." : "Làm mới"}</span>
            </button>
          )}

          {onExportCsv && (
            <button
              type="button"
              onClick={onExportCsv}
              disabled={disabled || filteredCount === 0}
              className="inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition-colors duration-150 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-45 dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-950"
            >
              <Download className="size-3.5" aria-hidden="true" />
              <span>Xuất CSV</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditFilters;
