"use client";

import React from "react";
import { AlertTriangle, Clock } from "lucide-react";
import type {
  DeadlineCountdownProps,
  DeadlineUrgency,
} from "@/src/types/ui/shared";

interface CountdownCalculation {
  diffDays: number;
  urgency: DeadlineUrgency;
  text: string;
  formattedTarget: string;
}

function calculateCountdown(
  targetInput: string | Date,
  referenceInput: string | Date | undefined,
  warningThresholdDays: number,
  criticalThresholdDays: number
): CountdownCalculation {
  const target = new Date(targetInput);
  const reference = referenceInput ? new Date(referenceInput) : new Date();

  if (Number.isNaN(target.getTime())) {
    return {
      diffDays: 0,
      urgency: "normal",
      text: "Chưa xác định thời hạn",
      formattedTarget: "--/--/----",
    };
  }

  const targetDay = Date.UTC(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate()
  );
  const refDay = Date.UTC(
    reference.getUTCFullYear(),
    reference.getUTCMonth(),
    reference.getUTCDate()
  );

  const diffDays = Math.round((targetDay - refDay) / (1000 * 60 * 60 * 24));

  const dayStr = String(target.getUTCDate()).padStart(2, "0");
  const monthStr = String(target.getUTCMonth() + 1).padStart(2, "0");
  const yearStr = target.getUTCFullYear();
  const formattedTarget = `${dayStr}/${monthStr}/${yearStr}`;

  if (diffDays < 0) {
    return {
      diffDays,
      urgency: "overdue",
      text: `Quá hạn ${Math.abs(diffDays)} ngày`,
      formattedTarget,
    };
  }

  if (diffDays === 0) {
    return {
      diffDays: 0,
      urgency: "critical",
      text: "Hết hạn hôm nay",
      formattedTarget,
    };
  }

  const months = Math.floor(diffDays / 30);
  const remainingDays = diffDays % 30;
  const text =
    months > 0
      ? remainingDays > 0
        ? `Còn ${months} tháng ${remainingDays} ngày`
        : `Còn ${months} tháng`
      : `Còn ${diffDays} ngày`;

  let urgency: DeadlineUrgency = "normal";
  if (diffDays <= criticalThresholdDays) {
    urgency = "critical";
  } else if (diffDays <= warningThresholdDays) {
    urgency = "warning";
  }

  return {
    diffDays,
    urgency,
    text,
    formattedTarget,
  };
}

/**
 * DeadlineCountdown
 *
 * Hiển thị bộ đếm ngược số ngày / tháng còn lại đến hạn nộp mốc
 * hoặc hạn đào tạo 72 tháng dưới dạng `badge` hoặc `card`.
 */
export function DeadlineCountdown({
  targetDate,
  label,
  referenceDate,
  variant = "badge",
  warningThresholdDays = 365,
  criticalThresholdDays = 90,
  className = "",
}: DeadlineCountdownProps) {
  const { urgency, text, formattedTarget } = calculateCountdown(
    targetDate,
    referenceDate,
    warningThresholdDays,
    criticalThresholdDays
  );

  const styleMap: Record<
    DeadlineUrgency,
    { wrapper: string; iconClass: string; textClass: string }
  > = {
    normal: {
      wrapper: "border-blue-200 bg-blue-50/70 text-[#0F2744]",
      iconClass: "text-[#164E9B]",
      textClass: "text-[#164E9B]",
    },
    warning: {
      wrapper: "border-amber-200 bg-amber-50/80 text-amber-950",
      iconClass: "text-amber-700",
      textClass: "text-amber-800",
    },
    critical: {
      wrapper: "border-rose-200 bg-rose-50/80 text-rose-950",
      iconClass: "text-rose-600",
      textClass: "text-rose-700",
    },
    overdue: {
      wrapper: "border-rose-300 bg-rose-100/80 text-rose-950",
      iconClass: "text-rose-700",
      textClass: "text-rose-800",
    },
  };

  const visual = styleMap[urgency];
  const IconComponent =
    urgency === "critical" || urgency === "overdue" ? AlertTriangle : Clock;

  if (variant === "card") {
    return (
      <div
        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${visual.wrapper} ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-current/15 bg-card">
            <IconComponent className={`size-4 ${visual.iconClass}`} aria-hidden="true" />
          </div>
          <div>
            {label && (
              <p className="text-xs font-medium text-muted-foreground">
                {label}
              </p>
            )}
            <p
              suppressHydrationWarning
              className={`font-mono text-sm font-bold tabular-nums ${visual.textClass}`}
            >
              {text}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-[11px] text-muted-foreground">
            Mốc hạn
          </span>
          <span className="font-mono text-xs font-semibold tabular-nums">
            {formattedTarget}
          </span>
        </div>
      </div>
    );
  }

  return (
    <span
      suppressHydrationWarning
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tabular-nums ${visual.wrapper} ${className}`}
    >
      <IconComponent className={`size-3.5 shrink-0 ${visual.iconClass}`} aria-hidden="true" />
      {label && <span className="font-normal opacity-80">{label}:</span>}
      <span className={`font-mono font-bold ${visual.textClass}`}>{text}</span>
    </span>
  );
}

export default DeadlineCountdown;
