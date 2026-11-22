"use client";

import { Eye, KeyRound, Lock, MoreHorizontal, Unlock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import type { UserAccount } from "@/src/types/api/user";

interface UserCellActionProps {
  user: UserAccount;
  currentUserId: string | undefined;
  onViewDetail: (user: UserAccount) => void;
  onChangeStatus: (user: UserAccount) => void;
  onResetPassword: (user: UserAccount) => void;
}

export function UserCellAction({
  user,
  currentUserId,
  onViewDetail,
  onChangeStatus,
  onResetPassword,
}: UserCellActionProps) {
  const profileManaged = user.roles.includes("NCS") || user.roles.includes("GVHD");
  const selfLock = user.isActive && user.id === currentUserId;
  const StatusIcon = user.isActive ? Lock : Unlock;
  const statusLabel = user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Thao tác với ${user.username}`}
        className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-blue-50 hover:text-[#164E9B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]/30"
      >
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="min-w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
        <DropdownMenuItem onClick={() => onViewDetail(user)} className="text-xs">
          <Eye className="size-4 text-[#164E9B]" />
          Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onResetPassword(user)} className="text-xs">
          <KeyRound className="size-4 text-[#164E9B]" />
          Đặt lại mật khẩu
        </DropdownMenuItem>
        {!profileManaged && (
          <DropdownMenuItem
            disabled={selfLock}
            onClick={() => onChangeStatus(user)}
            className="text-xs"
          >
            <StatusIcon className="size-4 text-[#164E9B]" />
            {selfLock ? "Không thể tự khóa tài khoản" : statusLabel}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
