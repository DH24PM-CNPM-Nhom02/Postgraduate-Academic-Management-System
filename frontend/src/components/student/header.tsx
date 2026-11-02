"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  LogOut,
  User,
  Shield,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { HoverLogo } from "./HoverLogo";
import { NotificationBellPopover } from "@/src/components/notification";

interface StudentHeaderProps {
  onToggleSidebar?: () => void;
}

export function StudentHeader({ onToggleSidebar }: StudentHeaderProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile Toggle & Brand Identity đồng bộ toàn hệ thống */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Mở danh mục điều hướng"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex items-center gap-3">
          <Link
            href="/student/progress"
            className="flex items-center gap-2.5 transition-transform hover:scale-102"
          >
            <HoverLogo sizeClass="size-8.5" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black tracking-tight text-[#0F2744] uppercase leading-none">
                TRƯỜNG ĐẠI HỌC AN GIANG – ĐHQG-HCM
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#164E9B] mt-0.5">
                Cổng Quản lý Đào tạo Sau Đại học • Nghiên cứu sinh
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Academic guides link */}
        <a
          href="#"
          className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#164E9B] hover:bg-white hover:text-[#164E9B] transition-all shadow-2xs"
        >
          <BookOpen className="size-3.5 text-[#164E9B]" />
          <span>Sổ tay Nghiên cứu sinh</span>
        </a>

        {/* Notifications Popover */}
        <NotificationBellPopover role="student" />

        <div className="h-6 w-px bg-slate-200"></div>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-100 transition-colors"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#164E9B] text-xs font-bold text-white shadow-2xs">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "N"}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-bold text-slate-900 line-clamp-1">
                {user?.fullName || "Nguyễn Văn A"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {user?.username ? `Mã NCS: ${user.username}` : "NCS Khóa 32"}
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
              <div className="absolute right-0 top-full mt-2 z-40 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <div className="border-b border-slate-100 px-3 py-2.5">
                  <p className="text-xs font-bold text-slate-900">
                    {user?.fullName || "Nguyễn Văn A"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {user?.email || (user?.username ? `${user.username}@agu.edu.vn` : "a.nguyen@agu.edu.vn")}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/student/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <User className="size-4 text-slate-400" />
                    <span>Hồ sơ nghiên cứu sinh</span>
                  </Link>
                  <Link
                    href="/student/profile?tab=security"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Shield className="size-4 text-slate-400" />
                    <span>Đổi mật khẩu &amp; Bảo mật</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
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

export default StudentHeader;
