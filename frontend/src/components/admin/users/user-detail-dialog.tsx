"use client";

import type { ReactNode } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useUserDetail } from "@/src/hooks/api/use-users";
import type { UserAccount } from "@/src/types/api/user";
import { UserDialog, UserDialogError } from "./user-dialog";
import { formatAdminDateTime } from "./user-meta";
import { UserRoleBadges, UserStatusBadge } from "./user-table";

interface UserDetailDialogProps {
  user: UserAccount;
  onClose: () => void;
}

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1 rounded-lg border border-slate-200 px-3 py-2">
      <dt className="text-xs font-semibold text-slate-500">{label}</dt>
      <dd className="break-words text-sm text-slate-900">{children}</dd>
    </div>
  );
}

export function UserDetailDialog({ user, onClose }: UserDetailDialogProps) {
  const detail = useUserDetail(user.id);
  const account = detail.data;

  return (
    <UserDialog title="Chi tiết tài khoản" description={`@${user.username}`} onClose={onClose}>
      {detail.isError ? (
        <div className="space-y-3">
          <UserDialogError message={detail.error.message} />
          <Button type="button" variant="outline" onClick={() => void detail.refetch()} disabled={detail.isFetching}>
            <RefreshCw aria-hidden="true" /> Thử lại
          </Button>
        </div>
      ) : account ? (
        <dl className="grid gap-2 sm:grid-cols-2">
          <DetailField label="Họ và tên">{account.fullName}</DetailField>
          <DetailField label="Email">{account.email || "—"}</DetailField>
          <DetailField label="Vai trò"><UserRoleBadges roles={account.roles} /></DetailField>
          <DetailField label="Trạng thái"><UserStatusBadge isActive={account.isActive} /></DetailField>
          <DetailField label="Ngày tạo">{formatAdminDateTime(account.createdAt)}</DetailField>
          <DetailField label="Yêu cầu đổi mật khẩu">{account.mustChangePassword ? "Có" : "Không"}</DetailField>
        </dl>
      ) : (
        <p role="status" className="flex items-center gap-2 text-sm text-slate-500">
          <LoaderCircle className="size-4 animate-spin text-[#164E9B]" aria-hidden="true" />
          Đang tải chi tiết tài khoản…
        </p>
      )}
    </UserDialog>
  );
}
