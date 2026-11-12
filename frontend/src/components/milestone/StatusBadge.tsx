"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Lock,
  Unlock,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { MilestoneStatus as ProgressMilestoneStatus } from "@/src/types/ui/progress";

export type MilestoneStatus =
  | "locked"
  | "unlocked"
  | "pending"
  | "rejected"
  | "passed"
  | ProgressMilestoneStatus;

export interface StatusBadgeProps {
  status: MilestoneStatus;
  className?: string;
}

const STATUS_STYLE_MAP: Record<
  "locked" | "unlocked" | "pending" | "rejected" | "passed",
  {
    label: string;
    icon: LucideIcon;
    classes: string;
  }
> = {
  locked: {
    label: "Đang khóa",
    icon: Lock,
    classes: "border-slate-200 bg-[#F3F4F6] text-[#4B5563]",
  },
  unlocked: {
    label: "Đang mở",
    icon: Unlock,
    classes: "border-blue-200 bg-[#EFF6FF] text-[#1D4ED8]",
  },
  pending: {
    label: "Chờ duyệt",
    icon: Clock,
    classes: "border-amber-200 bg-[#FFFBEB] text-[#B45309]",
  },
  rejected: {
    label: "Từ chối",
    icon: XCircle,
    classes: "border-rose-200 bg-[#FEF2F2] text-[#DC2626]",
  },
  passed: {
    label: "Đạt",
    icon: CheckCircle2,
    classes: "border-emerald-200 bg-[#F0FDF4] text-[#15803D]",
  },
};

function normalizeStatus(
  status: MilestoneStatus
): "locked" | "unlocked" | "pending" | "rejected" | "passed" {
  switch (status) {
    case "LOCKED":
    case "locked":
      return "locked";
    case "UNLOCKED":
    case "unlocked":
      return "unlocked";
    case "PENDING_REVIEW":
    case "pending":
      return "pending";
    case "REJECTED":
    case "rejected":
      return "rejected";
    case "PASSED":
    case "passed":
      return "passed";
    default:
      return "locked";
  }
}

/**
 * StatusBadge
 *
 * Hiển thị 5 trạng thái mốc: Khóa / Đang mở / Chờ duyệt / Từ chối / Đạt.
 * Luôn đi kèm icon + màu tương phản + nhãn văn bản (đạt chuẩn WCAG AA).
 */
export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const normalized = normalizeStatus(status);
  const config = STATUS_STYLE_MAP[normalized];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.classes} ${className}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
