"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  FilePenLine,
  Gauge,
  HelpCircle,
  LayoutDashboard,
  Scale,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { mockSupervisorProfile, mockSupervisorQuota } from "@/src/mocks/supervisor";
import type { SupervisorProfile, SupervisorQuota } from "@/src/types/ui/supervisor";
import { HoverLogo } from "./HoverLogo";

export interface SupervisorSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  profile?: SupervisorProfile;
  quota?: SupervisorQuota;
}

const primaryNavItems = [
  {
    href: "/supervisor/dashboard",
    label: "Bàn làm việc GVHD",
    icon: LayoutDashboard,
  },
  {
    href: "/supervisor/students",
    label: "Danh sách NCS",
    icon: Users,
  },
  {
    href: "/supervisor/progress-reports",
    label: "Báo cáo tiến độ",
    icon: ClipboardCheck,
  },
  {
    href: "/supervisor/extensions",
    label: "Thẩm định gia hạn",
    icon: CalendarClock,
  },
  {
    href: "/supervisor/requests",
    label: "Đề xuất thay NCS",
    icon: FilePenLine,
  },
  {
    href: "/supervisor/quota",
    label: "Định mức hướng dẫn",
    icon: Gauge,
  },
];

const referenceNavItems = [
  {
    href: "/supervisor/regulations",
    label: "Quy chế GVHD",
    icon: BookOpen,
  },
  {
    href: "/supervisor/faq",
    label: "Hỏi đáp & Hỗ trợ",
    icon: HelpCircle,
  },
];

export function SupervisorSidebar({
  isOpen = false,
  onClose,
  profile = mockSupervisorProfile,
  quota = mockSupervisorQuota,
}: SupervisorSidebarProps) {
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

  const displayName = user?.fullName || profile.hoTen;
  const displayCode = user?.username || profile.maCanBo;

  const isNavItemActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {isOpen && onClose && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#0F2744]/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <aside
        aria-label="Điều hướng phân hệ Giảng viên hướng dẫn"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-border bg-[#0F2744] text-white transition-transform duration-200 motion-reduce:transition-none lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link
            href="/supervisor/dashboard"
            onClick={onClose}
            className="flex min-h-10 items-center gap-3 rounded-lg pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-white p-1">
              <HoverLogo sizeClass="size-8" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-tight text-white">
                Cổng GVHD
              </p>
              <p className="truncate text-xs text-sky-200/90">
                ĐH An Giang • Sau đại học
              </p>
            </div>
          </Link>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng thanh điều hướng"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden motion-reduce:transition-none"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="border-b border-white/10 px-4 py-3.5">
          <div className="rounded-lg bg-white/10 px-3.5 py-2.5">
            <p className="truncate text-sm font-semibold text-white">
              {displayName}
            </p>
            <p className="mt-0.5 truncate text-xs text-sky-200">
              Mã cán bộ: {displayCode}
            </p>
          </div>
        </div>

        <nav
          aria-label="Chức năng chính Giảng viên"
          className="flex-1 space-y-5 overflow-y-auto px-3 py-4"
        >
          <div>
            <p className="px-3 pb-2 text-xs font-semibold text-sky-200/75">
              Hướng dẫn Nghiên cứu sinh
            </p>
            <ul className="space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = isNavItemActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none ${
                        active
                          ? "bg-[#164E9B] text-white"
                          : "text-sky-100/90 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="px-3 pb-2 text-xs font-semibold text-sky-200/75">
              Quy chế & Hỗ trợ
            </p>
            <ul className="space-y-1">
              {referenceNavItems.map((item) => {
                const Icon = item.icon;
                const active = isNavItemActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none ${
                        active
                          ? "bg-[#164E9B] text-white"
                          : "text-sky-100/90 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="rounded-lg bg-[#164E9B]/55 p-3.5">
            <div className="flex items-center justify-between gap-2 text-xs font-semibold text-white">
              <span className="inline-flex items-center gap-1.5">
                <Scale className="size-3.5 text-sky-200" aria-hidden="true" />
                <span>Định mức BR-09</span>
              </span>
              <span className="tabular-nums text-sky-100">
                {quota.tongTrongSo.toFixed(1)}/{quota.hanMucToiDa.toFixed(1)}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-sky-100/85">
              Chính = 1.0 • Đồng HD = 0.5 • Tối đa {quota.hanMucToiDa.toFixed(1)} điểm định mức.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SupervisorSidebar;
