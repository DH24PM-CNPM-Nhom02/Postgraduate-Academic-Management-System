import React from "react";
import { Lock, Unlock, Clock, XCircle, CheckCircle2 } from "lucide-react";
import { cn } from "cn";
import { MilestoneStatus } from "@/src/types";

/**
 * StatusBadge
 *
 * 5 trạng thái mốc: Chưa mở / Đến lượt nộp / Chờ duyệt / Cần nộp lại / Đã đạt.
 * Luôn có icon + màu + chữ (không chỉ dùng màu — WCAG AA) theo frontend-9moc-plan.md mục 1.1.
 */

export type StatusBadgeVariant =
  | MilestoneStatus
  | "locked"
  | "unlocked"
  | "pending"
  | "pending_review"
  | "rejected"
  | "passed";

export interface StatusBadgeProps {
  status: StatusBadgeVariant;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const normalizedStatus = String(status).toUpperCase();

  let label = "Chưa mở";
  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200";
  let Icon = Lock;

  switch (normalizedStatus) {
    case "LOCKED":
      label = "Chưa mở";
      colorClasses = "bg-slate-100 text-slate-700 border-slate-200";
      Icon = Lock;
      break;
    case "UNLOCKED":
      label = "Đến lượt nộp";
      colorClasses = "bg-blue-50 text-blue-700 border-blue-200";
      Icon = Unlock;
      break;
    case "PENDING_REVIEW":
    case "PENDING":
      label = "Chờ duyệt";
      colorClasses = "bg-amber-50 text-amber-800 border-amber-200";
      Icon = Clock;
      break;
    case "REJECTED":
      label = "Cần nộp lại";
      colorClasses = "bg-rose-50 text-rose-700 border-rose-200";
      Icon = XCircle;
      break;
    case "PASSED":
      label = "Đã đạt";
      colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
      Icon = CheckCircle2;
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide shadow-2xs transition-colors",
        colorClasses,
        className
      )}
    >
      {showIcon && <Icon className="size-3.5 shrink-0" />}
      <span>{label}</span>
    </span>
  );
}

export default StatusBadge;

