"use client";

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  KeyRound,
  Lock,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Unlock,
  Users,
} from "lucide-react";
import {
  type AdminUserViewItem,
  formatAdminDateTime,
  SYSTEM_ROLE_META,
  USER_STATUS_META,
} from "./user-meta";

export interface UserTableProps {
  users: AdminUserViewItem[];
  currentUserId?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onToggleStatus: (user: AdminUserViewItem) => void;
  onResetPassword: (user: AdminUserViewItem) => void;
  onViewDetail?: (user: AdminUserViewItem) => void;
  onResetFilters?: () => void;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function UserTable({
  users,
  currentUserId,
  isLoading = false,
  error = null,
  onRetry,
  onToggleStatus,
  onResetPassword,
  onViewDetail,
  onResetFilters,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: UserTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, totalItems);

  // Tự động cắt trang nếu caller truyền toàn bộ danh sách lớn hơn pageSize
  const displayedUsers =
    users.length > pageSize
      ? users.slice((safePage - 1) * pageSize, safePage * pageSize)
      : users;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
              <th scope="col" className="px-4 py-3">
                Người dùng
              </th>
              <th scope="col" className="px-4 py-3">
                Vai trò
              </th>
              <th scope="col" className="px-4 py-3">
                Đơn vị / Mã số
              </th>
              <th scope="col" className="px-4 py-3">
                Trạng thái
              </th>
              <th scope="col" className="px-4 py-3">
                Đăng nhập gần nhất
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {isLoading &&
              Array.from({ length: Math.min(pageSize, 6) }).map((_, index) => (
                <tr key={`skeleton-${index}`} aria-hidden="true">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="size-9 shrink-0 rounded-full bg-muted animate-pulse motion-reduce:animate-none" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-36 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                        <div className="h-3 w-48 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-5 w-24 rounded-full bg-muted animate-pulse motion-reduce:animate-none" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-3.5 w-40 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-4 w-28 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-3.5 w-28 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="ml-auto h-7 w-40 rounded bg-muted animate-pulse motion-reduce:animate-none" />
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
                      Không thể tải danh sách người dùng
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

            {!isLoading && !error && displayedUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Users className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-foreground">
                      Không tìm thấy tài khoản phù hợp
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Hãy kiểm tra lại từ khóa tìm kiếm hoặc nới lỏng bộ lọc vai
                      trò và trạng thái.
                    </p>
                    {onResetFilters && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                      >
                        <RotateCcw className="size-3.5" aria-hidden="true" />
                        <span>Đặt lại bộ lọc</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              displayedUsers.map((user) => {
                const roleMeta = SYSTEM_ROLE_META[user.role];
                const statusMeta = USER_STATUS_META[user.status];
                const isSelf = Boolean(currentUserId && user.id === currentUserId);
                const isLocked = user.status === "LOCKED";
                const disableSelfLock = isSelf && !isLocked;

                return (
                  <tr
                    key={user.id}
                    className={`transition-colors duration-150 hover:bg-muted/35 ${
                      isLocked ? "bg-muted/15" : ""
                    }`}
                  >
                    {/* Người dùng */}
                    <td className="px-4 py-3.5 align-top">
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-foreground">
                              {user.academicTitle
                                ? `${user.academicTitle} ${user.fullName}`
                                : user.fullName}
                            </span>
                            {isSelf && (
                              <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/70 dark:text-rose-300">
                                Đang đăng nhập
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                            <span className="font-mono text-[11px] text-foreground/80">
                              @{user.username}
                            </span>
                            <span aria-hidden="true">•</span>
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Vai trò */}
                    <td className="px-4 py-3.5 align-top">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleMeta.badgeClass}`}
                      >
                        {roleMeta.label}
                      </span>
                    </td>

                    {/* Đơn vị / Mã số */}
                    <td className="px-4 py-3.5 align-top">
                      <div className="text-xs font-medium text-foreground">
                        {user.department || "Chưa gán đơn vị"}
                      </div>
                      {user.studentCode && (
                        <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                          MSHV: {user.studentCode}
                        </div>
                      )}
                    </td>

                    {/* Trạng thái */}
                    <td className="px-4 py-3.5 align-top">
                      <div className="flex flex-col items-start gap-1">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusMeta.textClass}`}
                        >
                          <span
                            className={`size-2 rounded-full ${statusMeta.dotClass}`}
                            aria-hidden="true"
                          />
                          {statusMeta.label}
                        </span>
                        {user.mustChangePassword && (
                          <span className="inline-flex items-center rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800/70 dark:bg-amber-950/60 dark:text-amber-300">
                            Yêu cầu đổi MK lần đầu
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Đăng nhập gần nhất */}
                    <td className="px-4 py-3.5 align-top text-xs text-muted-foreground tabular-nums">
                      {formatAdminDateTime(user.lastLoginAt)}
                    </td>

                    {/* Thao tác */}
                    <td className="px-4 py-3.5 align-top text-right">
                      <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                        {onViewDetail && (
                          <button
                            type="button"
                            onClick={() => onViewDetail(user)}
                            aria-label={`Xem chi tiết ${user.fullName}`}
                            title="Xem chi tiết tài khoản"
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                          >
                            <Eye className="size-3.5" aria-hidden="true" />
                            <span className="hidden xl:inline">Chi tiết</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onResetPassword(user)}
                          aria-label={`Đặt lại mật khẩu cho ${user.fullName}`}
                          title="Đặt lại mật khẩu"
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                        >
                          <KeyRound className="size-3.5" aria-hidden="true" />
                          <span>Đặt lại MK</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleStatus(user)}
                          disabled={disableSelfLock}
                          aria-disabled={disableSelfLock}
                          aria-label={
                            disableSelfLock
                              ? `Không thể tự khóa tài khoản ${user.fullName}`
                              : isLocked
                              ? `Mở khóa tài khoản ${user.fullName}`
                              : `Khóa tài khoản ${user.fullName}`
                          }
                          title={
                            disableSelfLock
                              ? "An toàn hệ thống: Không thể tự khóa tài khoản Admin đang đăng nhập"
                              : isLocked
                              ? "Mở khóa tài khoản"
                              : "Khóa tài khoản"
                          }
                          className={`inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-45 ${
                            isLocked
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-950"
                              : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-950"
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <Unlock className="size-3.5" aria-hidden="true" />
                              <span>Mở khóa</span>
                            </>
                          ) : (
                            <>
                              <Lock className="size-3.5" aria-hidden="true" />
                              <span>Khóa</span>
                            </>
                          )}
                        </button>
                      </div>

                      {disableSelfLock && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                          <ShieldAlert className="size-3 text-rose-600" aria-hidden="true" />
                          <span>Bảo vệ chống tự khóa</span>
                        </div>
                      )}
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
            <strong className="font-semibold text-foreground">
              {totalItems}
            </strong>{" "}
            tài khoản
          </span>

          {onPageSizeChange && (
            <div className="flex items-center gap-1.5">
              <label htmlFor="user-page-size" className="text-xs">
                Số dòng:
              </label>
              <select
                id="user-page-size"
                value={pageSize}
                onChange={(event) =>
                  onPageSizeChange(Number(event.target.value))
                }
                className="h-7 rounded-md border border-border bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={20}>20</option>
              </select>
            </div>
          )}
        </div>

        <nav
          aria-label="Phân trang danh sách tài khoản"
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

          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            const isActive = page === safePage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Trang ${page}`}
                className={`inline-flex size-8 items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 ${
                  isActive
                    ? "bg-rose-600 text-white"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage >= totalPages || isLoading}
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

export default UserTable;
