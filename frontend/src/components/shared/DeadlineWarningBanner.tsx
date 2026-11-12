"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, AlertTriangle, ArrowRight, Info, X } from "lucide-react";
import type {
  DeadlineBannerSeverity,
  DeadlineWarningBannerProps,
} from "@/src/types/ui/shared";

/**
 * DeadlineWarningBanner
 *
 * Banner cảnh báo thời hạn đào tạo (72 tháng) hoặc lưu ý học vụ quan trọng.
 * Tự động ẩn nếu truyền `remainingMonths >= 12` (trừ khi bật `alwaysShow` hoặc chỉ định `severity`).
 */
export function DeadlineWarningBanner({
  severity,
  remainingMonths,
  title,
  message,
  deadlineLabel,
  actionLabel,
  onAction,
  actionHref,
  dismissible = false,
  onDismiss,
  alwaysShow = false,
  className = "",
}: DeadlineWarningBannerProps) {
  if (
    !severity &&
    !alwaysShow &&
    remainingMonths !== undefined &&
    remainingMonths >= 12
  ) {
    return null;
  }

  const resolvedSeverity: DeadlineBannerSeverity =
    severity ??
    (remainingMonths !== undefined && remainingMonths < 3
      ? "critical"
      : remainingMonths !== undefined && remainingMonths < 12
      ? "warning"
      : "info");

  const visual = {
    info: {
      container: "border-blue-200 bg-blue-50/70 text-[#0F2744]",
      iconWrap: "border-blue-200 bg-card text-[#164E9B]",
      badge: "border-blue-200 bg-card text-[#164E9B]",
      actionBtn:
        "bg-[#164E9B] text-white hover:bg-[#113E7D] focus-visible:ring-[#164E9B]",
      Icon: Info,
      defaultTitle: "Thông báo học vụ",
    },
    warning: {
      container: "border-amber-200 bg-amber-50/80 text-amber-950",
      iconWrap: "border-amber-200 bg-card text-amber-700",
      badge: "border-amber-200 bg-card text-amber-800",
      actionBtn:
        "bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-600",
      Icon: AlertTriangle,
      defaultTitle: "Cảnh báo thời hạn đào tạo",
    },
    critical: {
      container: "border-rose-200 bg-rose-50/85 text-rose-950",
      iconWrap: "border-rose-200 bg-card text-rose-600",
      badge: "border-rose-200 bg-card text-rose-700",
      actionBtn:
        "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-600",
      Icon: AlertCircle,
      defaultTitle: "Thời hạn sắp kết thúc",
    },
  }[resolvedSeverity];

  const BannerIcon = visual.Icon;

  return (
    <section
      role={resolvedSeverity === "critical" ? "alert" : "status"}
      className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${visual.container} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${visual.iconWrap}`}
        >
          <BannerIcon className="size-4.5" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold leading-snug">
              {title || visual.defaultTitle}
            </h3>
            {deadlineLabel && (
              <span
                className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold tabular-nums ${visual.badge}`}
              >
                {deadlineLabel}
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed opacity-90 sm:text-[13px]">
            {message}
          </p>
        </div>
      </div>

      {(actionLabel || dismissible) && (
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
          {actionLabel && actionHref && (
            <Link
              href={actionHref}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${visual.actionBtn}`}
            >
              <span>{actionLabel}</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}

          {actionLabel && !actionHref && onAction && (
            <button
              type="button"
              onClick={onAction}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer ${visual.actionBtn}`}
            >
              <span>{actionLabel}</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          )}

          {dismissible && onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Đóng cảnh báo"
              className="inline-flex size-9 items-center justify-center rounded-lg text-current/70 transition-colors hover:bg-black/5 hover:text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default DeadlineWarningBanner;
