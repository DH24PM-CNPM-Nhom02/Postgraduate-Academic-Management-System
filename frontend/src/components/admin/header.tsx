"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Terminal,
  Activity,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      {/* Left: Mobile Toggle & Role Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
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
            <span className="size-1.5 rounded-full bg-rose-600 dark:bg-rose-400"></span>
            Quản trị viên Hệ thống
          </div>
        </div>
      </div>

      {/* Right: Actions, System Metrics & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick status pill */}
        <div className="hidden md:flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          <Terminal className="size-3.5 text-rose-600" />
          <span>Console: v1.0.0</span>
        </div>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Thông báo hệ thống"
        >
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-600 ring-2 ring-background"></span>
        </button>

        <div className="h-6 w-px bg-border"></div>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-muted transition-colors"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white shadow-2xs">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-foreground line-clamp-1">
                {user?.fullName || "Quản trị viên"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {user?.username || "ADMIN"}
              </p>
            </div>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1.5 z-40 w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-100">
                <div className="border-b border-border px-3 py-2">
                  <p className="text-xs font-bold text-foreground">
                    {user?.fullName || "Quản trị viên"}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {user?.email || (user?.username ? `${user.username}@agu.edu.vn` : "admin@agu.edu.vn")}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/users"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                  >
                    <User className="size-4 text-muted-foreground" />
                    <span>Quản lý tài khoản</span>
                  </Link>
                  <Link
                    href="/system"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                  >
                    <Shield className="size-4 text-muted-foreground" />
                    <span>Thiết lập bảo mật</span>
                  </Link>
                </div>

                <div className="border-t border-border pt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors font-medium"
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
