"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  LogOut,
  Shield,
  ChevronDown,
  Sparkles,
  History,
  LayoutDashboard,
  Users,
  FileCheck2,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { HoverLogo } from "@/src/components/academic/HoverLogo";
import { NotificationBellPopover } from "@/src/components/notification";

export interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  onOpenSearch?: () => void;
}

export function AdminHeader({
  onToggleSidebar,
  onOpenSearch,
}: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile Toggle & Brand Identity */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Mở danh mục điều hướng"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-transform hover:scale-102"
          >
            <HoverLogo sizeClass="size-8.5" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black tracking-tight text-[#0F2744] uppercase leading-none">
                TRƯỜNG ĐẠI HỌC AN GIANG – ĐHQG-HCM
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#164E9B]">
                  Cổng Quản lý Đào tạo Sau Đại học • Phân hệ Quản trị Hệ thống
                </span>
                <span className="hidden sm:inline-flex rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 tracking-wide">
                  ADMIN
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Right: Quick Search, Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Fast Search Trigger (Ctrl+K) */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-500 hover:border-[#164E9B] hover:bg-white hover:text-slate-900 transition-all shadow-2xs group"
          title="Phím tắt Ctrl+K để tra cứu toàn hệ thống"
        >
          <Search className="size-3.5 text-slate-400 group-hover:text-[#164E9B] transition-colors" />
          <span>Tìm nhanh NCS, GVHD, tài khoản, nhật ký...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
            Ctrl K
          </kbd>
        </button>

        {/* Mobile search button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-label="Tìm kiếm"
        >
          <Search className="size-5" />
        </button>

        {/* Quick Procedure Link */}
        <Link
          href="/admin/procedures"
          className="hidden xl:inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-[#164E9B] hover:bg-blue-100 transition-colors shadow-2xs"
        >
          <Sparkles className="size-3.5 text-[#164E9B]" />
          <span>Thủ tục SĐH</span>
        </Link>

        {/* Notifications Popover */}
        <NotificationBellPopover role="academic" />

        <div className="h-6 w-px bg-slate-200" aria-hidden="true" />

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-100 transition-colors"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#164E9B] text-xs font-black text-white shadow-xs">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "AD"}
            </div>
            <div className="hidden text-left md:block">
              <p className="max-w-[140px] truncate text-xs font-bold text-slate-900">
                {user?.fullName || "Quản trị viên"}
              </p>
              <p className="text-[10px] font-medium text-slate-500">
                {user?.username ? `@${user.username}` : "Admin"} • <span className="font-bold text-[#164E9B]">ADMIN</span>
              </p>
            </div>
            <ChevronDown
              className={`size-3.5 text-slate-400 transition-transform duration-150 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setDropdownOpen(false)}
                aria-hidden="true"
              />
              <div
                role="menu"
                aria-label="Tài khoản quản trị"
                className="absolute right-0 top-full mt-2 z-40 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="border-b border-slate-100 px-3 py-2.5">
                  <p className="text-xs font-bold text-slate-900">
                    {user?.fullName || "Quản trị viên Hệ thống"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {user?.email ||
                      (user?.username
                        ? `${user.username}@agu.edu.vn`
                        : "admin@agu.edu.vn")}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#164E9B] font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                    <span>Quyền: ADMIN</span>
                    <span>•</span>
                    <span>Quản trị toàn hệ thống</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/admin"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Users className="size-4 text-slate-400" />
                    <span>Quản lý tài khoản người dùng</span>
                  </Link>

                  <Link
                    href="/admin/audit-log"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <History className="size-4 text-slate-400" />
                    <span>Nhật ký kiểm toán hệ thống</span>
                  </Link>

                  <Link
                    href="/admin/overview"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <LayoutDashboard className="size-4 text-slate-400" />
                    <span>Bàn làm việc Đào tạo SĐH</span>
                  </Link>

                  <Link
                    href="/admin/milestone-review"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <FileCheck2 className="size-4 text-slate-400" />
                    <span>Hàng chờ duyệt 9 mốc</span>
                  </Link>

                  <Link
                    href="/admin/regulations"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Shield className="size-4 text-slate-400" />
                    <span>Quy chế SĐH &amp; Hướng dẫn BR-09</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="size-4" />
                    <span>Đăng xuất tài khoản</span>
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

export default AdminHeader;
