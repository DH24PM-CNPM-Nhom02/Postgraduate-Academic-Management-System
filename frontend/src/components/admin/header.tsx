"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  LogOut,
  User,
  History,
  ChevronDown,
  Terminal,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { NotificationBellPopover } from "@/src/components/notification/NotificationBellPopover";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/85 sm:px-6">
      {/* Left: Mobile Toggle & Role Badge */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 lg:hidden"
          aria-label="Mở danh mục điều hướng"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:inline">
            Hệ thống
          </span>
          <span className="hidden text-muted-foreground sm:inline">/</span>
          <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            <span className="size-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
            Quản trị viên Hệ thống
          </div>
        </div>
      </div>

      {/* Right: Actions, System Metrics & Profile */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Quick status pill */}
        <div className="hidden items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground md:flex">
          <Terminal className="size-3.5 text-rose-600" />
          <span className="tabular-nums">Console: v1.0.0</span>
        </div>

        {/* Notifications */}
        <NotificationBellPopover />

        <div className="h-6 w-px bg-border" aria-hidden="true" />

        {/* User profile dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white shadow-2xs">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden text-left md:block">
              <p className="max-w-[140px] truncate text-xs font-semibold text-foreground">
                {user?.fullName || "Quản trị viên"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {user?.username || "ADMIN"}
              </p>
            </div>
            <ChevronDown
              className={`size-3.5 text-muted-foreground transition-transform duration-150 ${
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
                className="absolute right-0 top-full z-40 mt-1.5 w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="border-b border-border px-3 py-2">
                  <p className="truncate text-xs font-bold text-foreground">
                    {user?.fullName || "Quản trị viên"}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {user?.email ||
                      (user?.username
                        ? `${user.username}@agu.edu.vn`
                        : "admin@agu.edu.vn")}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/admin"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                  >
                    <User className="size-4 text-muted-foreground" />
                    <span>Quản lý tài khoản</span>
                  </Link>
                  <Link
                    href="/admin/audit-log"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                  >
                    <History className="size-4 text-muted-foreground" />
                    <span>Nhật ký kiểm toán</span>
                  </Link>
                </div>

                <div className="border-t border-border pt-1">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-destructive transition-colors duration-150 hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                  >
                    <LogOut className="size-4" />
                    <span>Đăng xuất</span>
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
