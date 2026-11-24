"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { UserCredentials } from "@/src/components/admin/users/user-credentials";
import { UserDialog, UserDialogError, userPrimaryButton } from "@/src/components/admin/users/user-dialog";
import { Button } from "@/src/components/ui/button";
import { useApprovePasswordRequest, useRejectPasswordRequest } from "@/src/hooks/api/use-password-requests";
import { parseApiError } from "@/src/lib/api";
import type { PasswordRequest } from "@/src/types/api/password-request";

interface PasswordRequestDialogProps {
  request: PasswordRequest;
  onClose: () => void;
}

export function ApprovePasswordRequestDialog({ request, onClose }: PasswordRequestDialogProps) {
  const approve = useApprovePasswordRequest();
  const { data: credential, error, isPending } = approve;
  const { fullName, username } = request.user;

  return (
    <UserDialog
      title={credential ? "Mật khẩu tạm thời" : "Duyệt yêu cầu cấp lại mật khẩu"}
      description={credential ? "Hãy báo trực tiếp mật khẩu tạm cho người dùng." : `${fullName} (@${username})`}
      pending={isPending}
      preserveResult={Boolean(credential)}
      onClose={onClose}
    >
      {credential ? (
        <UserCredentials credentials={[credential]} />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Hãy xác minh danh tính người dùng (gặp trực tiếp, gọi điện hoặc Zalo) trước khi duyệt.
          </p>
          {error && <UserDialogError message={error.message} />}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>Hủy</Button>
            <Button
              type="button"
              className={userPrimaryButton}
              disabled={isPending}
              onClick={() => {
                if (!isPending) approve.mutate(request.id);
              }}
            >
              {isPending ? "Đang duyệt…" : "Xác nhận duyệt"}
            </Button>
          </div>
        </div>
      )}
    </UserDialog>
  );
}

const REASON_MAX_LENGTH = 255;

export function RejectPasswordRequestDialog({ request, onClose }: PasswordRequestDialogProps) {
  const [reason, setReason] = useState("");
  const reject = useRejectPasswordRequest();
  const { error, isPending } = reject;
  const { fullName, username } = request.user;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    reject.mutate({ id: request.id, lyDoTuChoi: reason.trim() || undefined }, {
      onSuccess: () => {
        toast.success("Đã từ chối yêu cầu cấp lại mật khẩu.");
        onClose();
      },
    });
  }

  return (
    <UserDialog
      title="Từ chối yêu cầu cấp lại mật khẩu"
      description={`${fullName} (@${username})`}
      pending={isPending}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="reject-password-request-reason" className="block text-sm font-semibold text-slate-700">
            Lý do từ chối (không bắt buộc)
          </label>
          <textarea
            id="reject-password-request-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            maxLength={REASON_MAX_LENGTH}
            rows={3}
            disabled={isPending}
            className="w-full resize-y rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-60"
          />
        </div>
        {error && <UserDialogError message={parseApiError(error).message} />}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="destructive" disabled={isPending}>
            {isPending ? "Đang từ chối…" : "Xác nhận từ chối"}
          </Button>
        </div>
      </form>
    </UserDialog>
  );
}
