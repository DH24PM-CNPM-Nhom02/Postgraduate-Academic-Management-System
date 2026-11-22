"use client";

import { useState } from "react";
import { RefreshCw, UserPlus, Users } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useUsers } from "@/src/hooks/api/use-users";
import { useAuth } from "@/src/hooks/use-auth";
import type { UserAccount } from "@/src/types/api/user";
import { CreateUserModal } from "./create-user-modal";
import { ResetPasswordDialog } from "./reset-password-dialog";
import { UserDetailDialog } from "./user-detail-dialog";
import { userPrimaryButton } from "./user-dialog";
import { UserFilters, type UserRoleFilter, type UserStatusFilter } from "./user-filters";
import { UserStatsOverview } from "./user-stats";
import { UserStatusConfirmDialog } from "./user-status-dialog";
import { UserTable } from "./user-table";

const EMPTY_USERS: UserAccount[] = [];

export function UsersWorkspace() {
  const { user: authUser } = useAuth();
  const usersQuery = useUsers();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRoleFilter>("ALL");
  const [status, setStatus] = useState<UserStatusFilter>("ALL");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<UserAccount | null>(null);
  const [statusUser, setStatusUser] = useState<UserAccount | null>(null);
  const [resetUser, setResetUser] = useState<UserAccount | null>(null);

  function applyQuickFilter(nextRole: UserRoleFilter, nextStatus: UserStatusFilter) {
    setSearch("");
    setRole(nextRole);
    setStatus(nextStatus);
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-[#0F2744] sm:text-2xl">
            Quản lý người dùng
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Cấp tài khoản theo vai trò, quản lý quyền truy cập và đặt lại mật khẩu.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          className={`self-start rounded-xl px-3.5 font-bold shadow-xs sm:self-auto ${userPrimaryButton}`}
          onClick={() => setCreateOpen(true)}
        >
          <UserPlus aria-hidden="true" /> Tạo tài khoản mới
        </Button>
      </header>

      <UserStatsOverview
        users={usersQuery.isError ? undefined : usersQuery.data}
        role={role}
        status={status}
        onQuickFilter={applyQuickFilter}
      />

      <section className="min-w-0 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-[#0F2744] sm:text-base">
            <Users className="size-4 text-[#164E9B]" aria-hidden="true" /> Danh sách tài khoản
          </h2>
          <Button
            type="button"
            variant="outline"
            disabled={usersQuery.isFetching}
            onClick={() => void usersQuery.refetch()}
            className="text-[#164E9B]"
          >
            <RefreshCw aria-hidden="true" className={usersQuery.isFetching ? "animate-spin" : undefined} />
            {usersQuery.isError ? "Thử lại" : "Làm mới"}
          </Button>
        </div>

        <UserFilters
          search={search}
          role={role}
          status={status}
          onSearchChange={setSearch}
          onRoleChange={setRole}
          onStatusChange={setStatus}
          onReset={() => applyQuickFilter("ALL", "ALL")}
        />

        <UserTable
          users={usersQuery.data ?? EMPTY_USERS}
          currentUserId={authUser?.id}
          search={search}
          role={role}
          status={status}
          onSearchChange={setSearch}
          onViewDetail={setDetailUser}
          onChangeStatus={setStatusUser}
          onResetPassword={setResetUser}
          isLoading={usersQuery.isPending}
          errorMessage={usersQuery.error?.message}
        />
      </section>

      {createOpen && <CreateUserModal onClose={() => setCreateOpen(false)} />}
      {detailUser && <UserDetailDialog key={detailUser.id} user={detailUser} onClose={() => setDetailUser(null)} />}
      {statusUser && <UserStatusConfirmDialog key={statusUser.id} user={statusUser} onClose={() => setStatusUser(null)} />}
      {resetUser && <ResetPasswordDialog key={resetUser.id} user={resetUser} onClose={() => setResetUser(null)} />}
    </div>
  );
}

export default UsersWorkspace;
