"use client";

import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { useResetUserPassword } from "@/src/hooks/api/use-users";
import type { UserAccount } from "@/src/types/api/user";
import { UserCredentials } from "./user-credentials";
import { UserDialog, UserDialogError, userPrimaryButton } from "./user-dialog";

interface ResetPasswordDialogProps {
  user: UserAccount;
  onClose: () => void;
}

export function ResetPasswordDialog({ user, onClose }: ResetPasswordDialogProps) {
  const resetPassword = useResetUserPassword();
  const { isPending, data: credential, error } = resetPassword;

  function confirmReset() {
    if (isPending) return;

    resetPassword.mutate(user.id, {
      onSuccess: () => toast.success(`Đã đặt lại mật khẩu cho ${user.username}.`),
    });
  }

  return (
    <UserDialog
      title={credential ? "Mật khẩu tạm thời" : "Đặt lại mật khẩu"}
      description={`${user.fullName} (@${user.username})`}
      onClose={onClose}
      pending={isPending}
      preserveResult={Boolean(credential)}
    >
      {credential ? (
        <UserCredentials credentials={[credential]} />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Hệ thống sẽ thay mật khẩu hiện tại, thu hồi các phiên làm mới và yêu cầu người dùng đổi mật khẩu ở lần đăng nhập tiếp theo.
          </p>
          {error && <UserDialogError message={error.message} />}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>Hủy</Button>
            <Button type="button" onClick={confirmReset} disabled={isPending} className={userPrimaryButton}>
              <KeyRound aria-hidden="true" /> {isPending ? "Đang đặt lại…" : "Xác nhận đặt lại"}
            </Button>
          </div>
        </div>
      )}
    </UserDialog>
  );
}
