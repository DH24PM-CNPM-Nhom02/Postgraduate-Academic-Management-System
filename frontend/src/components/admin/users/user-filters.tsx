"use client";

import { RotateCcw, Search } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import type { AdminUserStatus, SystemRole } from "@/src/types/ui/admin";
import { SYSTEM_ROLE_OPTIONS, USER_STATUS_META } from "./user-meta";

export type UserRoleFilter = SystemRole | "ALL";
export type UserStatusFilter = AdminUserStatus | "ALL";

const roleOptions: { value: UserRoleFilter; label: string }[] = [
  { value: "ALL", label: "Tất cả vai trò" },
  ...SYSTEM_ROLE_OPTIONS,
];
const statusOptions: { value: UserStatusFilter; label: string }[] = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "ACTIVE", label: USER_STATUS_META.ACTIVE.label },
  { value: "LOCKED", label: USER_STATUS_META.LOCKED.label },
];

interface UserFiltersProps {
  search: string;
  role: UserRoleFilter;
  status: UserStatusFilter;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: UserRoleFilter) => void;
  onStatusChange: (value: UserStatusFilter) => void;
  onReset: () => void;
}

const triggerClass = "h-9 w-full rounded-xl bg-slate-50/50 text-xs text-slate-700 focus-visible:border-[#164E9B] focus-visible:ring-[#164E9B]/30";

export function UserFilters({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onReset,
}: UserFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(10rem,auto)_minmax(10rem,auto)_auto] md:items-end">
      <div className="min-w-0">
        <label htmlFor="user-search" className="mb-1.5 block text-xs font-semibold text-slate-600">
          Tìm kiếm tài khoản
        </label>
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="user-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tên đăng nhập, họ tên hoặc email"
            className="h-9 rounded-xl bg-slate-50/50 pl-9 text-xs focus-visible:border-[#164E9B] focus-visible:ring-[#164E9B]/30 md:text-xs"
          />
        </div>
      </div>

      <div>
        <label htmlFor="user-role-filter" className="mb-1.5 block text-xs font-semibold text-slate-600">Vai trò</label>
        <Select items={roleOptions} value={role} onValueChange={(value) => onRoleChange(value ?? "ALL")}>
          <SelectTrigger id="user-role-filter" className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {roleOptions.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="user-status-filter" className="mb-1.5 block text-xs font-semibold text-slate-600">Trạng thái</label>
        <Select items={statusOptions} value={status} onValueChange={(value) => onStatusChange(value ?? "ALL")}>
          <SelectTrigger id="user-status-filter" className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {statusOptions.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={!search && role === "ALL" && status === "ALL"}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-[#164E9B] hover:bg-blue-50 disabled:opacity-45"
      >
        <RotateCcw className="size-3.5" aria-hidden="true" />
        Đặt lại bộ lọc
      </button>
    </div>
  );
}
