"use client";

import React from "react";
import { Users, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

export interface QuotaBarProps {
  used?: number;
  max?: number;
  independentCount?: number;
  coCount?: number;
  showDetails?: boolean;
  compact?: boolean;
  className?: string;
}

export function QuotaBar({
  used = 2.5,
  max = 3.0,
  independentCount = 1,
  coCount = 3,
  showDetails = true,
  compact = false,
  className = "",
}: QuotaBarProps) {
  const percentage = Math.min(Math.round((used / max) * 100), 100);
  const remaining = Math.max(0, Number((max - used).toFixed(1)));
  const isFull = used >= max;
  const isWarning = used >= max * 0.8 && !isFull;

  // Color styles based on quota usage
  const barColor = isFull
    ? "bg-rose-500"
    : isWarning
    ? "bg-amber-500"
    : "bg-emerald-500";

  const badgeColor = isFull
    ? "bg-rose-50 text-rose-700 border-rose-200"
    : isWarning
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-emerald-50 text-emerald-700 border-emerald-200";

  if (compact) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700">Hạn ngạch GVHD:</span>
          <span className="font-bold text-[#164E9B]">
            {used.toFixed(1)} / {max.toFixed(1)} NCS
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full transition-all duration-500 rounded-full ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Định mức hướng dẫn (BR-09)
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badgeColor}`}
            >
              {isFull ? (
                <>
                  <AlertTriangle className="size-3" />
                  Đã đạt trần
                </>
              ) : isWarning ? (
                <>
                  <AlertTriangle className="size-3" />
                  Gần chạm trần (còn {remaining})
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3" />
                  Hợp lệ (còn {remaining})
                </>
              )}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-[#0F2744]">
              {used.toFixed(1)}
            </span>
            <span className="text-sm font-medium text-slate-500">
              / {max.toFixed(1)} NCS tối đa
            </span>
          </div>
        </div>

        <div className="flex size-10 items-center justify-center rounded-xl bg-[#164E9B]/10 text-[#164E9B]">
          <Users className="size-5" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 space-y-1.5">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full transition-all duration-500 rounded-full ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>0 NCS</span>
          <span>{percentage}% hạn ngạch</span>
          <span>{max.toFixed(1)} NCS</span>
        </div>
      </div>

      {/* Detail breakdown */}
      {showDetails && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-[11px] text-slate-500">HD Độc lập (1.0)</p>
            <p className="font-bold text-slate-800">{independentCount} NCS = {independentCount * 1.0} chỉ tiêu</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-[11px] text-slate-500">Đồng HD (0.5)</p>
            <p className="font-bold text-slate-800">{coCount} NCS = {(coCount * 0.5).toFixed(1)} chỉ tiêu</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuotaBar;
