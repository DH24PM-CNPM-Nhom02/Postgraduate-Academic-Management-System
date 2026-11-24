"use client";

import { useEffect, useId, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, X } from "lucide-react";
import { getRoleMeta } from "@/src/components/admin/users/user-meta";
import { NOTIFICATION_GROUP_LABELS, type NotificationItem } from "@/src/types/notification";

interface NotificationDetailDialogProps {
  notification: NotificationItem | null;
  readError?: string | null;
  onClose: () => void;
  onOpenTarget?: (notification: NotificationItem) => void;
}

function formatDate(date: string) {
  const value = new Date(date);
  return Number.isNaN(value.getTime())
    ? date
    : value.toLocaleString("vi-VN", { dateStyle: "long", timeStyle: "short" });
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

const DETAIL_LABELS: Record<string, string> = {
  tenDeTai: "Đề tài",
  soQuyetDinh: "Số quyết định",
  ngayQuyetDinh: "Ngày quyết định",
  tenNcs: "Nghiên cứu sinh",
  mshv: "Mã số học viên",
  username: "Tên đăng nhập",
  hoTen: "Họ và tên",
  ghiChuLienHe: "Thông tin liên hệ",
  tenGvhd: "Giảng viên hướng dẫn",
  vaiTro: "Vai trò",
  thuTu: "Mốc tiến độ",
  lyDo: "Lý do",
  ngayHan: "Ngày hạn",
  hanMoi: "Hạn mới",
  diem: "Điểm",
  soNgayConLai: "Số ngày còn lại",
};

function formatDetailLabel(key: string) {
  return (
    DETAIL_LABELS[key] ??
    key
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/^./, (letter) => letter.toUpperCase())
  );
}

const emptySubscribe = () => () => {};

export function NotificationDetailDialog({
  notification,
  readError,
  onClose,
  onOpenTarget,
}: NotificationDetailDialogProps) {
  const titleId = useId();
  const portalRoot = useSyncExternalStore(
    emptySubscribe,
    () => document.body,
    () => null
  );

  useEffect(() => {
    if (!notification) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [notification, onClose]);

  if (!notification || !portalRoot) return null;

  const isPasswordRequest = notification.loai === "YEU_CAU_QUEN_MAT_KHAU";
  const details = Object.entries(notification.duLieu ?? {})
    .filter(([key]) => !key.startsWith("_") && !(isPasswordRequest && key === "yeuCauId"));
  const isRead = notification.daDoc;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none"
      >
        <header className="flex items-start justify-between gap-5 border-b border-border bg-muted/20 px-5 py-5 sm:px-7">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-border bg-card px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {NOTIFICATION_GROUP_LABELS[notification.nhom]}
              </span>
              <span
                className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
                  isRead
                    ? "bg-muted text-muted-foreground"
                    : "bg-[#164E9B]/10 text-[#164E9B]"
                }`}
              >
                {isRead ? "Đã đọc" : "Chưa đọc"}
              </span>
            </div>
            <h2 id={titleId} className="text-lg font-bold leading-snug text-foreground">
              {notification.tieuDe}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết thông báo"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {readError && (
            <p
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800"
            >
              Không thể lưu trạng thái đã đọc: {readError}
            </p>
          )}

          <section aria-labelledby={`${titleId}-content`}>
            <h3
              id={`${titleId}-content`}
              className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Nội dung thông báo
            </h3>
            <p className="whitespace-pre-wrap rounded-xl border border-border bg-background px-4 py-4 text-sm leading-6 text-foreground">
              {notification.noiDung}
            </p>
          </section>

          <section aria-labelledby={`${titleId}-metadata`}>
            <h3
              id={`${titleId}-metadata`}
              className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Thời gian
            </h3>
            <dl className="grid grid-cols-1 gap-3 rounded-xl border border-border p-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Được gửi lúc</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {formatDate(notification.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Trạng thái đọc</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {isRead && notification.readAt
                    ? formatDate(notification.readAt)
                    : isRead
                      ? "Đã đọc"
                      : "Chưa đọc"}
                </dd>
              </div>
            </dl>
          </section>

          {details.length > 0 && (
            <section aria-labelledby={`${titleId}-details`}>
              <h3
                id={`${titleId}-details`}
                className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Thông tin liên quan
              </h3>
              <dl className="grid grid-cols-1 gap-3 rounded-xl border border-border p-4 sm:grid-cols-2">
                {details.map(([key, value]) => (
                  <div key={key} className="min-w-0">
                    <dt className="text-xs text-muted-foreground">
                      {formatDetailLabel(key)}
                    </dt>
                    <dd className="mt-1 break-words text-sm font-medium text-foreground">
                      {typeof value === "object" && value !== null ? (
                        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-2 font-mono text-xs font-normal">
                          {formatValue(value)}
                        </pre>
                      ) : (
                        isPasswordRequest && key === "vaiTro" && typeof value === "string"
                          ? getRoleMeta(value)?.label ?? value
                          : formatValue(value)
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-border bg-muted/20 px-5 py-3 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
          >
            Đóng
          </button>
          {onOpenTarget && (
            <button
              type="button"
              onClick={() => onOpenTarget(notification)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#164E9B] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
            >
              <span>{isPasswordRequest ? "Xem yêu cầu cấp lại mật khẩu" : "Xem chi tiết học vụ"}</span>
              <ArrowUpRight className="size-3.5" />
            </button>
          )}
        </footer>
      </section>
    </div>,
    portalRoot
  );
}
