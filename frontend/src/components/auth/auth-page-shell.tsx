'use client';

import { useState, type ReactNode } from "react";
import localFont from "next/font/local";
import { HoverLogo } from "./login/login-form";
import { Home, PhoneCall } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const plusJakartaSans = localFont({
  src: [
    {
      path: "../../../public/fonts/PlusJakartaSans-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../../../public/fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export function AuthPageShell({ children, contentPage = false }: { children: ReactNode; contentPage?: boolean }) {
  const [headerHovered, setHeaderHovered] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`${plusJakartaSans.className} ${contentPage ? "min-h-dvh" : "h-dvh overflow-hidden"} flex w-full flex-col bg-[#F4F7FC] text-[#475467] antialiased selection:bg-[#EAF2FF] selection:text-[#155EEF]`}
      style={{ fontFamily: plusJakartaSans.style.fontFamily }}
    >
      {/* 2. HEADER: Cố định 72px, nền trắng, viền dưới tinh tế */}
      <header className="sticky top-0 z-50 h-[72px] shrink-0 w-full border-b border-[#D0D5DD] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Left: Logo 1 -> Logo 2 on hover và CỔNG THÔNG TIN SAU ĐẠI HỌC */}
          <Link
            href="/"
            onMouseEnter={() => setHeaderHovered(true)}
            onMouseLeave={() => setHeaderHovered(false)}
            className="header-brand-link group flex items-center gap-2.5 sm:gap-3 transition-opacity"
          >
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-[#D0D5DD]/70 bg-white p-1 shadow-xs transition-all duration-300 group-hover:border-[#155EEF] group-hover:shadow-md">
              <HoverLogo sizeClass="h-full w-full" forceHovered={headerHovered} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold tracking-tight sm:tracking-wide text-[#172B4D] uppercase transition-colors group-hover:text-[#155EEF]">
                CỔNG THÔNG TIN SAU ĐẠI HỌC
              </span>
              <span className="text-[11px] font-medium text-[#667085] hidden md:block">
                Trường Đại học An Giang • ĐHQG-HCM
              </span>
            </div>
          </Link>

          <nav className="flex shrink-0 items-center gap-1 sm:gap-2" aria-label="Điều hướng chính">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#475467] transition-all hover:bg-[#EAF2FF] hover:text-[#155EEF]"
            >
              <Home className="h-4 w-4 max-[360px]:hidden" aria-hidden="true" />
              <span>Trang chủ</span>
            </Link>
            <Link
              href="/contact"
              aria-current={pathname === "/contact" ? "page" : undefined}
              className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#475467] transition-all hover:bg-[#EAF2FF] hover:text-[#155EEF] aria-[current=page]:bg-[#EAF2FF] aria-[current=page]:text-[#155EEF]"
            >
              <PhoneCall className="h-4 w-4 max-[360px]:hidden" aria-hidden="true" />
              <span>Liên hệ</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className={contentPage ? "w-full flex-1 px-4 py-8 sm:px-6 sm:py-12" : "flex flex-1 items-center justify-center overflow-y-auto p-3 sm:p-4 lg:p-6"}>
        {children}
      </main>

      <footer className="sticky bottom-0 z-40 shrink-0 w-full border-t border-[#D0D5DD] bg-white py-2.5 px-3 sm:px-6 shadow-[0_-1px_2px_rgba(16,24,40,0.02)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3.5 gap-y-1 text-[11px] text-[#475467] sm:justify-end sm:text-xs">
          <Link href="/privacy" aria-current={pathname === "/privacy" ? "page" : undefined} className="font-semibold transition-colors hover:text-[#155EEF] aria-[current=page]:text-[#155EEF]">
            Chính sách bảo mật
          </Link>
          <Link href="/contact" className="font-semibold transition-colors hover:text-[#155EEF]">
            Liên hệ
          </Link>
          <span className="text-[#667085]">
            &copy; {new Date().getFullYear()} Cổng Thông Tin Sau Đại Học
          </span>
        </div>
      </footer>
    </div>
  );
}
