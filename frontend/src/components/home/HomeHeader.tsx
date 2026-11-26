"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  Menu,
  Megaphone,
  X,
} from "lucide-react";
import { HoverLogo } from "@/src/components/academic/HoverLogo";
import type { UserRole } from "@/src/lib/auth/constants";

const ROLE_PORTAL: Record<UserRole, { href: string; label: string }> = {
  NCS: { href: "/student/progress", label: "Vào Cổng NCS" },
  GVHD: { href: "/supervisor", label: "Vào Cổng GVHD" },
  GIAO_VU: { href: "/academic", label: "Vào Cổng Giáo vụ" },
  ADMIN: { href: "/admin", label: "Vào Cổng Quản trị" },
};

const NAV_ITEMS = [
  { href: "#announcements", label: "Thông báo", icon: Megaphone },
  { href: "#timeline", label: "Lịch học vụ", icon: CalendarDays },
  { href: "#training-process", label: "Quy trình đào tạo", icon: GraduationCap },
  { href: "#documents", label: "Biểu mẫu & Quy chế", icon: ClipboardList },
  { href: "#faq", label: "Hỏi đáp & Liên hệ", icon: HelpCircle },
];

export function HomeHeader() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = session?.user?.role;
  const mustChangePassword = session?.user?.mustChangePassword === true;
  const portal = role ? ROLE_PORTAL[role] : undefined;

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-4 py-3 shadow-2xs backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Left: Logo & University Branding */}
        <Link href="/" className="group flex items-center gap-3 transition-transform active:scale-98">
          <HoverLogo sizeClass="size-10 sm:size-11" />
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-tight text-[#0F2744] transition-colors group-hover:text-[#164E9B] sm:text-sm">
              Trường Đại học An Giang
            </span>
            <span className="text-[10px] font-bold tracking-wide text-[#164E9B] sm:text-[11px]">
              ĐẠI HỌC QUỐC GIA TP. HỒ CHÍ MINH
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 xl:gap-2 lg:flex">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(href);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#164E9B] xl:px-3"
            >
              <Icon className="size-3.5 text-[#164E9B]" aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        {/* Right: Auth Action & Mobile Menu Button */}
        <div className="flex items-center gap-2">
          {status !== "loading" && (
            <Link
              href={mustChangePassword ? "/login" : portal?.href ?? "/login"}
              className="inline-flex items-center gap-2 rounded-xl bg-[#164E9B] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#113E7D] hover:shadow-sm"
            >
              {mustChangePassword ? (
                <span>Đổi mật khẩu</span>
              ) : portal ? (
                <span>{portal.label}</span>
              ) : (
                <span>Đăng nhập hệ thống</span>
              )}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Đóng danh mục" : "Mở danh mục"}
            aria-expanded={mobileMenuOpen}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mt-3 border-t border-slate-200/80 pt-3 lg:hidden">
          <nav aria-label="Điều hướng di động" className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(href);
                }}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#164E9B]"
              >
                <Icon className="size-4 text-[#164E9B]" />
                <span>{label}</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
