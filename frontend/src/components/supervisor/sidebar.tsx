"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  FileCheck,
  Gauge,
  UserCheck,
  X,
  User,
  Info,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";

interface SupervisorSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    title: "Danh sách NCS",
    href: "/students",
    icon: Users,
  },
  {
    title: "Báo cáo định kỳ",
    href: "/progress-reports",
    icon: FileCheck,
  },
  {
    title: "Định mức hướng dẫn",
    href: "/quota",
    icon: Gauge,
  },
];

export function SupervisorSidebar({ isOpen, onClose }: SupervisorSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/students" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <UserCheck className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">AGU Sau Đại Học</span>
              <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                Cổng Giảng viên HD
              </span>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
              aria-label="Đóng thanh điều hướng"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Quản lý Nghiên cứu sinh
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/students" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 shadow-2xs dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`size-4.5 transition-colors ${
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Supervisor quota indicator card */}
          <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 dark:border-indigo-900/50 dark:bg-indigo-950/30">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-800 dark:text-indigo-300">
              <Info className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span>Định mức hướng dẫn</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Theo quy định ĐHQG-HCM, mỗi GVHD chính phụ trách tối đa 3-5 NCS tại cùng một thời điểm.
            </p>
          </div>
        </div>

        {/* User Mini Card at Bottom */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs dark:bg-indigo-900 dark:text-indigo-200">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="size-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {user?.fullName || "Giảng viên HD"}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {user?.username ? `Mã CB: ${user.username}` : "Cán bộ Hướng dẫn"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SupervisorSidebar;
