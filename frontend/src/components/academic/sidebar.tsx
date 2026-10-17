"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileCheck2,
  FileEdit,
  ClipboardList,
  CalendarDays,
  FileSpreadsheet,
  Award,
  BookOpen,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { HoverLogo } from "./HoverLogo";

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
  group: "main" | "academic" | "support";
  href?: string;
}

export const ACADEMIC_NAV_ITEMS: NavItemDef[] = [
  // Nhóm chức năng chính dành cho Giáo vụ
  {
    id: "dashboard",
    title: "Tổng quan (Dashboard)",
    icon: LayoutDashboard,
    group: "main",
    href: "/academic",
  },
  {
    id: "students",
    title: "Quản lý NCS",
    icon: Users,
    group: "main",
    badge: "18",
    badgeColor: "bg-blue-100 text-[#164E9B]",
    href: "/academic/students",
  },
  {
    id: "supervisors",
    title: "Quản lý GVHD & Hạn ngạch",
    icon: UserCheck,
    group: "main",
    badge: "2.5/3",
    badgeColor: "bg-emerald-100 text-emerald-800 font-bold",
    href: "/academic/supervisors",
  },
  {
    id: "evidence",
    title: "Duyệt minh chứng học vị & Báo cáo",
    icon: FileCheck2,
    group: "main",
    badge: 5,
    badgeColor: "bg-amber-100 text-amber-800 font-bold",
    href: "/academic/evidence",
  },
  {
    id: "topic-changes",
    title: "Duyệt đề nghị đổi đề tài",
    icon: FileEdit,
    group: "main",
    badge: 2,
    badgeColor: "bg-rose-500 text-white font-bold",
    href: "/academic/topic-changes",
  },

  // Nhóm nghiệp vụ học vụ
  {
    id: "procedures",
    title: "Thủ tục học vụ",
    icon: ClipboardList,
    group: "academic",
    href: "/academic/procedures",
  },
  {
    id: "calendar",
    title: "Lịch học vụ & Thông báo",
    icon: CalendarDays,
    group: "academic",
    badge: "Mới",
    badgeColor: "bg-indigo-100 text-indigo-700",
    href: "/academic/calendar",
  },
  {
    id: "forms",
    title: "Biểu mẫu & Đơn từ",
    icon: FileSpreadsheet,
    group: "academic",
    href: "/academic/forms",
  },
  {
    id: "results",
    title: "Kết quả học tập & Tiến độ",
    icon: Award,
    group: "academic",
    href: "/academic/students",
  },

  // Nhóm trợ giúp & văn bản
  {
    id: "regulations",
    title: "Quy chế & Quy định",
    icon: BookOpen,
    group: "support",
    href: "/academic/regulations",
  },
  {
    id: "faq",
    title: "Hỏi đáp & Liên hệ",
    icon: HelpCircle,
    group: "support",
    href: "/academic/faq",
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
  const searchParams = useSearchParams();
  const currentUrlTab = searchParams.get("tab") || "dashboard";

  let currentTab = activeTab;
  if (!currentTab) {
    if (pathname === "/academic" || pathname === "/academic/") {
      currentTab = "dashboard";
    } else if (pathname?.startsWith("/academic/students")) {
      currentTab = "students";
    } else if (pathname?.startsWith("/academic/supervisors")) {
      currentTab = "supervisors";
    } else if (pathname?.startsWith("/academic/evidence")) {
      currentTab = "evidence";
    } else if (pathname?.startsWith("/academic/topic-changes")) {
      currentTab = "topic-changes";
    } else if (pathname?.startsWith("/academic/procedures")) {
      currentTab = "procedures";
    } else if (pathname?.startsWith("/academic/calendar")) {
      currentTab = "calendar";
    } else if (pathname?.startsWith("/academic/forms")) {
      currentTab = "forms";
    } else if (pathname?.startsWith("/academic/regulations")) {
      currentTab = "regulations";
    } else if (pathname?.startsWith("/academic/faq")) {
      currentTab = "faq";
    } else {
      currentTab = currentUrlTab;
    }
  }

  const handleNavClick = (item: NavItemDef) => {
    if (onTabChange) {
      onTabChange(item.id);
    }
    if (onClose) {
      onClose();
    }
  };

  const renderGroup = (
    groupKey: "main" | "academic" | "support",
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
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href || `/academic?tab=${item.id}`}
              onClick={() => handleNavClick(item)}
              title={isCollapsed ? item.title : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#164E9B] text-white shadow-xs font-bold"
                  : "text-slate-700 hover:bg-slate-100/90 hover:text-[#164E9B]"
              } ${isCollapsed ? "justify-center px-2" : ""}`}
            >
              <Icon
                className={`size-4.5 shrink-0 transition-colors ${
                  isActive
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
                  className={`flex items-center justify-center rounded-full px-1.5 py-0.2 text-[10px] ${
                    item.badgeColor || "bg-slate-100 text-slate-700"
                  } ${
                    isCollapsed
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
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:self-start lg:shrink-0 lg:z-30 ${
          isCollapsed ? "w-20" : "w-64"
        } ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 bg-white">
          <Link
            href="/academic"
            className={`flex items-center gap-2.5 ${
              isCollapsed ? "justify-center w-full" : ""
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
          {renderGroup("academic", "Nghiệp vụ học vụ")}
          <div className="my-2 border-t border-slate-100" />
          {renderGroup("support", "Văn bản & Trợ giúp")}

          {/* Academic Affairs status widget (visible when expanded) */}
          {!isCollapsed && (
            <div className="mt-4 rounded-xl border border-blue-100 bg-[#F0F5FA] p-3 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#164E9B]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5" />
                  <span>Hồ sơ cần thẩm định:</span>
                </span>
                <span className="font-extrabold text-amber-600">7 hồ sơ</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: "70%" }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-slate-500 leading-tight">
                Gồm 5 minh chứng mốc &amp; 2 đề nghị đổi đề tài đang chờ Giáo vụ duyệt.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Profile / Quick Role status */}
        <div className="border-t border-slate-200 p-2.5 bg-slate-50/60">
          <div
            className={`flex items-center gap-2.5 rounded-xl bg-white p-2 border border-slate-200 ${
              isCollapsed ? "justify-center p-1.5" : ""
            }`}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#164E9B] text-white font-bold text-xs shadow-2xs">
              TA
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">
                  TS. Bùi Lê Tuấn Anh
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
