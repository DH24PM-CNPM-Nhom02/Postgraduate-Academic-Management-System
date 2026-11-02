"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Gauge,
  ClipboardList,
  BookOpen,
  HelpCircle,
  X,
  Info,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { HoverLogo } from "./HoverLogo";

interface SupervisorSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    title: "Bàn làm việc GVHD",
    href: "/supervisor/dashboard",
    icon: LayoutDashboard,
    badge: "Mới",
  },
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

const supportNavItems = [
  {
    title: "Thủ tục & Biểu mẫu học vụ",
    href: "/supervisor/procedures",
    icon: ClipboardList,
  },
  {
    title: "Quy chế & Quy định",
    href: "/supervisor/regulations",
    icon: BookOpen,
  },
  {
    title: "Hỏi đáp & Liên hệ",
    href: "/supervisor/faq",
    icon: HelpCircle,
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container - Sticky cố định khi cuộn trên Desktop */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:self-start lg:shrink-0 lg:z-30 lg:w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header đồng bộ với HoverLogo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 bg-white">
          <Link
            href="/supervisor/dashboard"
            className="flex items-center gap-2.5 transition-transform hover:scale-102"
          >
            <HoverLogo sizeClass="size-9" />
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-black tracking-tight text-[#0F2744] uppercase">
                AGU Sau Đại Học
              </span>
              <span className="truncate text-[10px] font-semibold text-[#164E9B]">
                Cổng Giảng viên HD
              </span>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Đóng thanh điều hướng"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Quản lý Nghiên cứu sinh
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/supervisor/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#164E9B] text-white shadow-xs font-bold"
                        : "text-slate-700 hover:bg-slate-100 hover:text-[#164E9B]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`size-4.5 transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-slate-500 group-hover:text-[#164E9B]"
                        }`}
                      />
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-50 text-[#164E9B]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Nhóm Văn bản & Trợ giúp tra cứu dùng chung */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Văn bản &amp; Trợ giúp
            </div>
            <nav className="space-y-1">
              {supportNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#164E9B] text-white shadow-xs font-bold"
                        : "text-slate-700 hover:bg-slate-100 hover:text-[#164E9B]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`size-4.5 transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-slate-500 group-hover:text-[#164E9B]"
                        }`}
                      />
                      <span>{item.title}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Supervisor quota indicator card */}
          <div className="rounded-xl border border-blue-100 bg-[#F0F5FA] p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#164E9B]">
              <Info className="size-4 shrink-0 text-[#164E9B]" />
              <span>Định mức hướng dẫn</span>
            </div>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Theo quy định ĐHQG-HCM, mỗi GVHD chính phụ trách tối đa 5 NCS tại cùng một thời điểm.
            </p>
          </div>
        </div>

        {/* User Mini Card at Bottom */}
        <div className="border-t border-slate-200 p-3 bg-white">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#164E9B] text-white font-bold text-xs shadow-2xs">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "T"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900">
                {user?.fullName || "PGS.TS. Trần Quốc Tuấn"}
              </p>
              <p className="truncate text-[11px] text-slate-500 font-medium">
                {user?.username ? `Mã CB: ${user.username}` : "Mã CB: GVHD-CNTT-001"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SupervisorSidebar;
