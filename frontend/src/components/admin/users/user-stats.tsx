"use client";

import { Briefcase, GraduationCap, Lock, UserRoundCog, Users, UserShield } from "lucide-react";
import type { UserAccount } from "@/src/types/api/user";
import type { UserRoleFilter, UserStatusFilter } from "./user-filters";

interface UserStatsOverviewProps {
  users: UserAccount[] | undefined;
  role: UserRoleFilter;
  status: UserStatusFilter;
  onQuickFilter: (role: UserRoleFilter, status: UserStatusFilter) => void;
}

export function UserStatsOverview({ users, role, status, onQuickFilter }: UserStatsOverviewProps) {
  const activeCount = users?.filter((user) => user.isActive).length;
  const lockedCount = users?.filter((user) => !user.isActive).length;
  const ncsCount = users?.filter((user) => user.roles.includes("NCS")).length;
  const gvhdCount = users?.filter((user) => user.roles.includes("GVHD")).length;
  const giaoVuCount = users?.filter((user) => user.roles.includes("GIAO_VU")).length;
  const adminCount = users?.filter((user) => user.roles.includes("ADMIN")).length;
  const cards = [
    {
      label: "Tổng số tài khoản",
      value: users?.length,
      detail: activeCount === undefined ? undefined : `${activeCount} đang hoạt động`,
      icon: Users,
      selected: role === "ALL" && status === "ALL",
      onClick: () => onQuickFilter("ALL", "ALL"),
    },
    {
      label: "Admin",
      value: adminCount,
      icon: UserShield,
      selected: role === "ADMIN" && status === "ALL",
      onClick: () => onQuickFilter("ADMIN", "ALL"),
    },
    {
      label: "Nghiên cứu sinh",
      value: ncsCount,
      icon: GraduationCap,
      selected: role === "NCS" && status === "ALL",
      onClick: () => onQuickFilter("NCS", "ALL"),
    },
    {
      label: "Giảng viên HD",
      value: gvhdCount,
      icon: Briefcase,
      selected: role === "GVHD" && status === "ALL",
      onClick: () => onQuickFilter("GVHD", "ALL"),
    },
    {
      label: "Giáo vụ",
      value: giaoVuCount,
      icon: UserRoundCog,
      selected: role === "GIAO_VU" && status === "ALL",
      onClick: () => onQuickFilter("GIAO_VU", "ALL"),
    },
    {
      label: "Tài khoản đã khóa",
      value: lockedCount,
      icon: Lock,
      selected: role === "ALL" && status === "LOCKED",
      onClick: () => onQuickFilter("ALL", "LOCKED"),
    },
  ];

  return (
    <section aria-label="Tổng quan tài khoản" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ label, value, detail, icon: Icon, selected, onClick }) => {
        const interactive = Boolean(users && onClick);
        const Card = interactive ? "button" : "div";

        return (
          <Card
            key={label}
            type={interactive ? "button" : undefined}
            onClick={interactive ? onClick : undefined}
            aria-pressed={interactive ? selected : undefined}
            className={`flex flex-col rounded-2xl border p-4 text-left shadow-xs ${interactive ? "transition-colors hover:bg-blue-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]/40" : ""} ${interactive && selected ? "border-blue-300 bg-blue-50/40" : "border-slate-200 bg-white"}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600">{label}</span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#164E9B]">
                <Icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-black text-[#0F2744] tabular-nums">{value ?? "—"}</div>
            {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
          </Card>
        );
      })}
    </section>
  );
}
