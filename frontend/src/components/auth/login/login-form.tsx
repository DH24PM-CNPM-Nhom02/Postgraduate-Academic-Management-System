'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/use-auth';
import { User, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import truongDHAGImg from '@/image/TruongDHAG.webp';
import logo1 from '@/image/logo 1.png';
import logo2 from '@/image/logo 2.png';

/**
 * Reusable HoverLogo component:
 * Displays Logo 1 by default, smoothly transitions to Logo 2 on mouse hover
 */
export function HoverLogo({
  sizeClass = "h-11 w-11",
  containerClass = "",
  forceHovered,
}: {
  sizeClass?: string;
  containerClass?: string;
  forceHovered?: boolean;
}) {
  const [internalHover, setInternalHover] = useState(false);
  const active = forceHovered !== undefined ? forceHovered : internalHover;

  return (
    <div
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
      className={`logo-swap-box relative cursor-pointer select-none transition-transform duration-300 hover:scale-105 ${sizeClass} ${containerClass}`}
      title="Trường Đại học An Giang - ĐHQG TP.HCM"
    >
      <style>{`
        .logo-swap-box:hover .img-logo-1,
        .header-brand-link:hover .img-logo-1 {
          opacity: 0 !important;
          transform: scale(0.85) rotate(6deg) !important;
        }
        .logo-swap-box:hover .img-logo-2,
        .header-brand-link:hover .img-logo-2 {
          opacity: 1 !important;
          transform: scale(1) rotate(0deg) !important;
        }
      `}</style>
      <Image
        src={logo1}
        alt="Logo Cổng Thông Tin Sau Đại Học"
        fill
        sizes="64px"
        priority
        className="img-logo-1 object-contain pointer-events-none"
        style={{
          opacity: active ? 0 : 1,
          transform: active ? 'scale(0.85) rotate(6deg)' : 'scale(1) rotate(0deg)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <Image
        src={logo2}
        alt="Logo Trường Đại Học An Giang"
        fill
        sizes="64px"
        priority
        className="img-logo-2 object-contain pointer-events-none"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? 'scale(1) rotate(0deg)' : 'scale(0.85) rotate(-6deg)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
}

export function LoginForm() {
  const { login, isLoading, error: authError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      errors.username = 'Vui lòng nhập mã số học viên / NCS';
    }
    if (!password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    await login(username.trim(), password);
  }

  return (
    <div className="w-full max-w-md lg:max-w-4xl xl:max-w-[940px] rounded-2xl border border-[#D0D5DD] bg-white shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03),0px_16px_28px_-6px_rgba(16,24,40,0.08)] overflow-hidden transition-all duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[490px] lg:min-h-[520px]">
        {/* Left Column: Login Form (lg:col-span-7) */}
        <div className="flex flex-col justify-between p-5 sm:p-7 lg:p-8 lg:col-span-7">
          <div>
            {/* Brand & Interactive Logo (Logo 1 -> Logo 2 on hover) */}
            <div className="mb-3.5 sm:mb-4 flex flex-col items-start">
              <div
                className="mb-2.5 flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-[#D0D5DD]/70 bg-white p-1.5 shadow-xs ring-4 ring-[#EAF2FF] transition-all duration-300 hover:ring-8 hover:ring-[#EAF2FF] hover:border-[#155EEF]"
                title="Trỏ chuột để xem logo Trường Đại Học An Giang"
              >
                <HoverLogo sizeClass="h-full w-full" />
              </div>
              <span className="mb-1 text-xs font-bold uppercase tracking-wider text-[#155EEF]">
                Đào Tạo Sau Đại Học
              </span>
              <h1 className="text-[26px] sm:text-[30px] lg:text-[32px] font-bold leading-tight tracking-tight text-[#172B4D]">
                Chào mừng bạn trở lại
              </h1>
              <p className="mt-1 text-xs sm:text-sm font-normal text-[#475467]">
                Đăng nhập để tiếp tục hành trình học tập và nghiên cứu.
              </p>
            </div>

            {/* Global Auth Error Alert */}
            {authError && (
              <div
                role="alert"
                className="mb-3.5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <span className="leading-snug">{authError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-3.5">
              {/* Field 1: Mã số học viên */}
              <div className="space-y-1">
                <label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-[#172B4D]">
                  Mã số học viên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#667085]">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (fieldErrors.username) {
                        setFieldErrors((prev) => ({ ...prev, username: undefined }));
                      }
                    }}
                    placeholder="VD: MSHV20240189"
                    disabled={isLoading}
                    className={`w-full rounded-lg border bg-white py-2 sm:py-2.5 pl-10 pr-4 text-sm font-normal text-[#172B4D] placeholder-gray-400 transition-all duration-150 focus:outline-none focus:ring-4 ${
                      fieldErrors.username
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-[#D0D5DD] focus:border-[#155EEF] focus:ring-[#EAF2FF]'
                    }`}
                  />
                </div>
                {fieldErrors.username && (
                  <p className="text-xs font-medium text-red-600 mt-1">{fieldErrors.username}</p>
                )}
              </div>

              {/* Field 2: Mật khẩu */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-[#172B4D]">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#667085]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    placeholder="••••••••••••"
                    disabled={isLoading}
                    className={`w-full rounded-lg border bg-white py-2 sm:py-2.5 pl-10 pr-11 text-sm font-normal text-[#172B4D] placeholder-gray-400 transition-all duration-150 focus:outline-none focus:ring-4 ${
                      fieldErrors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                        : 'border-[#D0D5DD] focus:border-[#155EEF] focus:ring-[#EAF2FF]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition-colors hover:text-[#172B4D] focus:text-[#155EEF] focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs font-medium text-red-600 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Field 3: Ghi nhớ đăng nhập & Quên mật khẩu */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex cursor-pointer select-none items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="h-4 w-4 cursor-pointer rounded border-[#D0D5DD] text-[#155EEF] transition focus:ring-[#155EEF] focus:ring-offset-0"
                  />
                  <span className="text-xs sm:text-sm font-medium text-[#475467]">Ghi nhớ đăng nhập</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="rounded text-xs sm:text-sm font-semibold text-[#155EEF] transition-colors hover:text-[#1248BC] hover:underline focus:outline-none focus:ring-2 focus:ring-[#EAF2FF]"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Primary CTA Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#155EEF] px-4 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#1248BC] active:bg-[#0F3EA4] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-[#EAF2FF] cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng nhập</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Academic Trust & Security Note */}
          <div className="mt-3.5 sm:mt-4 border-t border-gray-100 pt-2.5 text-center">
            <p className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-medium text-[#667085]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Hệ thống bảo mật xác thực chuyên biệt cho Sau đại học</span>
            </p>
          </div>
        </div>

        {/* Right Column: TruongDHAG Image & Academic Highlight (lg:col-span-5) */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#155EEF] to-[#0A2E80] p-7 text-white select-none">
          {/* Background Image */}
          <Image
            src={truongDHAGImg}
            alt="Trường Đại học An Giang - ĐHQG TP.HCM"
            fill
            priority
            className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />

          {/* Subtle gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A30]/95 via-[#0B1A30]/35 to-black/20 pointer-events-none" />

          {/* Top Tag inside Image with Interactive Logo */}
          <div className="relative z-10 flex justify-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/30 cursor-pointer">
              <HoverLogo sizeClass="h-4 w-4" />
              <span>AGU • ĐHQG-HCM</span>
            </div>
          </div>

          {/* Bottom Information overlay */}
          <div className="relative z-10 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-[#155EEF]/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-xs">
              Đào tạo Sau đại học
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight text-white drop-shadow-sm">
                Trường Đại Học An Giang
              </h2>
              <p className="mt-1 text-xs font-medium text-blue-100 tracking-wide">
                Đại học Quốc gia TP. Hồ Chí Minh
              </p>
            </div>
            <p className="text-xs text-white/85 leading-relaxed font-normal">
              Cổng thông tin tích hợp quản lý đề tài nghiên cứu, học phần và tiến độ bảo vệ luận văn, luận án cho học viên cao học & nghiên cứu sinh.
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-white/20 text-[11px] text-white/80 font-medium">
              <span>• Thạc sĩ</span>
              <span>• Tiến sĩ</span>
              <span>• Nghiên cứu chuyên sâu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}