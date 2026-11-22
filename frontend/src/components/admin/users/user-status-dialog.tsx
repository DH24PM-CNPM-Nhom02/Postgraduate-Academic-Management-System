"use client";

import { Lock, Unlock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { useSetUserStatus } from "@/src/hooks/api/use-users";
import type { UserAccount } from "@/src/types/api/user";
import { UserDialog, UserDialogError, userPrimaryButton } from "./user-dialog";

interface UserStatusConfirmDialogProps {
  user: UserAccount;
  onClose: () => void;
}

export function UserStatusConfirmDialog({ user, onClose }: UserStatusConfirmDialogProps) {
  const statusChange = useSetUserStatus();
  const isLockAction = user.isActive;
  const Icon = isLockAction ? Lock : Unlock;
  const title = isLockAction ? "Khóa tài khoản" : "Mở khóa tài khoản";

  function confirmStatusChange() {
    if (statusChange.isPending) return;

    statusChange.mutate({ id: user.id, isActive: !user.isActive }, {
      onSuccess: () => {
        toast.success(`${isLockAction ? "Đã khóa" : "Đã mở khóa"} tài khoản ${user.username}.`);
        onClose();
      },
    });
  }

  return (
    <UserDialog
      title={title}
      description={`${user.fullName} (@${user.username})`}
      onClose={onClose}
      pending={statusChange.isPending}
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          {isLockAction
            ? "Tài khoản sẽ bị chặn đăng nhập và các phiên làm mới hiện tại sẽ bị thu hồi."
            : "Người dùng sẽ có thể đăng nhập lại sau khi mở khóa."}
        </p>
        {statusChange.error && <UserDialogError message={statusChange.error.message} />}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" disabled={statusChange.isPending} onClick={onClose}>Hủy</Button>
          <Button
            type="button"
            onClick={confirmStatusChange}
            disabled={statusChange.isPending}
            variant={isLockAction ? "destructive" : "default"}
            className={isLockAction ? undefined : userPrimaryButton}
          >
            <Icon aria-hidden="true" /> {statusChange.isPending ? "Đang xử lý…" : title}
          </Button>
        </div>
      </div>
    </UserDialog>
  );
}
