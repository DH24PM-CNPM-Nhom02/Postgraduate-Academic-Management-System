"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  History,
  ShieldCheck,
  X,
  User,
  Activity,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    title: "Quản lý người dùng",
    href: "/admin",
    matchPaths: ["/admin", "/admin/users", "/users"],
    icon: Users,
  },
  {
    title: "Nhật ký kiểm toán",
    href: "/admin/audit-log",
    matchPaths: ["/admin/audit-log", "/audit-log"],
    icon: History,
  },
];

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-200 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        aria-label="Thanh điều hướng quản trị"
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-rose-600 text-white shadow-xs">
              <ShieldCheck className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">
                AGU Sau Đại Học
              </span>
              <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                Admin Console
              </span>
            </div>
          </Link>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 lg:hidden"
              aria-label="Đóng thanh điều hướng"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Quản trị &amp; Phân quyền
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.matchPaths.some((path) =>
                path === "/admin"
                  ? pathname === "/admin"
                  : pathname === path || pathname.startsWith(`${path}/`)
              );
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 ${
                    isActive
                      ? "bg-rose-50 font-semibold text-rose-700 shadow-2xs dark:bg-rose-950/60 dark:text-rose-300"
                      : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`size-4.5 shrink-0 transition-colors duration-150 ${
                      isActive
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* System status widget */}
          <div className="mt-6 rounded-xl border border-rose-200/70 bg-rose-50/40 p-3.5 dark:border-rose-900/50 dark:bg-rose-950/20">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-800 dark:text-rose-300">
              <span className="flex items-center gap-1.5">
                <Activity className="size-3.5 text-rose-600 dark:text-rose-400" />
                Trạng thái hệ thống
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Môi trường: Production (v1.0.0) • DB Cluster: Hoạt động bình thường
            </p>
          </div>
        </div>

        {/* User Mini Card at Bottom */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700 dark:bg-rose-900 dark:text-rose-200">
              {user?.fullName ? (
                user.fullName.charAt(0).toUpperCase()
              ) : (
                <User className="size-4" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {user?.fullName || "Quản trị viên"}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {user?.username ? `Admin: ${user.username}` : "Super Admin"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
