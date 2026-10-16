"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  LogOut,
  User,
  Shield,
  ChevronDown,
  GraduationCap,
  Sparkles,
  FileCheck2,
  Check,
  Clock,
  FileEdit,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";

import { HoverLogo } from "./HoverLogo";

export interface SupervisorHeaderProps {
  onToggleSidebar?: () => void;
  onOpenSearch?: () => void;
  unreadNotificationsCount?: number;
  onSelectNotification?: (item: any) => void;
}

const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "NCS nộp minh chứng mới",
    message: "NCS Nguyễn Văn An (NCS230104) vừa nộp minh chứng 'Báo cáo chuyên đề 1'.",
    time: "15 phút trước",
    unread: true,
    type: "evidence",
  },
  {
    id: "notif-2",
    title: "Đề nghị điều chỉnh đề tài",
    message: "NCS Trần Thị Mai gửi đề xuất điều chỉnh tên đề tài luận án tiến sĩ.",
    time: "2 giờ trước",
    unread: true,
    type: "topic",
  },
  {
    id: "notif-3",
    title: "Nhắc nhở học vụ định kỳ",
    message: "Hạn chót tiếp nhận báo cáo tiến độ 6 tháng đợt 2: ngày 15/12/2026.",
    time: "Hôm qua",
    unread: true,
    type: "deadline",
  },
  {
    id: "notif-4",
    title: "Hạn ngạch hướng dẫn được cập nhật",
    message: "Hệ thống ghi nhận NCS Hoàng Minh Đạt bảo vệ thành công cấp ĐVCM.",
    time: "3 ngày trước",
    unread: false,
    type: "quota",
  },
];

export function SupervisorHeader({
  onToggleSidebar,
  onOpenSearch,
  unreadNotificationsCount = 3,
  onSelectNotification,
}: SupervisorHeaderProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotifClick = (notif: (typeof MOCK_NOTIFICATIONS)[0]) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    setNotifOpen(false);
    onSelectNotification?.(notif);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile Toggle & Brand Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Mở danh mục điều hướng"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <HoverLogo sizeClass="size-10" />

          <div className="flex flex-col">
            <span className="text-xs font-black tracking-tight text-[#0F2744] uppercase sm:text-sm">
              Trường Đại học An Giang - ĐHQG-HCM
            </span>
            <span className="text-[11px] font-semibold text-[#164E9B] flex items-center gap-1.5">
              <span>Cổng Quản lý Đào tạo Sau Đại học</span>
              <span className="size-1 rounded-full bg-[#164E9B]/40" />
              <span className="text-slate-500 font-normal">Ban GVHD & ĐVCM</span>
            </span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-xs text-slate-500 shadow-2xs hover:border-[#164E9B] hover:bg-white transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="size-4 text-slate-400 group-hover:text-[#164E9B] transition-colors" />
            <span className="text-slate-500 font-medium">
              Tìm nhanh NCS, GVHD, đề tài, văn bản...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-500 shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: Quick actions, Notifications & Staff Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Tìm kiếm"
        >
          <Search className="size-5" />
        </button>

        {/* Quick Procedure lookup button */}
        <Link
          href="/supervisor?tab=procedures"
          className="hidden xl:inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-[#164E9B] hover:bg-blue-100 transition-colors shadow-2xs"
        >
          <Sparkles className="size-3.5" />
          <span>Tra cứu thủ tục nhanh</span>
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setDropdownOpen(false);
            }}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Thông báo"
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setNotifOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-40 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Thông báo học vụ
                    </span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        {unreadCount} mới
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-[#164E9B] hover:underline"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>

                {/* Notifications list */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      className={`flex w-full items-start gap-3 p-3.5 text-left transition-colors hover:bg-slate-50 ${
                        n.unread ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full mt-0.5 ${
                          n.type === "evidence"
                            ? "bg-amber-100 text-amber-700"
                            : n.type === "topic"
                            ? "bg-blue-100 text-[#164E9B]"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {n.type === "evidence" && <FileCheck2 className="size-4" />}
                        {n.type === "topic" && <FileEdit className="size-4" />}
                        {n.type === "deadline" && <Clock className="size-4" />}
                        {n.type === "quota" && <Check className="size-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                          {n.message}
                        </p>
                      </div>

                      {n.unread && (
                        <span className="size-2 rounded-full bg-[#164E9B] shrink-0 mt-2" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center">
                  <Link
                    href="/supervisor?tab=calendar"
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-semibold text-[#164E9B] hover:underline"
                  >
                    Xem tất cả thông báo & lịch học vụ →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* Staff Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-100 transition-colors"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#164E9B] text-xs font-bold text-white shadow-2xs">
              TA
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-bold text-slate-900 line-clamp-1">
                TS. Bùi Lê Tuấn Anh
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Cán bộ Quản lý & GVHD
              </p>
            </div>
            <ChevronDown className="size-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-40 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <div className="border-b border-slate-100 px-3 py-2.5">
                  <p className="text-xs font-bold text-slate-900">
                    TS. Bùi Lê Tuấn Anh
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    bltanh@agu.edu.vn
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#164E9B] font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                    <span>Mã cán bộ: CB-2018-042</span>
                    <span>•</span>
                    <span>Khoa CNTT</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/supervisor?tab=supervisors"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <User className="size-4 text-slate-400" />
                    <span>Hạn ngạch cá nhân (2.5/3.0)</span>
                  </Link>

                  <Link
                    href="/supervisor?tab=regulations"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Shield className="size-4 text-slate-400" />
                    <span>Quy chế GVHD & Đào tạo TS</span>
                  </Link>

                  <a
                    href="mailto:sdh@agu.edu.vn?subject=Tro%20giup%20he%20thong%20GVHD"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <HelpCircle className="size-4 text-slate-400" />
                    <span>Hỗ trợ kỹ thuật phòng SĐH</span>
                  </a>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="size-4" />
                    <span>Đăng xuất hệ thống</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default SupervisorHeader;
