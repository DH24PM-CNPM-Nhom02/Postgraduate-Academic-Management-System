import type { AdminUserStatus, SystemRole } from "@/src/types/ui/admin";

export interface RoleMeta {
  label: string;
  badgeClass: string;
}

export const SYSTEM_ROLE_META: Record<SystemRole, RoleMeta> = {
  ADMIN: {
    label: "Quản trị viên",
    badgeClass:
      "border-slate-300 bg-slate-100 text-slate-800 font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  },
  GIAO_VU: {
    label: "Giáo vụ SĐH",
    badgeClass:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/70 dark:bg-blue-950/60 dark:text-blue-300",
  },
  GVHD: {
    label: "Giảng viên HD",
    badgeClass:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/70 dark:bg-sky-950/60 dark:text-sky-300",
  },
  NCS: {
    label: "Nghiên cứu sinh",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
};

export const USER_STATUS_META: Record<
  AdminUserStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  ACTIVE: {
    label: "Đang hoạt động",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-700 dark:text-emerald-400",
  },
  LOCKED: {
    label: "Đã khóa",
    dotClass: "bg-rose-500",
    textClass: "text-rose-700 dark:text-rose-400",
  },
};

export const SYSTEM_ROLE_OPTIONS = (Object.keys(SYSTEM_ROLE_META) as SystemRole[]).map(
  (role) => ({ value: role, label: SYSTEM_ROLE_META[role].label })
);

export function getRoleMeta(role: string): RoleMeta | undefined {
  return Object.hasOwn(SYSTEM_ROLE_META, role)
    ? SYSTEM_ROLE_META[role as SystemRole]
    : undefined;
}

export function formatAdminDateTime(
  iso?: string | null,
  emptyFallback = "—"
): string {
  if (!iso) return emptyFallback;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return emptyFallback;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
