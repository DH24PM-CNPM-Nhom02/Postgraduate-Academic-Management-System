"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileCheck2,
  FileEdit,
  Files,
  ClipboardList,
  BookOpen,
  BookOpenCheck,
  Award,
  GraduationCap,
  BadgeCheck,
  HelpCircle,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  X,
  User,
} from "lucide-react";
import { HoverLogo } from "./HoverLogo";
import { useHydrated } from "@/src/hooks/use-hydrated";
import { useAuth } from "@/src/hooks/use-auth";

export interface AcademicSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  activeTab?: string;
  onTabChange?: (tabKey: string) => void;
}

export interface NavItemDef {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  group: "main" | "support";
  href?: string;
  matchPaths?: string[];
}

export const ACADEMIC_NAV_ITEMS: NavItemDef[] = [
  // Nhóm chức năng chính dành cho Giáo vụ
  {
    id: "dashboard",
    title: "Tổng quan (Dashboard)",
    icon: LayoutDashboard,
    group: "main",
    href: "/academic",
    matchPaths: ["/academic"],
  },
  {
    id: "password-requests",
    title: "Yêu cầu cấp lại mật khẩu",
    icon: KeyRound,
    group: "main",
    href: "/academic/password-requests",
  },
  {
    id: "students",
    title: "Quản lý NCS",
    icon: Users,
    group: "main",
    href: "/academic/students",
    matchPaths: ["/academic/students", "/students"],
  },
  {
    id: "cohorts",
    title: "Quản lý niên khóa",
    icon: GraduationCap,
    group: "main",
    href: "/academic/cohorts",
  },
  {
    id: "training-majors",
    title: "Quản lý ngành đào tạo",
    icon: BookOpen,
    group: "main",
    href: "/academic/training-majors",
  },
  {
    id: "theses",
    title: "Quản lý Đề tài Luận án",
    icon: BookOpenCheck,
    group: "main",
    badgeColor: "bg-amber-100 text-amber-800 font-bold",
    href: "/academic/theses",
    matchPaths: ["/academic/theses", "/academic/thesis"],
  },
  {
    id: "supervisors",
    title: "Quản lý GVHD & Hạn ngạch",
    icon: UserCheck,
    group: "main",
    badgeColor: "bg-emerald-100 text-emerald-800 font-bold",
    href: "/academic/supervisors",
    matchPaths: ["/academic/supervisors"],
  },
  {
    id: "milestone-review",
    title: "Hàng chờ duyệt 9 mốc",
    icon: FileCheck2,
    group: "main",
    href: "/academic/milestone-review",
    matchPaths: ["/academic/milestone-review", "/review-queue"],
  },
  {
    id: "documents",
    title: "Quản lý tài liệu",
    icon: Files,
    group: "main",
    href: "/academic/documents",
    matchPaths: ["/academic/documents"],
  },
  {
    id: "decisions",
    title: "Quản lý Quyết định",
    icon: Award,
    group: "main",
    href: "/academic/decisions",
    matchPaths: ["/academic/decisions"],
  },
  {
    id: "graduation-check",
    title: "Xét tốt nghiệp",
    icon: GraduationCap,
    group: "main",
    href: "/graduation-check",
    matchPaths: ["/graduation-check"],
  },
  {
    id: "graduates",
    title: "NCS đã tốt nghiệp",
    icon: BadgeCheck,
    group: "main",
    href: "/academic/graduates",
  },
  // {
  //   id: "evidence",
  //   title: "Minh chứng học vị & Báo cáo",
  //   icon: FileSpreadsheet,
  //   group: "main",
  //   href: "/academic/evidence",
  //   matchPaths: ["/academic/evidence", "/publications"],
  // },
  {
    id: "topic-changes",
    title: "Duyệt đề nghị điều chỉnh",
    icon: FileEdit,
    group: "main",
    href: "/academic/topic-changes",
    matchPaths: ["/academic/topic-changes"],
  },

  // Nhóm trợ giúp & văn bản
  {
    id: "procedures",
    title: "Biểu mẫu học vụ",
    icon: ClipboardList,
    group: "support",
    href: "/academic/procedures",
    matchPaths: ["/academic/procedures", "/academic/forms", "/academic-affairs"],
  },
  {
    id: "regulations",
    title: "Quy chế & Quy định",
    icon: BookOpen,
    group: "support",
    href: "/academic/regulations",
    matchPaths: ["/academic/regulations"],
  },
  {
    id: "faq",
    title: "Hỏi đáp & Liên hệ",
    icon: HelpCircle,
    group: "support",
    href: "/academic/faq",
    matchPaths: ["/academic/faq"],
  },
];

export function AcademicSidebar({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  activeTab,
  onTabChange,
}: AcademicSidebarProps) {
  const pathname = usePathname();
  const { user: sessionUser } = useAuth();
  const hydrated = useHydrated();
  const user = hydrated ? sessionUser : undefined;
  const isItemActive = (item: NavItemDef): boolean => {
    // 0. Nếu prop activeTab được truyền trực tiếp từ component cha
    if (activeTab) {
      return activeTab === item.id;
    }

    // 1. Dashboard / Tổng quan: CHỈ active khi pathname là chính xác /academic hoặc /academic/
    if (item.id === "dashboard") {
      return pathname === "/academic" || pathname === "/academic/";
    }

    // 2. So khớp theo route pathname thực tế (ví dụ: /academic/theses, /academic/milestone-review)
    const targetHref = item.href;
    if (targetHref && targetHref !== "/academic") {
      if (pathname === targetHref || pathname?.startsWith(`${targetHref}/`)) {
        return true;
      }
    }

    // 3. So khớp qua danh sách matchPaths nếu có (ví dụ: /review-queue, /graduation-check)
    if (item.matchPaths && item.matchPaths.length > 0) {
      return item.matchPaths.some((p) => {
        if (p === "/academic") {
          return pathname === "/academic" || pathname === "/academic/";
        }
        return pathname === p || pathname?.startsWith(`${p}/`);
      });
    }

    return false;
  };

  const handleNavClick = (item: NavItemDef) => {
    if (onTabChange) {
      onTabChange(item.id);
    }
    if (onClose) {
      onClose();
    }
  };

  const renderGroup = (
    groupKey: "main" | "support",
    groupLabel: string
  ) => {
    const items = ACADEMIC_NAV_ITEMS.filter((i) => i.group === groupKey);

    return (
      <div className="space-y-1">
        {!isCollapsed && (
          <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {groupLabel}
          </div>
        )}
        {items.map((item) => {
          const isActive = isItemActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href || `/academic/${item.id}`}
              onClick={() => handleNavClick(item)}
              title={isCollapsed ? item.title : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${isActive
                ? "bg-[#164E9B] text-white shadow-xs font-bold"
                : "text-slate-700 hover:bg-slate-100/90 hover:text-[#164E9B]"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
            >
              <Icon
                className={`size-4.5 shrink-0 transition-colors ${isActive
                  ? "text-white"
                  : "text-slate-500 group-hover:text-[#164E9B]"
                  }`}
              />

              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.title}</span>
              )}

              {/* Badges */}
              {item.badge !== undefined && (
                <span
                  className={`flex items-center justify-center rounded-full px-1.5 py-0.2 text-[10px] ${item.badgeColor || "bg-slate-100 text-slate-700"
                    } ${isCollapsed
                      ? "absolute -top-1 -right-1 size-4 p-0 text-[9px]"
                      : "ml-auto"
                    }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-md group-hover:block z-50">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    );
  };

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

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:self-start lg:shrink-0 lg:z-30 ${isCollapsed ? "w-20" : "w-64"
          } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 bg-white">
          <Link
            href="/"
            className={`flex items-center gap-2.5 ${isCollapsed ? "justify-center w-full" : ""
              }`}
          >
            <HoverLogo sizeClass="size-9" />

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-black tracking-tight text-[#0F2744] uppercase">
                  AGU Sau Đại Học
                </span>
                <span className="truncate text-[10px] font-semibold text-[#164E9B]">
                  Cán bộ Quản lý Giáo vụ
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Đóng thanh điều hướng"
            >
              <X className="size-5" />
            </button>
          )}

          {/* Desktop collapse toggle button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
            >
              {isCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </button>
          )}
        </div>

        {/* Scrollable Navigation items */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3 custom-scrollbar">
          {renderGroup("main", "Chức năng chính")}
          <div className="my-2 border-t border-slate-100" />
          {renderGroup("support", "Văn bản & Trợ giúp")}
        </div>

        {/* Bottom Profile / Quick Role status */}
        <div className="border-t border-slate-200 p-2.5 bg-slate-50/60">
          <div
            className={`flex items-center gap-2.5 rounded-xl bg-white p-2 border border-slate-200 ${isCollapsed ? "justify-center p-1.5" : ""
              }`}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#164E9B] text-white font-bold text-xs shadow-2xs">
              {user?.fullName ? (
                user.fullName.charAt(0).toUpperCase()
              ) : (
                <User className="size-4" />
              )}
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">
                  {user?.username ? `${user.fullName}` : "Giáo vụ"}
                </p>
                <p className="truncate text-[10px] text-slate-500">
                  Cán bộ Quản lý Giáo vụ
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default AcademicSidebar;
