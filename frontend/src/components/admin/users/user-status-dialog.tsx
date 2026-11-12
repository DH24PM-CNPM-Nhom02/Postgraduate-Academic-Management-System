"use client";

import { useEffect, useId, useState } from "react";
import { AlertTriangle, Lock, Unlock, X } from "lucide-react";
import type { AdminUserViewItem } from "./user-meta";

export interface UserStatusConfirmDialogProps {
  user: AdminUserViewItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    user: AdminUserViewItem,
    reason?: string
  ) => void | Promise<void>;
  isLoading?: boolean;
}

export function UserStatusConfirmDialog({
  user,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: UserStatusConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const reasonInputId = useId();
  const [reason, setReason] = useState("");

  useEffect(() => {
    setReason("");
  }, [user?.id, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen || !user) return null;

  const isLockAction = user.status === "ACTIVE";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onConfirm(user, reason.trim() || undefined);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !isLoading && onClose()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                isLockAction
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300"
                  : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300"
              }`}
            >
              {isLockAction ? (
                <Lock className="size-4.5" aria-hidden="true" />
              ) : (
                <Unlock className="size-4.5" aria-hidden="true" />
              )}
            </span>
            <div>
              <h2 id={titleId} className="text-sm font-bold text-foreground">
                {isLockAction
                  ? "Xác nhận khóa tài khoản"
                  : "Xác nhận mở khóa tài khoản"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {user.fullName} (@{user.username})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Đóng hộp thoại"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:opacity-40"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          {isLockAction ? (
            <>
              <div
                id={descriptionId}
                className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs leading-relaxed text-rose-800 dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-200"
              >
                <AlertTriangle
                  className="mt-0.5 size-4 shrink-0 text-rose-600 dark:text-rose-400"
                  aria-hidden="true"
                />
                <span>
                  Khóa tài khoản này sẽ ngăn người dùng đăng nhập ngay lập tức.
                  Các tiến trình học tập hiện có sẽ không bị ảnh hưởng.
                </span>
              </div>

              <div>
                <label
                  htmlFor={reasonInputId}
                  className="mb-1.5 block text-xs font-medium text-foreground"
                >
                  Lý do khóa tài khoản (tùy chọn)
                </label>
                <textarea
                  id={reasonInputId}
                  rows={2}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Ví dụ: Tạm ngưng quyền truy cập theo đề nghị của đơn vị..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                />
              </div>
            </>
          ) : (
            <div id={descriptionId} className="space-y-2.5 text-xs text-foreground">
              <p className="leading-relaxed text-muted-foreground">
                Mở khóa tài khoản sẽ khôi phục ngay quyền đăng nhập vào hệ thống
                cho{" "}
                <strong className="font-semibold text-foreground">
                  {user.fullName}
                </strong>
                .
              </p>
              {user.lockedReason && (
                <div className="rounded-lg border border-border bg-muted/40 p-2.5">
                  <span className="font-semibold text-foreground">
                    Lý do khóa trước đó:
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {user.lockedReason}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-4 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:opacity-45"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-semibold text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-50 ${
                isLockAction
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isLockAction ? (
                <Lock className="size-3.5" aria-hidden="true" />
              ) : (
                <Unlock className="size-3.5" aria-hidden="true" />
              )}
              <span>
                {isLoading
                  ? "Đang xử lý..."
                  : isLockAction
                  ? "Xác nhận khóa tài khoản"
                  : "Xác nhận mở khóa"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserStatusConfirmDialog;
