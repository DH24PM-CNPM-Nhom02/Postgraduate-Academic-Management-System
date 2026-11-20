"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  LogOut,
  Menu,
  UserCheck,
  UserRound,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { NotificationBellPopover } from "@/src/components/notification";
import type { SupervisorProfile } from "@/src/types/ui/supervisor";
import { HoverLogo } from "./HoverLogo";

export interface SupervisorHeaderProps {
  onToggleSidebar?: () => void;
  profile?: SupervisorProfile;
}

const SUPERVISOR_PAGE_TITLES: Record<string, string> = {
  "/supervisor/dashboard": "Bàn làm việc GVHD",
  "/supervisor": "Bàn làm việc GVHD",
  "/supervisor/students": "Danh sách NCS hướng dẫn",
  "/supervisor/progress-reports": "Báo cáo tiến độ 6 tháng",
  "/supervisor/extensions": "Thẩm định gia hạn",
  "/supervisor/requests": "Đề xuất thay NCS",
  "/supervisor/quota": "Định mức hướng dẫn BR-09",
  "/supervisor/regulations": "Quy chế & Quy định",
  "/supervisor/faq": "Hỏi đáp & Hỗ trợ",
  "/supervisor/procedures": "Thủ tục & Biểu mẫu",
};

function getSupervisorPageTitle(pathname: string | null): string {
  if (!pathname) return "Bàn làm việc GVHD";
  if (SUPERVISOR_PAGE_TITLES[pathname]) return SUPERVISOR_PAGE_TITLES[pathname];
  for (const [route, title] of Object.entries(SUPERVISOR_PAGE_TITLES)) {
    if (route !== "/supervisor" && pathname.startsWith(route)) {
      return title;
    }
  }
  return "Bàn làm việc GVHD";
}

export function SupervisorHeader({
  onToggleSidebar,
  profile,
}: SupervisorHeaderProps) {
  const pathname = usePathname();
  const pageTitle = getSupervisorPageTitle(pathname);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const displayName = user?.fullName || profile?.hoTen || user?.username || "Tài khoản";
  const displayCode = user?.username || profile?.maCanBo;
  const initialChar = displayName.trim().slice(0, 1).toUpperCase() || "G";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Mở thanh điều hướng GVHD"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-[#0F2744] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] lg:hidden motion-reduce:transition-none"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        )}

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
                Cổng GVHD
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop: Sidebar bên trái đã có Logo AGU, Header hiển thị Breadcrumb & Vị trí làm việc để tránh trùng lặp */}
        <nav aria-label="Điều hướng vị trí" className="hidden lg:flex items-center gap-2 text-xs">
          <Link
            href="/supervisor/dashboard"
            className="flex items-center gap-1.5 font-semibold text-slate-500 hover:text-[#164E9B] transition-colors"
          >
            <UserCheck className="size-4 text-[#164E9B]" />
            <span>Cổng GVHD</span>
          </Link>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-bold text-slate-800">
            {pageTitle}
          </span>
          <span className="ml-1 rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-[#164E9B] tracking-wide">
            GIẢNG VIÊN HƯỚNG DẪN
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/supervisor/progress-reports"
          className="hidden min-h-10 items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-[#0F2744] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] md:inline-flex motion-reduce:transition-none"
        >
          <ClipboardCheck className="size-4 text-[#164E9B]" aria-hidden="true" />
          <span>Báo cáo tiến độ</span>
        </Link>

        <Link
          href="/supervisor/extensions"
          className="hidden min-h-10 items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-[#0F2744] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] xl:inline-flex motion-reduce:transition-none"
        >
          <CalendarClock className="size-4 text-[#164E9B]" aria-hidden="true" />
          <span>Thẩm định gia hạn</span>
        </Link>

        {/* Chuông thông báo Real-time */}
        <NotificationBellPopover role="supervisor" />

        <div className="relative" ref={menuContainerRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            aria-label="Tài khoản Giảng viên và định mức hướng dẫn"
            className="inline-flex min-h-10 items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-1.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#164E9B] text-xs font-bold text-white">
              {initialChar}
            </span>
            <span className="hidden max-w-[160px] truncate text-xs font-semibold text-[#0F2744] sm:inline">
              {displayName}
            </span>
            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform motion-reduce:transition-none ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {dropdownOpen && (
            <div
              role="menu"
              aria-label="Menu tài khoản Giảng viên"
              className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-lg"
            >
              <div className="border-b border-border px-3 py-2.5">
                <p className="truncate text-xs font-bold text-foreground">
                  {displayName}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {profile?.email || displayCode || ""}
                </p>
              </div>

              <div className="py-1">
                <Link href="/profile#account" role="menuitem" onClick={() => setDropdownOpen(false)} className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none">
                  <UserRound className="size-4 text-[#164E9B]" aria-hidden="true" />
                  <span>Hồ sơ cá nhân</span>
                </Link>
                <Link href="/profile#security" role="menuitem" onClick={() => setDropdownOpen(false)} className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none">
                  <KeyRound className="size-4 text-[#164E9B]" aria-hidden="true" />
                  <span>Đổi mật khẩu &amp; Bảo mật</span>
                </Link>
              </div>

              <div className="border-t border-border pt-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setDropdownOpen(false);
                    void logout();
                  }}
                  className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 motion-reduce:transition-none"
                >
                  <LogOut className="size-4 shrink-0" aria-hidden="true" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default SupervisorHeader;
