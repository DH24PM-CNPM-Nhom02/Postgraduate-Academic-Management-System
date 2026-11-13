"use client";

import { Search, RotateCcw, X } from "lucide-react";
import type { AdminUserStatus, SystemRole } from "@/src/types/ui/admin";

export interface UserFiltersProps {
  searchQuery: string;
  roleFilter: SystemRole | "ALL";
  statusFilter: AdminUserStatus | "ALL";
  onSearchChange: (value: string) => void;
  onRoleChange: (value: SystemRole | "ALL") => void;
  onStatusChange: (value: AdminUserStatus | "ALL") => void;
  onResetFilters: () => void;
  totalCount?: number;
  filteredCount?: number;
  disabled?: boolean;
}

export function UserFilters({
  searchQuery,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onResetFilters,
  totalCount,
  filteredCount,
  disabled = false,
}: UserFiltersProps) {
  const hasActiveFilter =
    searchQuery.trim().length > 0 ||
    roleFilter !== "ALL" ||
    statusFilter !== "ALL";

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
          {/* Tìm kiếm từ khóa */}
          <div className="sm:col-span-2 lg:col-span-6">
            <label
              htmlFor="user-search-input"
              className="mb-1.5 block text-xs font-medium text-foreground"
            >
              Tìm kiếm tài khoản
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="user-search-input"
                type="search"
                value={searchQuery}
                disabled={disabled}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Tìm theo username, họ tên, email hoặc MSHV..."
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

          {/* Lọc vai trò */}
          <div className="lg:col-span-3">
            <label
              htmlFor="user-role-filter"
              className="mb-1.5 block text-xs font-medium text-foreground"
            >
              Vai trò hệ thống
            </label>
            <select
              id="user-role-filter"
              value={roleFilter}
              disabled={disabled}
              onChange={(event) =>
                onRoleChange(event.target.value as SystemRole | "ALL")
              }
              className="h-9.5 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors duration-150 focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="ADMIN">Quản trị viên (ADMIN)</option>
              <option value="GIAO_VU">Giáo vụ SĐH (GIAO_VU)</option>
              <option value="GVHD">Giảng viên HD (GVHD)</option>
              <option value="NCS">Nghiên cứu sinh (NCS)</option>
            </select>
          </div>

          {/* Lọc trạng thái */}
          <div className="lg:col-span-3">
            <label
              htmlFor="user-status-filter"
              className="mb-1.5 block text-xs font-medium text-foreground"
            >
              Trạng thái
            </label>
            <select
              id="user-status-filter"
              value={statusFilter}
              disabled={disabled}
              onChange={(event) =>
                onStatusChange(event.target.value as AdminUserStatus | "ALL")
              }
              className="h-9.5 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors duration-150 focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="LOCKED">Đã khóa</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          {typeof totalCount === "number" && typeof filteredCount === "number" && (
            <span className="text-xs text-muted-foreground tabular-nums">
              Kết quả:{" "}
              <strong className="font-semibold text-foreground">
                {filteredCount}
              </strong>
              /{totalCount}
            </span>
          )}
          <button
            type="button"
            onClick={onResetFilters}
            disabled={!hasActiveFilter || disabled}
            className="inline-flex h-9.5 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            <span>Đặt lại bộ lọc</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserFilters;
