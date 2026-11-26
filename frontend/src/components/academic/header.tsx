"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  LogOut,
  ChevronDown,
  Sparkles,
  UserRound,
  KeyRound,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { HoverLogo } from "./HoverLogo";
import { NotificationBellPopover } from "@/src/components/notification";

export interface AcademicHeaderProps {
  onToggleSidebar?: () => void;
  onOpenSearch?: () => void;
}

const ACADEMIC_PAGE_TITLES: Record<string, string> = {
  "/academic": "Tổng quan Giáo vụ",
  "/academic/cohorts": "Quản lý niên khóa",
  "/academic/training-majors": "Quản lý ngành đào tạo",
  "/academic/students": "Quản lý NCS",
  "/students": "Quản lý NCS",
  "/academic/theses": "Quản lý Đề tài Luận án",
  "/academic/supervisors": "Quản lý GVHD & Hạn ngạch",
  "/supervisors": "Quản lý GVHD & Hạn ngạch",
  "/academic/milestone-review": "Hàng chờ duyệt 9 mốc",
  "/review-queue": "Hàng chờ duyệt 9 mốc",
  "/academic/decisions": "Quản lý Quyết định",
  "/academic/evidence": "Minh chứng học vị & Báo cáo",
  "/academic/topic-changes": "Duyệt đề nghị điều chỉnh",
  "/academic/procedures": "Biểu mẫu học vụ",
  "/academic/forms": "Biểu mẫu học vụ",
  "/academic-affairs": "Thủ tục & Biểu mẫu học vụ",
  "/academic/calendar": "Lịch học vụ & Thông báo",
  "/academic/regulations": "Quy chế & Quy định",
  "/academic/faq": "Hỏi đáp & Liên hệ",
};

function getAcademicPageTitle(pathname: string | null): string {
  if (!pathname) return "Tổng quan Giáo vụ";
  if (ACADEMIC_PAGE_TITLES[pathname]) return ACADEMIC_PAGE_TITLES[pathname];
  for (const [route, title] of Object.entries(ACADEMIC_PAGE_TITLES)) {
    if (route !== "/academic" && pathname.startsWith(route)) {
      return title;
    }
  }
  return "Tổng quan Giáo vụ";
}

export function AcademicHeader({
  onToggleSidebar,
  onOpenSearch,
}: AcademicHeaderProps) {
  const pathname = usePathname();
  const pageTitle = getAcademicPageTitle(pathname);
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile Toggle & Brand/Breadcrumb Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Mở danh mục điều hướng"
        >
          <Menu className="size-5" />
        </button>

        {/* Mobile: Chỉ hiện Logo ở Header khi màn hình nhỏ (do Sidebar đã ẩn) */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform active:scale-98"
          >
            <HoverLogo sizeClass="size-8" />
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-tight text-[#0F2744] uppercase leading-none">
                AGU SĐH
              </span>
              <span className="text-[10px] font-semibold text-[#164E9B] mt-0.5">
                Cổng Giáo vụ
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop: Sidebar bên trái đã có Logo AGU, Header hiển thị Breadcrumb & Vị trí làm việc để tránh trùng lặp */}
        <nav aria-label="Điều hướng vị trí" className="hidden lg:flex items-center gap-2 text-xs">
          <Link
            href="/academic"
            className="flex items-center gap-1.5 font-semibold text-slate-500 hover:text-[#164E9B] transition-colors"
          >
            <ShieldCheck className="size-4 text-[#164E9B]" />
            <span>Cổng Giáo vụ</span>
          </Link>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-bold text-slate-800">
            {pageTitle}
          </span>
          <span className="ml-1 rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-[#164E9B] tracking-wide">
            GIÁO VỤ SĐH
          </span>
        </nav>
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

        {/* Quick Forms Link */}
        <Link
          href="/academic/procedures"
          className="hidden xl:inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-[#164E9B] hover:bg-blue-100 transition-colors shadow-2xs"
        >
          <Sparkles className="size-3.5" />
          <span>Tra cứu biểu mẫu</span>
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
              {user?.fullName?.trim().charAt(0).toUpperCase() || "G"}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-bold text-slate-900 line-clamp-1">
                {user?.fullName || user?.username || "Tài khoản"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Cán bộ quản lý giáo vụ
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
                    {user?.fullName || user?.username || "Tài khoản"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {user?.email || user?.username || ""}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#164E9B] font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                    <span>{user?.username || "GIAO_VU"}</span>
                    <span>•</span>
                    <span>Giáo vụ</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link href="/profile#account" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                    <UserRound className="size-4 text-slate-400" />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                  <Link href="/profile#security" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                    <KeyRound className="size-4 text-slate-400" />
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

export default AcademicHeader;
