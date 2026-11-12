"use client";

import { useEffect, useId, useState } from "react";
import { Check, Copy, KeyRound, ShieldAlert, X } from "lucide-react";
import type { AdminUserViewItem } from "./user-meta";

export interface ResetPasswordDialogProps {
  user: AdminUserViewItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: (user: AdminUserViewItem) => Promise<string> | string;
  isLoading?: boolean;
}

export function ResetPasswordDialog({
  user,
  isOpen,
  onClose,
  onConfirmReset,
  isLoading = false,
}: ResetPasswordDialogProps) {
  const titleId = useId();
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setGeneratedPassword(null);
      setCopied(false);
    }
  }, [isOpen, user?.id]);

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

  const handleConfirm = async () => {
    const newPassword = await onConfirmReset(user);
    setGeneratedPassword(newPassword);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !isLoading && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              <KeyRound className="size-4.5" aria-hidden="true" />
            </span>
            <div>
              <h2 id={titleId} className="text-sm font-bold text-foreground">
                {generatedPassword
                  ? "Mật khẩu tạm thời đã được cấp"
                  : "Đặt lại mật khẩu tài khoản"}
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
            aria-label="Đóng hộp thoại đặt lại mật khẩu"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:opacity-40"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          {!generatedPassword ? (
            <>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Thao tác này sẽ hủy hiệu lực mật khẩu hiện tại của{" "}
                <strong className="font-semibold text-foreground">
                  {user.fullName}
                </strong>{" "}
                và cấp một mật khẩu tạm thời mới.
              </p>
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-200">
                <ShieldAlert
                  className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
                  aria-hidden="true"
                />
                <span>
                  Hệ thống sẽ bật cờ bắt buộc người dùng đổi mật khẩu ngay ở lần
                  đăng nhập kế tiếp.
                </span>
              </div>

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
                  type="button"
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white transition-colors duration-150 hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <KeyRound className="size-3.5" aria-hidden="true" />
                  <span>
                    {isLoading ? "Đang tạo..." : "Xác nhận đặt lại mật khẩu"}
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-border bg-muted/35 p-3.5">
                <div className="text-[11px] font-medium text-muted-foreground">
                  Mật khẩu tạm thời mới (chỉ hiển thị 1 lần)
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2">
                  <code className="select-all font-mono text-sm font-bold tracking-wide text-foreground">
                    {generatedPassword}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex h-7.5 shrink-0 items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                  >
                    {copied ? (
                      <>
                        <Check
                          className="size-3.5 text-emerald-600"
                          aria-hidden="true"
                        />
                        <span className="text-emerald-700 dark:text-emerald-300">
                          Đã sao chép
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" aria-hidden="true" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-200">
                Vui lòng sao chép và gửi mật khẩu tạm thời này qua kênh nội bộ an
                toàn. Người dùng bắt buộc phải đổi mật khẩu ở lần đăng nhập kế
                tiếp.
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 items-center rounded-lg bg-foreground px-4 text-xs font-semibold text-background transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                >
                  Hoàn tất &amp; Đóng
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordDialog;
