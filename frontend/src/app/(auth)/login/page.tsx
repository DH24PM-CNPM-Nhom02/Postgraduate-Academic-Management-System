'use client';

import { useState } from "react";
import localFont from "next/font/local";
import { LoginForm, HoverLogo } from "@/src/components/auth/login/login-form";
import { Home, HelpCircle, PhoneCall } from "lucide-react";
import Link from "next/link";

const plusJakartaSans = localFont({
  src: [
    {
      path: "../../../../fonts/PlusJakartaSans-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../../../../fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export default function LoginPage() {
  const [headerHovered, setHeaderHovered] = useState(false);

  return (
    <div
      className={`${plusJakartaSans.className} h-screen w-full flex flex-col justify-between overflow-hidden bg-[#F4F7FC] text-[#475467] antialiased selection:bg-[#EAF2FF] selection:text-[#155EEF]`}
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

          {/* Right: Trang chủ, Hỗ trợ, Liên hệ */}
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Điều hướng chính">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#475467] transition-all hover:bg-[#EAF2FF] hover:text-[#155EEF]"
            >
              <Home className="h-4 w-4" />
              <span className="hidden xs:inline sm:inline">Trang chủ</span>
            </Link>
            <Link
              href="#support"
              className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#475467] transition-all hover:bg-[#EAF2FF] hover:text-[#155EEF]"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden xs:inline sm:inline">Hỗ trợ</span>
            </Link>
            <Link
              href="#contact"
              className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#475467] transition-all hover:bg-[#EAF2FF] hover:text-[#155EEF]"
            >
              <PhoneCall className="h-4 w-4" />
              <span className="hidden xs:inline sm:inline">Liên hệ</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* 3. MAIN LOGIN CARD SECTION: Cố định chính giữa, không xê dịch */}
      <main className="flex flex-1 items-center justify-center p-3 sm:p-4 lg:p-6 overflow-y-auto">
        <LoginForm />
      </main>

      {/* 4. FOOTER: Cố định chân trang, tất cả các mục nằm trên 1 hàng ngang duy nhất */}
      <footer className="sticky bottom-0 z-40 shrink-0 w-full border-t border-[#D0D5DD] bg-white py-2.5 px-3 sm:px-6 shadow-[0_-1px_2px_rgba(16,24,40,0.02)]">
        <div className="mx-auto flex max-w-7xl flex-row items-center justify-center sm:justify-end gap-4">
          {/* Các mục hỗ trợ, chính sách, liên hệ, copyright luôn nằm trên 1 HÀNG NGANG KHÔNG CHỒNG NHAU */}
          <div className="flex flex-row items-center justify-center lg:justify-end gap-x-2 sm:gap-x-3.5 text-[11px] sm:text-xs text-[#475467] w-full lg:w-auto">
            <Link href="#support" className="font-semibold transition-colors hover:text-[#155EEF] shrink-0 whitespace-nowrap">
              Trung tâm hỗ trợ
            </Link>
            <span className="text-[#D0D5DD] font-normal shrink-0">•</span>
            <Link href="#privacy" className="font-semibold transition-colors hover:text-[#155EEF] shrink-0 whitespace-nowrap">
              Chính sách bảo mật
            </Link>
            <span className="text-[#D0D5DD] font-normal shrink-0">•</span>
            <Link href="#contact" className="font-semibold transition-colors hover:text-[#155EEF] shrink-0 whitespace-nowrap">
              Liên hệ
            </Link>
            <span className="text-[#D0D5DD] font-normal shrink-0">•</span>
            <span className="text-[#667085] font-normal shrink-0 whitespace-nowrap">
              &copy; {new Date().getFullYear()} Cổng Thông Tin Sau Đại Học
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
