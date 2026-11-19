"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  History,
  LayoutDashboard,
  UserCheck,
  FileCheck2,
  FileEdit,
  ClipboardList,
  CalendarDays,
  BookOpen,
  Award,
  FileSpreadsheet,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  User,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { HoverLogo } from "@/src/components/academic/HoverLogo";

export interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export interface AdminNavItemDef {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  group: "admin" | "main" | "academic" | "support";
  href: string;
  matchPaths?: string[];
}

export const ADMIN_NAV_ITEMS: AdminNavItemDef[] = [
  // ── Nhóm 1: Quản trị hệ thống ──────────────────────────
  {
    id: "users",
    title: "Quản lý người dùng",
    icon: Users,
    group: "admin",
    href: "/admin",
    matchPaths: ["/admin", "/admin/users", "/users"],
  },
  {
    id: "audit-log",
    title: "Nhật ký kiểm toán",
    icon: History,
    group: "admin",
    href: "/admin/audit-log",
    matchPaths: ["/admin/audit-log", "/audit-log"],
  },

  // ── Nhóm 2: Chức năng Đào tạo SĐH (Kế thừa từ Academic) ─
  {
    id: "overview",
    title: "Tổng quan đào tạo",
    icon: LayoutDashboard,
    group: "main",
    href: "/admin/overview",
    matchPaths: ["/admin/overview"],
  },
  {
    id: "students",
    title: "Quản lý NCS",
    icon: Users,
    group: "main",
    badge: "18",
    badgeColor: "bg-blue-100 text-[#164E9B]",
    href: "/admin/students",
    matchPaths: ["/admin/students"],
  },
  {
    id: "supervisors",
    title: "Quản lý GVHD & Hạn ngạch",
    icon: UserCheck,
    group: "main",
    badge: "2.5/3",
    badgeColor: "bg-emerald-100 text-emerald-800 font-bold",
    href: "/admin/supervisors",
    matchPaths: ["/admin/supervisors"],
  },
  {
    id: "milestone-review",
    title: "Hàng chờ duyệt 9 mốc",
    icon: FileCheck2,
    group: "main",
    badge: 5,
    badgeColor: "bg-blue-100 text-[#164E9B] font-bold",
    href: "/admin/milestone-review",
    matchPaths: ["/admin/milestone-review", "/admin/review-queue"],
  },
  {
    id: "decisions",
    title: "Quản lý Quyết định",
    icon: Award,
    group: "main",
    badge: 6,
    badgeColor: "bg-purple-100 text-purple-800 font-bold",
    href: "/admin/decisions",
    matchPaths: ["/admin/decisions", "/admin/graduation-check"],
  },
  {
    id: "evidence",
    title: "Minh chứng học vị & Báo cáo",
    icon: FileSpreadsheet,
    group: "main",
    href: "/admin/evidence",
    matchPaths: ["/admin/evidence", "/admin/publications"],
  },
  {
    id: "topic-changes",
    title: "Duyệt đề nghị đổi đề tài",
    icon: FileEdit,
    group: "main",
    badge: 2,
    badgeColor: "bg-rose-100 text-rose-800 font-bold",
    href: "/admin/topic-changes",
    matchPaths: ["/admin/topic-changes"],
  },

  // ── Nhóm 3: Nghiệp vụ học vụ ───────────────────────────
  {
    id: "procedures",
    title: "Thủ tục & Biểu mẫu học vụ",
    icon: ClipboardList,
    group: "academic",
    href: "/admin/procedures",
    matchPaths: ["/admin/procedures", "/admin/forms"],
  },
  {
    id: "calendar",
    title: "Lịch học vụ & Thông báo",
    icon: CalendarDays,
    group: "academic",
    badge: "Mới",
    badgeColor: "bg-blue-100 text-[#164E9B]",
    href: "/admin/calendar",
    matchPaths: ["/admin/calendar"],
  },

  // ── Nhóm 4: Văn bản & Trợ giúp ─────────────────────────
  {
    id: "regulations",
    title: "Quy chế & Quy định",
    icon: BookOpen,
    group: "support",
    href: "/admin/regulations",
    matchPaths: ["/admin/regulations"],
  },
  {
    id: "faq",
    title: "Hỏi đáp & Liên hệ",
    icon: HelpCircle,
    group: "support",
    href: "/admin/faq",
    matchPaths: ["/admin/faq"],
  },
];

export function AdminSidebar({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
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

  const isItemActive = (item: AdminNavItemDef): boolean => {
    // 1. Quản lý người dùng: CHỈ active khi pathname là /admin, /admin/, /admin/users, /users
    if (item.id === "users") {
      return (
        pathname === "/admin" ||
        pathname === "/admin/" ||
        pathname === "/admin/users" ||
        pathname?.startsWith("/admin/users/") ||
        pathname === "/users" ||
        pathname?.startsWith("/users/")
      );
    }

    // 2. Tổng quan đào tạo (Dashboard SĐH trong Admin): CHỈ active khi pathname là /admin/overview
    if (item.id === "overview") {
      return pathname === "/admin/overview" || pathname === "/admin/overview/";
    }

    // 3. So khớp trực tiếp href của item (ngoại trừ /admin vì đã xử lý ở users)
    if (item.href && item.href !== "/admin") {
      if (pathname === item.href || pathname?.startsWith(`${item.href}/`)) {
        return true;
      }
    }

    // 4. So khớp qua danh sách matchPaths nếu có
    if (item.matchPaths && item.matchPaths.length > 0) {
      return item.matchPaths.some((p) => {
        if (p === "/admin") {
          return pathname === "/admin" || pathname === "/admin/";
        }
        if (p === "/admin/overview") {
          return pathname === "/admin/overview" || pathname === "/admin/overview/";
        }
        return pathname === p || pathname?.startsWith(`${p}/`);
      });
    }

    return false;
  };

  const renderGroup = (
    groupKey: "admin" | "main" | "academic" | "support",
    groupLabel: string
  ) => {
    const items = ADMIN_NAV_ITEMS.filter((i) => i.group === groupKey);

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
              href={item.href}
              onClick={onClose}
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
                    isActive
                      ? "bg-white/20 text-white font-bold"
                      : item.badgeColor || "bg-slate-100 text-slate-700"
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
                <div className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1 text-xs font-medium text-white shadow-xl group-hover:block z-50">
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container - Clean Light Theme */}
      <aside
        aria-label="Thanh điều hướng quản trị hệ thống"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white text-slate-700 transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:self-start lg:shrink-0 lg:z-30 ${
          isCollapsed ? "w-20" : "w-64"
        } ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 bg-white">
          <Link
            href="/"
            onClick={onClose}
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
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="truncate text-[10px] font-semibold text-[#164E9B]">
                    Phân hệ Quản trị Hệ thống
                  </span>
                  <span className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 tracking-wide">
                    ADMIN
                  </span>
                </div>
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
          {renderGroup("admin", "Quản trị & Phân quyền")}
          <div className="my-2 border-t border-slate-100" />
          {renderGroup("main", "Nghiệp vụ Đào tạo SĐH")}
          <div className="my-2 border-t border-slate-100" />
          {renderGroup("academic", "Nghiệp vụ học vụ")}
          <div className="my-2 border-t border-slate-100" />
          {renderGroup("support", "Văn bản & Trợ giúp")}

          {/* System & Academic Status Widget (visible when expanded) */}
          {!isCollapsed && (
            <div className="mt-4 rounded-xl border border-blue-100 bg-[#F0F5FA] p-3 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#164E9B]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-[#164E9B]" />
                  <span>Quyền hạn hệ thống:</span>
                </span>
                <span className="font-extrabold text-emerald-700">Toàn quyền</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600">
                <span>Hồ sơ SĐH chờ duyệt:</span>
                <span className="font-bold text-amber-600">7 hồ sơ</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#164E9B]"
                  style={{ width: "85%" }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-slate-500 leading-tight">
                Tài khoản Quản trị viên tích hợp đầy đủ quyền hạn Giáo vụ &amp; Quản trị hệ thống.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Profile / Quick Role status */}
        <div className="border-t border-slate-200 p-2.5 bg-slate-50/70">
          <div
            className={`flex items-center gap-2.5 rounded-xl bg-white p-2 border border-slate-200/80 text-slate-700 shadow-2xs ${
              isCollapsed ? "justify-center p-1.5" : ""
            }`}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#164E9B] text-white font-extrabold text-xs shadow-2xs">
              {user?.fullName ? (
                user.fullName.charAt(0).toUpperCase()
              ) : (
                <User className="size-4" />
              )}
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">
                  {user?.fullName || "Quản trị viên Hệ thống"}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <span className="truncate">
                    {user?.username ? `@${user.username}` : "admin"}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-[#164E9B]">ADMIN</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
