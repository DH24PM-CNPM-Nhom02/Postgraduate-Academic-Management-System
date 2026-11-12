"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, X } from "lucide-react";
import {
  useDetectedRole,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/src/hooks/use-notifications";
import type { NotificationItem } from "@/src/types/notification";
import { NotificationBell } from "./NotificationBell";
import { NotificationList } from "./NotificationList";

interface NotificationBellPopoverProps {
  /** Role hiện tại để lọc đúng thông báo của role đó */
  role?: "academic" | "supervisor" | "student";
}

type TabKey = "ALL" | "UNREAD" | "TIEN_DO" | "QUYET_DINH";

export function NotificationBellPopover({
  role,
}: NotificationBellPopoverProps) {
  const router = useRouter();
  const popoverId = useId();
  const detectedRole = useDetectedRole();
  const currentRole = role || detectedRole;

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");
  const [now] = useState(() => Date.now());
  const popoverRef = useRef<HTMLDivElement>(null);

  const { data: unreadData } = useUnreadNotificationCount(currentRole);
  const unreadCount = unreadData?.soLuong ?? 0;

  const filterParams = useMemo(() => {
    const base: {
      unread?: boolean;
      group?: string;
      limit: number;
      role: "academic" | "supervisor" | "student";
    } = {
      limit: 30,
      role: currentRole,
    };
    if (activeTab === "UNREAD") base.unread = true;
    if (activeTab === "TIEN_DO") base.group = "TIEN_DO";
    if (activeTab === "QUYET_DINH") base.group = "QUYET_DINH";
    return base;
  }, [activeTab, currentRole]);

  const {
    data: notificationData,
    isLoading,
    isError,
    error,
    refetch,
  } = useNotifications(filterParams);
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead(currentRole);

  const notifications = notificationData?.items ?? [];

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleItemClick = (item: NotificationItem) => {
    if (!item.daDoc) {
      markAsRead.mutate(item.id);
    }
    setIsOpen(false);

    if (item.targetUrl) {
      router.push(item.targetUrl);
      return;
    }

    if (currentRole === "student") {
      router.push("/student/progress");
    } else if (currentRole === "supervisor") {
      router.push("/supervisor/dashboard");
    } else if (item.nhom === "QUYET_DINH") {
      router.push("/academic?tab=students");
    } else if (
      item.loai === "CO_PHIEU_NHAN_XET_MOI" ||
      item.nhom === "TIEN_DO"
    ) {
      router.push("/academic?tab=evidences");
    } else {
      router.push("/academic");
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <NotificationBell
        unreadCount={unreadCount}
        isOpen={isOpen}
        controlsId={popoverId}
        onClick={() => setIsOpen((prev) => !prev)}
      />

      {isOpen && (
        <div
          id={popoverId}
          role="dialog"
          aria-label="Hộp thư thông báo học vụ"
          className="absolute right-0 top-full z-50 mt-2.5 flex w-[92vw] max-w-[480px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:w-[440px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#164E9B] text-white shadow-2xs">
                <Bell className="size-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#0F2744]">
                  {currentRole === "student"
                    ? "Thông báo Nghiên cứu sinh"
                    : currentRole === "supervisor"
                      ? "Thông báo Giảng viên Hướng dẫn"
                      : "Thông báo Quản lý Giáo vụ"}
                </h3>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {currentRole === "student"
                    ? "Học vụ cá nhân • AGU SĐH"
                    : currentRole === "supervisor"
                      ? "Tiến độ hướng dẫn NCS • AGU SĐH"
                      : "Hệ thống Đào tạo Sau Đại học AGU"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead.mutate()}
                  disabled={markAllAsRead.isPending}
                  className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-[11px] font-bold text-[#164E9B] transition-colors hover:bg-[#164E9B]/10 disabled:opacity-50"
                  title="Đánh dấu tất cả là đã đọc"
                >
                  <CheckCheck className="size-3.5" />
                  <span className="hidden sm:inline">Đã đọc tất cả</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
                aria-label="Đóng hộp thư thông báo"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Tab Filter Navigation */}
          <div
            role="tablist"
            aria-label="Lọc thông báo"
            className="flex items-center gap-1 border-b border-border bg-muted/25 px-2 py-1.5 text-[11px] font-bold"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "ALL"}
              onClick={() => setActiveTab("ALL")}
              className={`min-h-8 cursor-pointer rounded-lg px-2.5 py-1 transition-colors ${
                activeTab === "ALL"
                  ? "bg-card text-[#164E9B] shadow-2xs"
                  : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "UNREAD"}
              onClick={() => setActiveTab("UNREAD")}
              className={`flex min-h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 transition-colors ${
                activeTab === "UNREAD"
                  ? "bg-card text-[#164E9B] shadow-2xs"
                  : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
              }`}
            >
              <span>Chưa đọc</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-extrabold leading-none text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "TIEN_DO"}
              onClick={() => setActiveTab("TIEN_DO")}
              className={`min-h-8 cursor-pointer rounded-lg px-2.5 py-1 transition-colors ${
                activeTab === "TIEN_DO"
                  ? "bg-card text-[#164E9B] shadow-2xs"
                  : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
              }`}
            >
              Tiến độ mốc
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "QUYET_DINH"}
              onClick={() => setActiveTab("QUYET_DINH")}
              className={`min-h-8 cursor-pointer rounded-lg px-2.5 py-1 transition-colors ${
                activeTab === "QUYET_DINH"
                  ? "bg-card text-[#164E9B] shadow-2xs"
                  : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
              }`}
            >
              Quyết định
            </button>
          </div>

          {/* Notification List Container */}
          <div className="max-h-[380px] overflow-y-auto">
            <NotificationList
              items={notifications}
              isLoading={isLoading}
              isError={isError}
              errorMessage={
                error instanceof Error
                  ? error.message
                  : "Không thể tải thông báo. Vui lòng thử lại."
              }
              onRetry={() => {
                void refetch();
              }}
              onItemClick={handleItemClick}
              nowMs={now}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border bg-muted/35 px-4 py-2 text-[11px] font-semibold text-muted-foreground">
            <span>Cập nhật thời gian thực</span>
            <span className="text-[10px]">ĐHQG-HCM AGU SĐH</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBellPopover;
