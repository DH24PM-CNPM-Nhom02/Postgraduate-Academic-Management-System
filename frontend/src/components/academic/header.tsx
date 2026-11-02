"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { HoverLogo } from "./HoverLogo";
import { NotificationBellPopover } from "@/src/components/notification";
import type { NotificationItem } from "@/src/types/notification";

export interface AcademicHeaderProps {
  onToggleSidebar?: () => void;
  onOpenSearch?: () => void;
  onSelectNotification?: (item: NotificationItem) => void;
}

export function AcademicHeader({
  onToggleSidebar,
  onOpenSearch,
}: AcademicHeaderProps) {
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

        <div className="flex items-center gap-3">
          <Link
            href="/academic"
            className="flex items-center gap-2.5 transition-transform hover:scale-102"
          >
            <HoverLogo sizeClass="size-8.5" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black tracking-tight text-[#0F2744] uppercase leading-none">
                TRƯỜNG ĐẠI HỌC AN GIANG – ĐHQG-HCM
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#164E9B] mt-0.5">
                Cổng Quản lý Đào tạo Sau Đại học • Cán bộ Quản lý Giáo vụ
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Right: Quick Search, Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Fast Search Trigger (Ctrl+K) */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-500 hover:border-[#164E9B] hover:bg-white hover:text-slate-900 transition-all shadow-2xs group"
          title="Phím tắt Ctrl+K để tra cứu toàn hệ thống"
        >
          <Search className="size-3.5 text-slate-400 group-hover:text-[#164E9B] transition-colors" />
          <span>Tìm nhanh NCS, GVHD, đề tài, văn bản...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
            Ctrl K
          </kbd>
        </button>

        {/* Mobile search button */}
        <button
          onClick={onOpenSearch}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-label="Tìm kiếm"
        >
          <Search className="size-5" />
        </button>

        {/* Quick Procedure Link */}
        <Link
          href="/academic?tab=procedures"
          className="hidden xl:inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-[#164E9B] hover:bg-blue-100 transition-colors shadow-2xs"
        >
          <Sparkles className="size-3.5" />
          <span>Tra cứu thủ tục nhanh</span>
        </Link>

        {/* Notifications Popover */}
        <NotificationBellPopover role="academic" />

        <div className="h-6 w-px bg-slate-200"></div>

        {/* Staff Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
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
                Cán bộ Quản lý Giáo vụ
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
                    tuananh.bl@agu.edu.vn
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#164E9B] font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                    <span>Mã CB: CB-GV-2026</span>
                    <span>•</span>
                    <span>Khoa CNTT &amp; Phòng Đào tạo SĐH</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/academic?tab=supervisors"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <User className="size-4 text-slate-400" />
                    <span>Quản lý hạn ngạch GVHD</span>
                  </Link>

                  <Link
                    href="/academic?tab=regulations"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Shield className="size-4 text-slate-400" />
                    <span>Quy chế SĐH &amp; Hướng dẫn BR-09</span>
                  </Link>

                  <a
                    href="mailto:sdh@agu.edu.vn?subject=Tro%20giup%20he%20thong%20Giao%20vu"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <HelpCircle className="size-4 text-slate-400" />
                    <span>Hỗ trợ kỹ thuật phần mềm</span>
                  </a>
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

export default AcademicHeader;
