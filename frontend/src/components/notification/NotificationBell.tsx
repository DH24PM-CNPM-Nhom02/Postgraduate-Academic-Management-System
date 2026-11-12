"use client";

import React from "react";
import { Bell } from "lucide-react";

export interface NotificationBellProps {
  unreadCount?: number;
  isOpen?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  controlsId?: string;
  className?: string;
}

/**
 * NotificationBell
 *
 * Nút chuông thông báo trên Header với vùng chạm tối thiểu 40x40px,
 * hỗ trợ trạng thái mở/đóng và badge số thông báo chưa đọc.
 */
export function NotificationBell({
  unreadCount = 0,
  isOpen = false,
  onClick,
  ariaLabel = "Hộp thư thông báo học vụ",
  controlsId,
  className = "",
}: NotificationBellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      aria-controls={controlsId}
      title="Thông báo học vụ"
      className={`group relative inline-flex size-10 cursor-pointer items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] ${
        isOpen
          ? "bg-[#164E9B]/10 text-[#164E9B]"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      } ${className}`}
    >
      <Bell className="size-5 transition-transform group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white ring-2 ring-white shadow-xs">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
