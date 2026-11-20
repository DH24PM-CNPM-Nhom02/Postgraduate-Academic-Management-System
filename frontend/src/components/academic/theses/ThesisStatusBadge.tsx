"use client";

import React from "react";
import { CheckCircle2, Clock, RefreshCw, XCircle } from "lucide-react";
import type {
  BackendTrangThaiDeTai,
  ThesisViewFilterStatus,
} from "@/src/types/api/thesis";

export type ThesisBadgeStatus =
  | BackendTrangThaiDeTai
  | "CHUA_GIAO"
  | ThesisViewFilterStatus
  | string;

export interface ThesisStatusBadgeProps {
  status?: ThesisBadgeStatus | null;
  showDot?: boolean;
  showIcon?: boolean;
  className?: string;
  size?: "sm" | "md";
}

interface BadgeConfig {
  label: string;
  badgeClass: string;
  dotClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STATUS_CONFIGS: Record<string, BadgeConfig> = {
  HIEU_LUC: {
    label: "Đang hiệu lực",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
    icon: CheckCircle2,
  },
  CHUA_GIAO: {
    label: "Chưa giao đề tài",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
    icon: Clock,
  },
  DA_THAY_THE: {
    label: "Đã thay thế",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    dotClass: "bg-purple-500",
    icon: RefreshCw,
  },
  DA_HUY: {
    label: "Đã hủy",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
    icon: XCircle,
  },
};

export function ThesisStatusBadge({
  status,
  showDot = true,
  showIcon = false,
  className = "",
  size = "sm",
}: ThesisStatusBadgeProps) {
  const normalizedStatus = status ? String(status).toUpperCase() : "CHUA_GIAO";
  const config = STATUS_CONFIGS[normalizedStatus] || STATUS_CONFIGS.CHUA_GIAO;
  const IconComponent = config.icon;

  const sizeClasses =
    size === "md"
      ? "text-xs px-2.5 py-1 gap-1.5 font-semibold"
      : "text-[11px] px-2 py-0.5 gap-1.5 font-medium";

  return (
    <span
      className={`inline-flex items-center rounded-full border whitespace-nowrap transition-colors ${config.badgeClass} ${sizeClasses} ${className}`}
      title={config.label}
    >
      {showIcon ? (
        <IconComponent className="size-3 shrink-0" />
      ) : showDot ? (
        <span
          className={`size-1.5 rounded-full shrink-0 ${config.dotClass}`}
          aria-hidden="true"
        />
      ) : null}
      <span>{config.label}</span>
    </span>
  );
}

export default ThesisStatusBadge;
