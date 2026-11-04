"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  UserCheck,
  Award,
  Clock,
  Sparkles,
  Inbox,
  X,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDetectedRole,
} from "@/src/hooks/use-notifications";
import type { NotificationItem } from "@/src/types/notification";

interface NotificationBellPopoverProps {
  /** Role hiện tại để lọc đúng thông báo của role đó */
  role?: "academic" | "supervisor" | "student";
}

type TabKey = "ALL" | "UNREAD" | "TIEN_DO" | "QUYET_DINH";

function formatTimeAgo(dateStr: string, nowMs: number) {
  try {
    const diffMs = nowMs - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return new Date(dateStr).toLocaleDateString("vi-VN");
  } catch {
    return "Gần đây";
  }
}

export function NotificationBellPopover({ role }: NotificationBellPopoverProps) {
  const router = useRouter();
  const detectedRole = useDetectedRole();
  const currentRole = role || detectedRole;

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");
  const [now] = useState(() => Date.now());
  const popoverRef = useRef<HTMLDivElement>(null);

  // Queries theo đúng role
  const { data: unreadData } = useUnreadNotificationCount(currentRole);
  const unreadCount = unreadData?.soLuong ?? 0;

  // Filter query parameters dựa vào tab và role
  const filterParams = useMemo(() => {
    const base: { unread?: boolean; group?: string; limit: number; role: "academic" | "supervisor" | "student" } = {
      limit: 30,
      role: currentRole,
    };
    if (activeTab === "UNREAD") base.unread = true;
    if (activeTab === "TIEN_DO") base.group = "TIEN_DO";
    if (activeTab === "QUYET_DINH") base.group = "QUYET_DINH";
    return base;
  }, [activeTab, currentRole]);

  const { data: notificationData, isLoading } = useNotifications(filterParams);
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead(currentRole);

  const notifications = notificationData?.items ?? [];

  // Click outside to close popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Click notification handler
  const handleItemClick = (item: NotificationItem) => {
    if (!item.daDoc) {
      markAsRead.mutate(item.id);
    }
    setIsOpen(false);

    // Xác định đích đến thông minh
    if (item.targetUrl) {
      router.push(item.targetUrl);
      return;
    }

    // Fallback điều hướng theo role & nhóm
    if (role === "student") {
      router.push("/student/progress");
    } else if (role === "supervisor") {
      router.push("/supervisor/dashboard");
    } else {
      if (item.nhom === "QUYET_DINH") {
        router.push("/academic?tab=students");
      } else if (item.loai === "CO_PHIEU_NHAN_XET_MOI" || item.nhom === "TIEN_DO") {
        router.push("/academic?tab=evidences");
      } else {
        router.push("/academic");
      }
    }
  };

  // Icon & Style selector cho từng loại thông báo
  const renderItemVisual = (item: NotificationItem) => {
    const loai = item.loai;
    if (loai === "MOC_DUOC_DUYET" || loai === "GVHD_MOC_DUOC_DUYET") {
      return {
        icon: <CheckCircle2 className="size-4.5 text-emerald-600" />,
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Mốc đã duyệt",
      };
    }
    if (loai === "MOC_BI_TU_CHOI" || loai === "GVHD_MOC_BI_TU_CHOI") {
      return {
        icon: <AlertTriangle className="size-4.5 text-rose-600" />,
        badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
        label: "Cần nộp lại",
      };
    }
    if (loai === "CO_PHIEU_NHAN_XET_MOI") {
      return {
        icon: <FileCheck2 className="size-4.5 text-indigo-600" />,
        badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        label: "Phiếu nhận xét",
      };
    }
    if (loai === "NCS_DUOC_PHAN_CONG_GVHD" || loai === "GVHD_NHAN_NCS" || loai === "THAY_DOI_PHAN_CONG_GVHD") {
      return {
        icon: <UserCheck className="size-4.5 text-blue-600" />,
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
        label: "Phân công GVHD",
      };
    }
    if (loai === "QUYET_DINH_DOI_TRANG_THAI" || loai === "GVHD_QUYET_DINH_DOI_TRANG_THAI" || loai === "QUYET_DINH_BI_HUY") {
      return {
        icon: <Award className="size-4.5 text-amber-600" />,
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
        label: "Quyết định",
      };
    }
    if (loai === "NHAC_HAN_HOC_TAP" || loai === "CANH_BAO_HET_HAN_DAO_TAO") {
      return {
        icon: <Clock className="size-4.5 text-orange-600" />,
        badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
        label: "Nhắc hạn",
      };
    }
    if (loai === "CANH_BAO_TAI_KHOAN" || loai === "TAI_KHOAN_DOI_MAT_KHAU") {
      return {
        icon: <ShieldAlert className="size-4.5 text-purple-600" />,
        badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
        label: "Bảo mật",
      };
    }
    return {
      icon: <Sparkles className="size-4.5 text-[#164E9B]" />,
      badgeBg: "bg-blue-50 text-[#164E9B] border-blue-200",
      label: "Học vụ",
    };
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative rounded-xl p-2 transition-all cursor-pointer ${
          isOpen
            ? "bg-blue-50 text-[#164E9B]"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
        aria-label="Hộp thư thông báo học vụ"
        title="Thông báo học vụ"
      >
        <Bell className="size-5 transition-transform group-hover:scale-105" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white ring-2 ring-white shadow-xs animate-in zoom-in-75 duration-150">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 z-50 w-[92vw] sm:w-[440px] max-w-[480px] rounded-2xl border border-slate-200/90 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/40 px-4.5 py-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[#164E9B] text-white shadow-2xs">
                <Bell className="size-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0F2744]">
                  {currentRole === "student"
                    ? "Thông báo Nghiên cứu sinh"
                    : currentRole === "supervisor"
                    ? "Thông báo Giảng viên Hướng dẫn"
                    : "Thông báo Quản lý Giáo vụ"}
                </h3>
                <span className="text-[10px] text-slate-500 font-medium">
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
                  onClick={() => markAllAsRead.mutate()}
                  disabled={markAllAsRead.isPending}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-[#164E9B] hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                  title="Đánh dấu tất cả là đã đọc"
                >
                  <CheckCheck className="size-3.5" />
                  <span className="hidden sm:inline">Đã đọc tất cả</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                aria-label="Đóng"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Tab Filter Navigation */}
          <div className="flex items-center border-b border-slate-100 bg-slate-50/70 px-2 py-1 gap-1 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                activeTab === "ALL"
                  ? "bg-white text-[#164E9B] shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab("UNREAD")}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "UNREAD"
                  ? "bg-white text-[#164E9B] shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <span>Chưa đọc</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-500 px-1.5 py-0.2 text-[9px] font-extrabold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("TIEN_DO")}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                activeTab === "TIEN_DO"
                  ? "bg-white text-[#164E9B] shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              Tiến độ mốc
            </button>
            <button
              onClick={() => setActiveTab("QUYET_DINH")}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                activeTab === "QUYET_DINH"
                  ? "bg-white text-[#164E9B] shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              Quyết định
            </button>
          </div>

          {/* Notification List Container */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <div className="size-6 border-2 border-[#164E9B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span>Đang tải thông báo...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-2">
                  <Inbox className="size-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  Không có thông báo nào trong mục này
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Các cập nhật mốc đào tạo, quyết định và phân công sẽ hiển thị tại đây.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const visual = renderItemVisual(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`flex w-full items-start gap-3 p-3.5 text-left transition-colors hover:bg-slate-50 cursor-pointer ${
                      !item.daDoc ? "bg-blue-50/35" : "bg-white"
                    }`}
                  >
                    {/* Visual Icon */}
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 mt-0.5 shadow-2xs">
                      {visual.icon}
                    </div>

                    {/* Content Details */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${visual.badgeBg}`}
                          >
                            {visual.label}
                          </span>
                          {!item.daDoc && (
                            <span className="size-2 rounded-full bg-rose-500 shrink-0 ring-2 ring-white" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap font-medium">
                          {formatTimeAgo(item.createdAt, now)}
                        </span>
                      </div>

                      <h4
                        className={`text-xs leading-snug line-clamp-1 ${
                          !item.daDoc
                            ? "font-bold text-[#0F2744]"
                            : "font-semibold text-slate-700"
                        }`}
                      >
                        {item.tieuDe}
                      </h4>

                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {item.noiDung}
                      </p>
                    </div>

                    <ChevronRight className="size-4 shrink-0 text-slate-300 self-center" />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Link */}
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>Cập nhật thời gian thực</span>
            <span className="text-slate-400 text-[10px]">ĐHQG-HCM AGU SĐH</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBellPopover;
