"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  ShieldAlert,
  X,
} from "lucide-react";
import type { ConfirmDialogProps } from "@/src/types/ui/shared";

function ConfirmDialogInner({
  onClose,
  onConfirm,
  title,
  description,
  variant = "info",
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy bỏ",
  requireAcknowledgement = false,
  acknowledgementLabel = "Tôi hiểu thao tác này không thể hoàn tác và xác nhận thực hiện.",
  isLoading = false,
  error = null,
}: Omit<ConfirmDialogProps, "isOpen">) {
  const titleId = useId();
  const descId = useId();
  const ackId = useId();
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      cancelBtnRef.current?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isLoading, onClose]);

  const variantConfig = {
    info: {
      icon: Info,
      iconWrapper: "border-blue-200 bg-blue-50 text-[#164E9B]",
      confirmBtn:
        "bg-[#164E9B] hover:bg-[#113E7D] focus-visible:ring-[#164E9B]",
      ackBox: "border-blue-200 bg-blue-50/50 text-[#0F2744]",
    },
    warning: {
      icon: AlertTriangle,
      iconWrapper: "border-amber-200 bg-amber-50 text-amber-700",
      confirmBtn:
        "bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-600",
      ackBox: "border-amber-200 bg-amber-50/60 text-amber-950",
    },
    destructive: {
      icon: ShieldAlert,
      iconWrapper: "border-rose-200 bg-rose-50 text-rose-700",
      confirmBtn:
        "bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-600",
      ackBox: "border-rose-200 bg-rose-50/60 text-rose-950",
    },
  }[variant];

  const VariantIcon = variantConfig.icon;
  const isConfirmDisabled =
    isLoading || (requireAcknowledgement && !acknowledged);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={() => {
        if (!isLoading) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-xs transition-opacity duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${variantConfig.iconWrapper}`}
            >
              <VariantIcon className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2
                id={titleId}
                className="text-base font-bold leading-snug text-foreground"
              >
                {title}
              </h2>
              <p
                id={descId}
                className="text-xs leading-relaxed text-muted-foreground sm:text-sm"
              >
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            aria-label="Đóng hộp thoại xác nhận"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-3 px-6 pb-5">
          {requireAcknowledgement && (
            <label
              htmlFor={ackId}
              className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed ${variantConfig.ackBox}`}
            >
              <input
                id={ackId}
                type="checkbox"
                checked={acknowledged}
                disabled={isLoading}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-border accent-[#164E9B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
              />
              <span className="font-medium select-none">
                {acknowledgementLabel}
              </span>
            </label>
          )}

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-800"
            >
              <AlertCircle
                className="mt-0.5 size-4 shrink-0 text-rose-600"
                aria-hidden="true"
              />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-border bg-muted/40 px-6 py-3.5">
          <button
            ref={cancelBtnRef}
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isConfirmDisabled}
            onClick={onConfirm}
            className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${variantConfig.confirmBtn}`}
          >
            {isLoading && (
              <Loader2
                className="size-3.5 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            )}
            <span>{isLoading ? "Đang xử lý..." : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ConfirmDialog
 *
 * Hộp thoại xác nhận hành động quan trọng (hỗ trợ `info` | `warning` | `destructive`,
 * chế độ bắt buộc tick xác nhận theo BR-04, và đóng bằng phím Escape).
 */
export function ConfirmDialog({ isOpen, ...props }: ConfirmDialogProps) {
  if (!isOpen) return null;
  return <ConfirmDialogInner {...props} />;
}

export default ConfirmDialog;
