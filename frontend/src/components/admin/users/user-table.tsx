"use client";

import { useMemo } from "react";
import { AlertCircle, LoaderCircle, Users } from "lucide-react";
import type { ColumnDef, ColumnFiltersState, FilterFn, Updater } from "@tanstack/react-table";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";
import type { UserAccount } from "@/src/types/api/user";
import { UserCellAction } from "./user-cell-action";
import type { UserRoleFilter, UserStatusFilter } from "./user-filters";
import { formatAdminDateTime, getRoleMeta, USER_STATUS_META } from "./user-meta";

interface UserTableProps {
  users: UserAccount[];
  currentUserId: string | undefined;
  search: string;
  role: UserRoleFilter;
  status: UserStatusFilter;
  onSearchChange: (updater: Updater<string>) => void;
  onViewDetail: (user: UserAccount) => void;
  onChangeStatus: (user: UserAccount) => void;
  onResetPassword: (user: UserAccount) => void;
  isLoading: boolean;
  errorMessage?: string;
}

const searchUsers: FilterFn<UserAccount> = ({ original }, _columnId, value: string) =>
  [original.username, original.fullName, original.email].some(
    (field) => field?.toLocaleLowerCase("vi").includes(value.trim().toLocaleLowerCase("vi"))
  );

const headerStyles = { actions: "py-3 px-3 text-right" };
const cellStyles = { actions: "py-3.5 px-3 text-right" };

export function UserTable({
  users,
  currentUserId,
  search,
  role,
  status,
  onSearchChange,
  onViewDetail,
  onChangeStatus,
  onResetPassword,
  isLoading,
  errorMessage,
}: UserTableProps) {
  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    if (role !== "ALL") filters.push({ id: "roles", value: role });
    if (status !== "ALL") filters.push({ id: "isActive", value: status === "ACTIVE" });
    return filters;
  }, [role, status]);

  const columns = useMemo<ColumnDef<UserAccount>[]>(() => [
    {
      accessorKey: "fullName",
      header: "Họ tên & tên đăng nhập",
      cell: ({ row: { original } }) => (
        <div>
          <p className="font-bold text-slate-900">{original.fullName}</p>
          <p className="mt-0.5 font-mono text-[11px] text-slate-500">{original.username}</p>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email || "—",
      enableGlobalFilter: false,
    },
    {
      accessorKey: "roles",
      header: "Vai trò",
      filterFn: "arrIncludes",
      enableGlobalFilter: false,
      cell: ({ row }) => <UserRoleBadges roles={row.original.roles} />,
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      filterFn: "equals",
      enableGlobalFilter: false,
      cell: ({ row }) => <UserStatusBadge isActive={row.original.isActive} />,
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      enableGlobalFilter: false,
      cell: ({ row }) => <span className="whitespace-nowrap tabular-nums">{formatAdminDateTime(row.original.createdAt)}</span>,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <UserCellAction
          user={row.original}
          currentUserId={currentUserId}
          onViewDetail={onViewDetail}
          onChangeStatus={onChangeStatus}
          onResetPassword={onResetPassword}
        />
      ),
    },
  ], [currentUserId, onViewDetail, onChangeStatus, onResetPassword]);

  const table = useManagementDataTable({
    data: users,
    columns,
    globalFilter: search,
    onGlobalFilterChange: onSearchChange,
    columnFilters,
    globalFilterFn: searchUsers,
  });

  if (errorMessage) {
    return (
      <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
        <p>Không thể tải danh sách tài khoản. {errorMessage}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div role="status" className="flex min-h-40 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm text-slate-500">
        <LoaderCircle className="size-4 animate-spin text-[#164E9B]" aria-hidden="true" />
        Đang tải danh sách tài khoản…
      </div>
    );
  }

  return (
    <ManagementDataTable
      table={table}
      headerStyles={headerStyles}
      cellStyles={cellStyles}
      minWidth="min-w-[770px]"
      itemLabel="tài khoản"
      emptyState={(
        <div className="flex flex-col items-center gap-2 text-sm text-slate-500">
          <Users className="size-7 text-slate-400" aria-hidden="true" />
          {users.length === 0 ? "Chưa có tài khoản nào." : "Không tìm thấy tài khoản phù hợp."}
        </div>
      )}
    />
  );
}

export function UserRoleBadges({ roles }: { roles: string[] }) {
  return roles.length ? (
    <div className="flex flex-wrap gap-1">
      {roles.map((role) => {
        const meta = getRoleMeta(role);
        return (
          <span
            key={role}
            className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${meta?.badgeClass ?? "border-slate-200 bg-slate-50 text-slate-700"}`}
          >
            {meta?.label ?? role}
          </span>
        );
      })}
    </div>
  ) : <span className="text-slate-500">Chưa có vai trò</span>;
}

export function UserStatusBadge({ isActive }: { isActive: boolean }) {
  const meta = USER_STATUS_META[isActive ? "ACTIVE" : "LOCKED"];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap font-semibold ${meta.textClass}`}>
      <span className={`size-1.5 rounded-full ${meta.dotClass}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
