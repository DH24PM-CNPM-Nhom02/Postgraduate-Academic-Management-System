"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ArrowRight, BookOpen, ClipboardList, HelpCircle } from "lucide-react";
import { HoverLogo } from "@/src/components/academic/HoverLogo";
import type { UserRole } from "@/src/lib/auth/constants";

const ROLE_PORTAL: Record<UserRole, { href: string; label: string }> = {
  NCS: { href: "/student/progress", label: "Cổng NCS" },
  GVHD: { href: "/supervisor", label: "Cổng GVHD" },
  GIAO_VU: { href: "/academic", label: "Cổng Giáo vụ" },
  ADMIN: { href: "/admin", label: "Cổng Quản trị" },
};

const NAV_ITEMS = [
  { href: "/forms", homeHref: "/#procedures", label: "Biểu mẫu học vụ", shortLabel: "Biểu mẫu", icon: ClipboardList },
  { href: "/regulations", homeHref: "/#regulations", label: "Quy định & Quy chế", shortLabel: "Quy định", icon: BookOpen },
  { href: "/#faq", homeHref: "/#faq", label: "Hỏi đáp & Liên hệ", shortLabel: "Hỏi đáp", icon: HelpCircle },
];

export function HomeHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const mustChangePassword = session?.user?.mustChangePassword === true;
  const portal = role ? ROLE_PORTAL[role] : undefined;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-4 py-2.5 shadow-2xs backdrop-blur-md sm:px-6 lg:px-8 lg:py-3.5">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-x-4">
        {/* Logo & University Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <HoverLogo sizeClass="size-10 sm:size-11" />
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-black uppercase text-[#0F2744] tracking-tight group-hover:text-[#164E9B] transition-colors">
              Trường Đại học An Giang
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#164E9B] tracking-wide">
              ĐẠI HỌC QUỐC GIA TP. HỒ CHÍ MINH
            </span>
          </div>
        </Link>

        <nav
          aria-label="Điều hướng cổng thông tin"
          className="order-last col-span-2 flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 lg:order-none lg:col-span-1"
        >
          {NAV_ITEMS.map(({ href, homeHref, label, shortLabel, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={pathname === "/" ? homeHref : href}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#164E9B] sm:px-3 ${
                  isActive
                    ? "bg-blue-100 text-[#164E9B] ring-1 ring-blue-200 ring-inset"
                    : "text-slate-700 hover:bg-blue-50 hover:text-[#164E9B]"
                }`}
              >
                <Icon className="size-4 shrink-0 text-[#164E9B]" aria-hidden="true" />
                <span className="sm:hidden">{shortLabel}</span>
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Chỉ hiển thị cổng phù hợp với vai trò hiện tại */}
        <div className="flex items-center gap-2">
          {status !== "loading" && (
            <Link
              href={mustChangePassword ? "/login" : portal?.href ?? "/login"}
              className="inline-flex items-center gap-2 rounded-xl bg-[#164E9B] px-4 py-2 text-xs font-bold text-white hover:bg-[#113E7D] transition-all shadow-xs hover:shadow-sm"
            >
              {mustChangePassword ? (
                <span>Đổi mật khẩu để tiếp tục</span>
              ) : (
                <span>{portal?.label ?? "Đăng nhập"}</span>
              )}
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
