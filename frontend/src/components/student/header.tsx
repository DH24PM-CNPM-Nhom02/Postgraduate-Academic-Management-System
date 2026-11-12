"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  Menu,
  LogOut,
  User,
  Shield,
  ChevronDown,
  BookOpen,
  X,
  ClipboardList,
  FileEdit,
  Award,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { HoverLogo } from "./HoverLogo";
import { NotificationBellPopover } from "@/src/components/notification";

interface StudentHeaderProps {
  onToggleSidebar?: () => void;
}

const HANDBOOK_LINKS = [
  {
    title: "Quy chế Đào tạo Tiến sĩ (BR-08)",
    description: "Quy định 9 mốc đào tạo, điều kiện xét duyệt và thời hạn 72 tháng.",
    href: "/student/regulations",
    icon: BookOpen,
  },
  {
    title: "Thủ tục & Biểu mẫu học vụ",
    description: "Tải biểu mẫu PDF nộp minh chứng, bảo vệ cấp cơ sở và cấp trường.",
    href: "/student/procedures",
    icon: ClipboardList,
  },
  {
    title: "Đơn đề nghị điều chỉnh & Gia hạn",
    description: "Quy trình nộp đơn đổi đề tài, đổi GVHD và gia hạn học tập tối đa 24 tháng.",
    href: "/student/extensions",
    icon: FileEdit,
  },
  {
    title: "Điều kiện xét tốt nghiệp NCS",
    description: "Theo dõi 6 tiêu chí xét công nhận tốt nghiệp tiến sĩ.",
    href: "/student/graduation",
    icon: Award,
  },
  {
    title: "Hỏi đáp & Liên hệ Giáo vụ SĐH",
    description: "Giải đáp thắc mắc và thông tin liên hệ Phòng Đào tạo Sau đại học AGU.",
    href: "/student/faq",
    icon: HelpCircle,
  },
];

function StudentHandbookDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-[#0F2744]/45 backdrop-blur-xs"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border bg-card px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#164E9B]/10 text-[#164E9B]">
              <BookOpen className="size-5" />
            </div>
            <div>
              <h2
                id={titleId}
                className="text-base font-bold tracking-tight text-foreground"
              >
                Sổ tay Nghiên cứu sinh AGU
              </h2>
              <p className="text-xs text-muted-foreground">
                Hướng dẫn nhanh quy trình đào tạo tiến sĩ và các trang tra cứu chính thức
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng sổ tay nghiên cứu sinh"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-5">
          <div className="rounded-xl bg-[#164E9B]/6 p-4 text-xs leading-relaxed text-foreground">
            <p className="font-semibold text-[#0F2744]">
              Tóm tắt lưu ý học vụ trọng tâm:
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-muted-foreground">
              <li>
                Minh chứng ở từng mốc sử dụng duy nhất định dạng PDF, dung lượng
                tối đa 15MB (riêng Mốc 8 cần gộp toàn bộ bài báo vào 1 file PDF).
              </li>
              <li>
                Thời hạn đào tạo tối đa là 72 tháng; gia hạn học tập tích lũy
                không vượt quá 24 tháng sau khi đã đạt Mốc 2.
              </li>
              <li>
                Đủ 6/6 điều kiện tốt nghiệp mới đủ điều kiện đưa vào danh sách
                xét công nhận tốt nghiệp cấp Trường.
              </li>
            </ul>
          </div>

          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {HANDBOOK_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-start justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50 focus-visible:bg-muted/60 focus-visible:outline-none"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-[#164E9B]">
                      <Icon className="size-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground sm:text-sm">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="mt-1 size-4 shrink-0 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-border bg-muted/30 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-[#164E9B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}

export function StudentHeader({ onToggleSidebar }: StudentHeaderProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [handbookOpen, setHandbookOpen] = useState(false);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dropdownOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
        {/* Left: Mobile Toggle & Brand Identity đồng bộ toàn hệ thống */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] lg:hidden"
            aria-label="Mở danh mục điều hướng"
          >
            <Menu className="size-5" />
          </button>

          <div className="flex items-center gap-3">
            <Link
              href="/student/progress"
              className="flex items-center gap-2.5 transition-transform hover:scale-102 motion-reduce:hover:scale-100"
            >
              <HoverLogo sizeClass="size-8.5" />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase leading-none tracking-tight text-[#0F2744] sm:text-sm">
                  TRƯỜNG ĐẠI HỌC AN GIANG – ĐHQG-HCM
                </span>
                <span className="mt-0.5 text-[10px] font-semibold text-[#164E9B] sm:text-[11px]">
                  Cổng Quản lý Đào tạo Sau Đại học • Nghiên cứu sinh
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sổ tay Nghiên cứu sinh modal trigger */}
          <button
            type="button"
            onClick={() => setHandbookOpen(true)}
            className="hidden h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-[#164E9B] hover:bg-white hover:text-[#164E9B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] md:inline-flex"
          >
            <BookOpen className="size-3.5 text-[#164E9B]" />
            <span>Sổ tay Nghiên cứu sinh</span>
          </button>

          {/* Notifications Popover */}
          <NotificationBellPopover role="student" />

          <div className="h-6 w-px bg-slate-200" aria-hidden="true" />

          {/* User profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
              className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#164E9B] text-xs font-bold text-white shadow-2xs">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "N"}
              </div>
              <div className="hidden text-left md:block">
                <p className="line-clamp-1 text-xs font-bold text-slate-900">
                  {user?.fullName || "Nguyễn Văn A"}
                </p>
                <p className="text-[10px] font-medium text-slate-500">
                  {user?.username ? `Mã NCS: ${user.username}` : "NCS Khóa 32"}
                </p>
              </div>
              <ChevronDown className="size-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  aria-hidden="true"
                  onClick={() => setDropdownOpen(false)}
                />
                <div
                  role="menu"
                  aria-label="Menu tài khoản nghiên cứu sinh"
                  className="absolute right-0 top-full z-40 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                >
                  <div className="border-b border-slate-100 px-3 py-2.5">
                    <p className="text-xs font-bold text-slate-900">
                      {user?.fullName || "Nguyễn Văn A"}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {user?.email ||
                        (user?.username
                          ? `${user.username}@agu.edu.vn`
                          : "a.nguyen@agu.edu.vn")}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      role="menuitem"
                      href="/student/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none"
                    >
                      <User className="size-4 text-slate-400" />
                      <span>Hồ sơ nghiên cứu sinh</span>
                    </Link>
                    <Link
                      role="menuitem"
                      href="/student/profile?tab=security"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none"
                    >
                      <Shield className="size-4 text-slate-400" />
                      <span>Đổi mật khẩu &amp; Bảo mật</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 focus-visible:bg-rose-50 focus-visible:outline-none"
                    >
                      <LogOut className="size-4" />
                      <span>Đăng xuất tài khoản</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {handbookOpen && (
        <StudentHandbookDialog onClose={() => setHandbookOpen(false)} />
      )}
    </>
  );
}

export default StudentHeader;
