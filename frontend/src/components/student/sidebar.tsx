"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Milestone,
  Sparkles,
  User,
  X,
  ClipboardList,
  BookOpen,
  HelpCircle,
  ScrollText,
  UserCheck,
  FileEdit,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { HoverLogo } from "./HoverLogo";

interface StudentSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Danh mục điều hướng cho NCS:
 * 1. Nhóm Quản lý học vụ NCS: "Tiến độ NCS" (9 Mốc đào tạo), Đề tài, GVHD, Đơn đề nghị, Xét tốt nghiệp
 * 2. Nhóm Tra cứu & Trợ giúp NCS: "Thủ tục & Biểu mẫu học vụ", "Quy chế & Quy định", "Hỏi đáp & Liên hệ"
 */
interface StudentNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

const navItems: StudentNavItem[] = [
  {
    title: "Tiến độ NCS",
    href: "/student/progress",
    icon: Milestone,
    badge: "9 Mốc",
  },
  {
    title: "Đề tài luận án",
    href: "/student/thesis",
    icon: ScrollText,
  },
  {
    title: "Giảng viên hướng dẫn",
    href: "/student/supervisors",
    icon: UserCheck,
  },
  {
    title: "Đơn đề nghị & Gia hạn",
    href: "/student/extensions",
    icon: FileEdit,
  },
  {
    title: "Xét tốt nghiệp",
    href: "/student/graduation",
    icon: GraduationCap,
  },
];

const supportNavItems = [
  {
    title: "Thủ tục & Biểu mẫu học vụ",
    href: "/student/procedures",
    icon: ClipboardList,
  },
  {
    title: "Quy chế & Quy định",
    href: "/student/regulations",
    icon: BookOpen,
  },
  {
    title: "Hỏi đáp & Liên hệ",
    href: "/student/faq",
    icon: HelpCircle,
  },
];

export function StudentSidebar({ isOpen, onClose }: StudentSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container - Sticky cố định khi cuộn trang trên Desktop */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:w-64 lg:shrink-0 lg:self-start ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Brand Header đồng bộ với HoverLogo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
          <Link
            href="/student/progress"
            className="flex items-center gap-2.5 transition-transform hover:scale-102 motion-reduce:hover:scale-100"
          >
            <HoverLogo sizeClass="size-9" />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-black uppercase tracking-tight text-[#0F2744]">
                AGU Sau Đại Học
              </span>
              <span className="truncate text-[10px] font-semibold text-[#164E9B]">
                Cổng Nghiên cứu sinh
              </span>
            </div>
          </Link>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] lg:hidden"
              aria-label="Đóng thanh điều hướng"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quản lý học vụ NCS
            </div>
            <nav aria-label="Điều hướng học vụ nghiên cứu sinh" className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#164E9B] font-bold text-white shadow-xs"
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
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
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

          {/* Nhóm Tra cứu & Trợ giúp NCS dùng chung */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tra cứu &amp; Trợ giúp NCS
            </div>
            <nav aria-label="Tra cứu và trợ giúp" className="space-y-1">
              {supportNavItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#164E9B] font-bold text-white shadow-xs"
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

          {/* Quick Notice Card */}
          <div className="rounded-xl border border-blue-100 bg-[#F0F5FA] p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#164E9B]">
              <Sparkles className="size-4 shrink-0 text-[#164E9B]" />
              <span>Tiến trình 9 mốc</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Theo dõi và hoàn tất các báo cáo định kỳ theo đúng Quy chế Đào tạo Tiến sĩ BR-08.
            </p>
          </div>
        </div>

        {/* User Mini Card at Bottom */}
        <div className="border-t border-slate-200 bg-white p-3">
          <Link
            href="/student/profile"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-2.5 transition-colors hover:bg-slate-100"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#164E9B] text-xs font-bold text-white shadow-2xs">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="size-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900">
                {user?.fullName || "Nghiên cứu sinh"}
              </p>
              <p className="truncate text-[11px] font-medium text-slate-500">
                {user?.username ? `Mã NCS: ${user.username}` : "Khóa 32 (2024-2028)"}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}

export default StudentSidebar;
