"use client";

import { useEffect, useId } from "react";
import { Mail, Phone, ShieldCheck, X } from "lucide-react";
import {
  type AdminUserViewItem,
  formatAdminDateTime,
  SYSTEM_ROLE_META,
  USER_STATUS_META,
} from "./user-meta";

export interface UserDetailDialogProps {
  user: AdminUserViewItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailDialog({
  user,
  isOpen,
  onClose,
}: UserDetailDialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const roleMeta = SYSTEM_ROLE_META[user.role];
  const statusMeta = USER_STATUS_META[user.status];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-xl animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-sm font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 id={titleId} className="text-base font-bold text-foreground">
                {user.academicTitle
                  ? `${user.academicTitle} ${user.fullName}`
                  : user.fullName}
              </h2>
              <p className="font-mono text-xs text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết tài khoản"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold ${roleMeta.badgeClass}`}
            >
              {roleMeta.label} ({user.role})
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-medium ${statusMeta.textClass}`}
            >
              <span
                className={`size-2 rounded-full ${statusMeta.dotClass}`}
                aria-hidden="true"
              />
              {statusMeta.label}
            </span>
            {user.mustChangePassword && (
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-semibold text-amber-700 dark:border-amber-800/70 dark:bg-amber-950/60 dark:text-amber-300">
                Yêu cầu đổi MK lần đầu
              </span>
            )}
          </div>

          <div className="rounded-xl border border-border bg-muted/25 p-3.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <ShieldCheck className="size-4 text-rose-600" aria-hidden="true" />
              <span>Phạm vi quyền hạn</span>
            </div>
            <p className="mt-1 text-muted-foreground">{roleMeta.description}</p>
          </div>

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-3">
              <dt className="text-[11px] text-muted-foreground">Email</dt>
              <dd className="mt-1 flex items-center gap-1.5 font-medium text-foreground">
                <Mail className="size-3.5 text-muted-foreground" aria-hidden="true" />
                <span className="truncate">{user.email}</span>
              </dd>
            </div>
            <div className="rounded-lg border border-border p-3">
              <dt className="text-[11px] text-muted-foreground">
                Số điện thoại
              </dt>
              <dd className="mt-1 flex items-center gap-1.5 font-medium text-foreground tabular-nums">
                <Phone className="size-3.5 text-muted-foreground" aria-hidden="true" />
                <span>{user.phone || "Chưa cập nhật"}</span>
              </dd>
            </div>
            <div className="rounded-lg border border-border p-3">
              <dt className="text-[11px] text-muted-foreground">
                Đơn vị / Khoa chuyên môn
              </dt>
              <dd className="mt-1 font-medium text-foreground">
                {user.department || "Chưa gán đơn vị"}
              </dd>
            </div>
            <div className="rounded-lg border border-border p-3">
              <dt className="text-[11px] text-muted-foreground">
                Mã số học viên / Ngày tạo
              </dt>
              <dd className="mt-1 font-medium text-foreground tabular-nums">
                {user.studentCode
                  ? `MSHV: ${user.studentCode}`
                  : formatAdminDateTime(user.createdAt, "—")}
              </dd>
            </div>
            <div className="rounded-lg border border-border p-3 sm:col-span-2">
              <dt className="text-[11px] text-muted-foreground">
                Lần đăng nhập gần nhất
              </dt>
              <dd className="mt-1 font-medium text-foreground tabular-nums">
                {formatAdminDateTime(user.lastLoginAt)}
              </dd>
            </div>
          </dl>

          {user.status === "LOCKED" && user.lockedReason && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-rose-800 dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-200">
              <span className="font-semibold">Lý do khóa tài khoản: </span>
              <span>{user.lockedReason}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-border bg-muted/20 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-4 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailDialog;
