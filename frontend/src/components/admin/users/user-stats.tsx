"use client";

import { Users, GraduationCap, Briefcase, Lock } from "lucide-react";
import type {
  AdminUserStatus,
  SystemRole,
  UserStatsSummary,
} from "@/src/types/ui/admin";

export interface UserStatsOverviewProps {
  stats: UserStatsSummary;
  isLoading?: boolean;
  activeRoleFilter?: SystemRole | "ALL";
  activeStatusFilter?: AdminUserStatus | "ALL";
  onQuickFilter?: (filter: {
    role?: SystemRole | "ALL";
    status?: AdminUserStatus | "ALL";
  }) => void;
}

export function UserStatsOverview({
  stats,
  isLoading = false,
  activeRoleFilter = "ALL",
  activeStatusFilter = "ALL",
  onQuickFilter,
}: UserStatsOverviewProps) {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-busy="true"
        aria-label="Đang tải thống kê tài khoản"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-28 rounded bg-muted animate-pulse motion-reduce:animate-none" />
              <div className="size-8 rounded-lg bg-muted animate-pulse motion-reduce:animate-none" />
            </div>
            <div className="mt-3 h-7 w-16 rounded bg-muted animate-pulse motion-reduce:animate-none" />
            <div className="mt-2 h-3 w-36 rounded bg-muted animate-pulse motion-reduce:animate-none" />
          </div>
        ))}
      </div>
    );
  }

  const academicStaffCount = stats.byRole.GVHD + stats.byRole.GIAO_VU;

  const cards = [
    {
      key: "total",
      label: "Tổng số tài khoản",
      value: stats.totalUsers,
      subtext: `${stats.activeUsers} tài khoản đang hoạt động`,
      icon: Users,
      iconTone:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
      isSelected: activeRoleFilter === "ALL" && activeStatusFilter === "ALL",
      onClick: onQuickFilter
        ? () => onQuickFilter({ role: "ALL", status: "ALL" })
        : undefined,
    },
    {
      key: "ncs",
      label: "Nghiên cứu sinh (NCS)",
      value: stats.byRole.NCS,
      subtext: "Tài khoản học viên tiến sĩ",
      icon: GraduationCap,
      iconTone:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
      isSelected: activeRoleFilter === "NCS" && activeStatusFilter === "ALL",
      onClick: onQuickFilter
        ? () => onQuickFilter({ role: "NCS", status: "ALL" })
        : undefined,
    },
    {
      key: "staff",
      label: "Giảng viên & Giáo vụ",
      value: academicStaffCount,
      subtext: `${stats.byRole.GVHD} GVHD • ${stats.byRole.GIAO_VU} Giáo vụ SĐH`,
      icon: Briefcase,
      iconTone:
        "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300",
      isSelected:
        activeRoleFilter === "GVHD" || activeRoleFilter === "GIAO_VU",
      onClick: onQuickFilter
        ? () => onQuickFilter({ role: "GVHD", status: "ALL" })
        : undefined,
    },
    {
      key: "locked",
      label: "Tài khoản bị khóa",
      value: stats.lockedUsers,
      subtext:
        stats.lockedUsers > 0
          ? "Đang tạm ngưng quyền đăng nhập"
          : "Không có tài khoản nào bị khóa",
      icon: Lock,
      iconTone:
        stats.lockedUsers > 0
          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300"
          : "bg-muted text-muted-foreground",
      isSelected: activeStatusFilter === "LOCKED",
      onClick: onQuickFilter
        ? () => onQuickFilter({ role: "ALL", status: "LOCKED" })
        : undefined,
    },
  ];

  return (
    <section aria-label="Tổng quan tài khoản hệ thống">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const InteractiveTag = card.onClick ? "button" : "div";

          return (
            <InteractiveTag
              key={card.key}
              type={card.onClick ? "button" : undefined}
              onClick={card.onClick}
              aria-pressed={card.onClick ? card.isSelected : undefined}
              className={`w-full rounded-xl border bg-card p-4 text-left transition-colors duration-150 ease-out motion-reduce:transition-none ${
                card.onClick
                  ? "cursor-pointer hover:border-border/80 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                  : ""
              } ${
                card.isSelected && card.onClick
                  ? "border-rose-300 bg-rose-50/25 dark:border-rose-800/80 dark:bg-rose-950/20"
                  : "border-border"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {card.label}
                </span>
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${card.iconTone}`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-2.5 text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {card.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                {card.subtext}
              </p>
            </InteractiveTag>
          );
        })}
      </div>
    </section>
  );
}

export default UserStatsOverview;
