"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import type { InitialUserCredential } from "@/src/types/api/user";
import { userPrimaryButton } from "./user-dialog";

export function UserCredentials({ credentials }: { credentials: InitialUserCredential[] }) {
  async function copyPassword({ username, initialPassword }: InitialUserCredential) {
    try {
      await navigator.clipboard.writeText(initialPassword);
      toast.success(`Đã sao chép mật khẩu của ${username}.`);
    } catch {
      toast.error("Không thể sao chép tự động. Hãy chọn mật khẩu để sao chép thủ công.");
    }
  }

  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-[#164E9B]">
        Hãy lưu lại mật khẩu trước khi đóng. Hệ thống chỉ hiển thị mật khẩu này một lần.
      </p>
      <ul className="space-y-2">
        {credentials.map((credential) => (
          <li key={credential.username} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2">
            <div className="min-w-0 space-y-0.5">
              <p className="break-all text-xs font-semibold text-slate-500">{credential.username}</p>
              <code className="block select-all break-all text-sm font-bold text-slate-900">
                {credential.initialPassword}
              </code>
            </div>
            <Button
              type="button"
              variant="outline"
              aria-label={`Sao chép mật khẩu của ${credential.username}`}
              onClick={() => void copyPassword(credential)}
            >
              <Copy aria-hidden="true" /> Sao chép
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <Dialog.Close render={<Button type="button" className={userPrimaryButton} />}>
          Hoàn tất
        </Dialog.Close>
      </div>
    </div>
  );
}
