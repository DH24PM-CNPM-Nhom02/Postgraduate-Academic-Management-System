"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  ChevronDown,
  ClipboardCheck,
  FilePenLine,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { NotificationBellPopover } from "@/src/components/notification";
import { mockSupervisorProfile, mockSupervisorQuota } from "@/src/mocks/supervisor";
import type { SupervisorProfile, SupervisorQuota } from "@/src/types/ui/supervisor";


export interface SupervisorHeaderProps {
  onToggleSidebar?: () => void;
  profile?: SupervisorProfile;
  quota?: SupervisorQuota;
}

export function SupervisorHeader({
  onToggleSidebar,
  profile = mockSupervisorProfile,
  quota = mockSupervisorQuota,
}: SupervisorHeaderProps) {
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

  const displayName = user?.fullName || profile.hoTen;
  const displayCode = user?.username || profile.maCanBo;
  const initialChar = displayName.trim().slice(0, 1).toUpperCase() || "G";

  const quotaBadgeClasses =
    quota.mucCanhBao === "EXCEEDED" || quota.mucCanhBao === "FULL"
      ? "bg-rose-50 text-rose-700"
      : quota.mucCanhBao === "WARNING"
      ? "bg-amber-50 text-amber-800"
      : "bg-[#164E9B]/10 text-[#164E9B]";

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

        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-[#0F2744]">
            Phân hệ Giảng viên Hướng dẫn
          </p>
          <p className="text-xs text-muted-foreground">
            Hệ thống Quản lý Đào tạo Sau đại học
          </p>
        </div>
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
              className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-border bg-card p-2 shadow-lg"
            >
              <div className="rounded-lg bg-[#F0F5FA] p-3">
                <p className="truncate text-sm font-bold text-[#0F2744]">
                  {displayName}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {displayCode} • {profile.donVi}
                </p>
                <div
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold tabular-nums ${quotaBadgeClasses}`}
                >
                  <Gauge className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    Định mức: {quota.tongTrongSo.toFixed(1)}/{quota.hanMucToiDa.toFixed(1)} ({quota.tyLeSuDungPhanTram}%)
                  </span>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <Link
                  href="/supervisor/dashboard"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
                >
                  <LayoutDashboard className="size-4 text-[#164E9B]" aria-hidden="true" />
                  <span>Bàn làm việc GVHD</span>
                </Link>
                <Link
                  href="/supervisor/students"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
                >
                  <Users className="size-4 text-[#164E9B]" aria-hidden="true" />
                  <span>Danh sách NCS hướng dẫn</span>
                </Link>
                <Link
                  href="/supervisor/extensions"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
                >
                  <CalendarClock className="size-4 text-[#164E9B]" aria-hidden="true" />
                  <span>Thẩm định đơn gia hạn</span>
                </Link>
                <Link
                  href="/supervisor/requests"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
                >
                  <FilePenLine className="size-4 text-[#164E9B]" aria-hidden="true" />
                  <span>Đề xuất thay NCS</span>
                </Link>
                <Link
                  href="/supervisor/quota"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
                >
                  <Gauge className="size-4 text-[#164E9B]" aria-hidden="true" />
                  <span>Chi tiết định mức BR-09</span>
                </Link>
              </div>

              <div className="mt-2 border-t border-border pt-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setDropdownOpen(false);
                    void logout();
                  }}
                  className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 motion-reduce:transition-none"
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
