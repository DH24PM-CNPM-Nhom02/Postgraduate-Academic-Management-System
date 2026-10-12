"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Milestone,
  BookOpenCheck,
  CalendarRange,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";

interface StudentSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    title: "Tổng quan tiến độ",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mốc tiến độ NCS",
    href: "/milestones",
    icon: Milestone,
  },
  {
    title: "Công bố khoa học",
    href: "/my-publications",
    icon: BookOpenCheck,
  },
  {
    title: "Gia hạn đào tạo",
    href: "/extensions",
    icon: CalendarRange,
  },
  {
    title: "Bảo vệ luận án",
    href: "/defense",
    icon: ShieldCheck,
  },
  {
    title: "Xét tốt nghiệp",
    href: "/graduation",
    icon: GraduationCap,
  },
];

export function StudentSidebar({ isOpen, onClose }: StudentSidebarProps) {
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
        {/* Sidebar Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <GraduationCap className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">AGU Sau Đại Học</span>
              <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                Cổng Nghiên cứu sinh
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

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Quản lý học vụ
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-2xs dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`size-4.5 transition-colors ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Notice Card */}
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/30">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 dark:text-blue-300">
              <Sparkles className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <span>Tiến độ đào tạo</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Hãy kiểm tra hạn nộp báo cáo định kỳ và cập nhật công bố khoa học đúng thời hạn.
            </p>
          </div>
        </div>

        {/* User Mini Card at Bottom */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs dark:bg-blue-900 dark:text-blue-200">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="size-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {user?.fullName || "Nghiên cứu sinh"}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {user?.username ? `Mã NCS: ${user.username}` : "Khóa NCS"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default StudentSidebar;
