"use client";

import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Gauge } from "lucide-react";
import type { QuotaBarProps, QuotaWarningLevel } from "@/src/types/ui/supervisor";

function getWarningMeta(level: QuotaWarningLevel) {
  switch (level) {
    case "EXCEEDED":
      return {
        label: "Vượt hạn mức",
        barColor: "bg-rose-600",
        badgeClasses: "border-rose-200 bg-rose-50 text-rose-700",
        panelClasses: "bg-rose-50/80 text-rose-900",
        Icon: AlertCircle,
      };
    case "FULL":
      return {
        label: "Đã đạt trần",
        barColor: "bg-rose-600",
        badgeClasses: "border-rose-200 bg-rose-50 text-rose-700",
        panelClasses: "bg-rose-50/75 text-rose-900",
        Icon: AlertCircle,
      };
    case "WARNING":
      return {
        label: "Gần chạm trần",
        barColor: "bg-amber-500",
        badgeClasses: "border-amber-200 bg-amber-50 text-amber-800",
        panelClasses: "bg-amber-50/80 text-amber-950",
        Icon: AlertTriangle,
      };
    case "SAFE":
    default:
      return {
        label: "Trong hạn mức",
        barColor: "bg-[#164E9B]",
        badgeClasses: "border-emerald-200 bg-emerald-50 text-emerald-700",
        panelClasses: "bg-[#164E9B]/6 text-[#0F2744]",
        Icon: CheckCircle2,
      };
  }
}

/**
 * QuotaBar
 *
 * Hiển thị thanh định mức hướng dẫn quy đổi theo trọng số Quy chế BR-09
 * (Hướng dẫn chính = 1.0, Đồng hướng dẫn = 0.5) so với hạn mức tối đa.
 */
export function QuotaBar({
  quota,
  compact = false,
  showDetails = true,
  isLoading = false,
  className = "",
}: QuotaBarProps) {
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Đang tải định mức hướng dẫn"
        className={`animate-pulse motion-reduce:animate-none rounded-xl border border-border bg-card p-5 ${className}`}
      >
        <div className="space-y-3">
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="h-7 w-28 rounded bg-muted" />
          <div className="h-2.5 w-full rounded-full bg-muted" />
        </div>
      </div>
    );
  }

  const clampedPercent = Math.min(Math.max(quota.tyLeSuDungPhanTram, 0), 100);
  const meta = getWarningMeta(quota.mucCanhBao);
  const StatusIcon = meta.Icon;

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-foreground">
            Tổng trọng số định mức (BR-09)
          </span>
          <span className="font-mono font-bold tabular-nums text-[#164E9B]">
            {quota.tongTrongSo.toFixed(1)} / {quota.hanMucToiDa.toFixed(1)}
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={quota.tongTrongSo}
          aria-valuemin={0}
          aria-valuemax={quota.hanMucToiDa}
          aria-label={`Đã sử dụng ${quota.tongTrongSo.toFixed(1)} trên ${quota.hanMucToiDa.toFixed(1)} điểm định mức`}
          className="h-2.5 w-full overflow-hidden rounded-full bg-border"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 motion-reduce:transition-none ${meta.barColor}`}
            style={{ width: `${clampedPercent}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span>
            Chính: <strong className="text-foreground">{quota.soLuongHuongDanChinh}</strong> (×1.0) • Phụ:{" "}
            <strong className="text-foreground">{quota.soLuongDongHuongDan}</strong> (×0.5)
          </span>
          <span className={`font-semibold ${quota.mucCanhBao === "WARNING" ? "text-amber-700" : quota.mucCanhBao === "SAFE" ? "text-emerald-700" : "text-rose-700"}`}>
            {meta.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label="Thanh định mức hướng dẫn BR-09"
      className={`rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6 ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold tracking-tight text-[#0F2744]">
              Định mức hướng dẫn quy đổi (BR-09)
            </h2>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${meta.badgeClasses}`}
            >
              <StatusIcon className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{meta.label}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold tracking-tight tabular-nums text-[#0F2744]">
              {quota.tongTrongSo.toFixed(1)}
            </span>
            <span className="font-mono text-sm font-semibold tabular-nums text-muted-foreground">
              / {quota.hanMucToiDa.toFixed(1)} điểm định mức tối đa
            </span>
          </div>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#164E9B]/10 text-[#164E9B]">
          <Gauge className="size-5" aria-hidden="true" />
        </div>
      </div>

      {/* Thanh tiến trình trọng số */}
      <div className="mt-4 space-y-2">
        <div
          role="progressbar"
          aria-valuenow={quota.tongTrongSo}
          aria-valuemin={0}
          aria-valuemax={quota.hanMucToiDa}
          aria-label={`Đã sử dụng ${quota.tongTrongSo.toFixed(1)} trên ${quota.hanMucToiDa.toFixed(1)} điểm định mức`}
          className="h-3 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 motion-reduce:transition-none ${meta.barColor}`}
            style={{ width: `${clampedPercent}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Tỷ lệ sử dụng:{" "}
            <strong className="font-mono font-bold tabular-nums text-foreground">
              {quota.tyLeSuDungPhanTram}%
            </strong>
          </span>
          <span>
            Còn khả dụng:{" "}
            <strong className="font-mono font-bold tabular-nums text-[#164E9B]">
              {quota.trongSoConLai.toFixed(1)}
            </strong>{" "}
            điểm định mức
          </span>
        </div>
      </div>

      {/* Chi tiết quy đổi trọng số Chính (1.0) & Phụ (0.5) */}
      {showDetails && (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-muted/50 p-3.5">
              <p className="text-xs font-medium text-muted-foreground">
                Hướng dẫn chính (trọng số 1.0 / NCS)
              </p>
              <p className="mt-1 font-mono text-sm font-bold tabular-nums text-foreground">
                {quota.soLuongHuongDanChinh} NCS × 1.0 ={" "}
                <span className="text-[#164E9B]">{quota.trongSoChinh.toFixed(1)}</span>
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-3.5">
              <p className="text-xs font-medium text-muted-foreground">
                Đồng hướng dẫn / Phụ (trọng số 0.5 / NCS)
              </p>
              <p className="mt-1 font-mono text-sm font-bold tabular-nums text-foreground">
                {quota.soLuongDongHuongDan} NCS × 0.5 ={" "}
                <span className="text-[#164E9B]">{quota.trongSoPhu.toFixed(1)}</span>
              </p>
            </div>
          </div>

          {quota.ghiChuCanhBao && (
            <div className={`flex items-start gap-2.5 rounded-xl p-3 text-xs leading-relaxed ${meta.panelClasses}`}>
              <StatusIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{quota.ghiChuCanhBao}</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default QuotaBar;
