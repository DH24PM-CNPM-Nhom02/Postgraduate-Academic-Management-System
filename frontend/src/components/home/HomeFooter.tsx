"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { HoverLogo } from "@/src/components/academic/HoverLogo";

export function HomeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white text-xs text-slate-600">
      {/* Main Footer Container */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: University Identity (col-span-5) */}
          <div className="space-y-4 lg:col-span-5">
            <div className="flex items-center gap-3">
              <HoverLogo sizeClass="size-11" />
              <div>
                <p className="text-sm font-black uppercase tracking-tight text-[#0F2744]">
                  Trường Đại học An Giang
                </p>
                <p className="text-xs font-bold text-[#164E9B]">
                  ĐẠI HỌC QUỐC GIA TP. HỒ CHÍ MINH
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-500 max-w-md">
              Cổng Thông tin &amp; Quản trị Đào tạo Sau Đại học là nền tảng quản trị học vụ chuyên sâu phục vụ quản lý tiến độ nghiên cứu, xét duyệt minh chứng chuyên môn và giám sát định mức hướng dẫn khoa học.
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
              <ShieldCheck className="size-4 text-[#164E9B]" />
              <span>Hệ thống Quản lý Học vụ SĐH • Phiên bản 2.5 (AGU SRS)</span>
            </div>
          </div>

          {/* Column 2: Quick Links (col-span-3) */}
          <div className="space-y-3 lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#announcements" className="hover:text-[#164E9B] transition-colors">
                  Thông báo Đào tạo Sau Đại học
                </a>
              </li>
              <li>
                <a href="#timeline" className="hover:text-[#164E9B] transition-colors">
                  Lịch học vụ &amp; Mốc thời gian
                </a>
              </li>
              <li>
                <a href="#training-process" className="hover:text-[#164E9B] transition-colors">
                  Khung quy trình 9 mốc đào tạo
                </a>
              </li>
              <li>
                <a href="#documents" className="hover:text-[#164E9B] transition-colors">
                  Hệ thống biểu mẫu &amp; quy chế
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#164E9B] transition-colors">
                  Hỏi đáp học vụ &amp; Trợ giúp
                </a>
              </li>
              <li>
                <Link href="/login" className="font-semibold text-[#164E9B] hover:underline">
                  Đăng nhập tài khoản hệ thống →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Office (col-span-4) */}
          <div className="space-y-3 lg:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Phòng Đào tạo Sau Đại học
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 shrink-0 text-[#164E9B] mt-0.5" />
                <span>
                  Phòng B202, Tòa nhà Hiệu bộ, Số 18 Ung Văn Khiêm, Phường Đông Xuyên, TP. Long Xuyên, Tỉnh An Giang.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-[#164E9B]" />
                <span>Điện thoại: (0296) 6256565 (Số máy lẻ: 1042)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-[#164E9B]" />
                <span>Email tiếp nhận: sdh@agu.edu.vn</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="size-4 shrink-0 text-[#164E9B] mt-0.5" />
                <span>
                  Giờ làm việc hành chính: Thứ 2 – Thứ 6<br />
                  Sáng: 07:30 – 11:30 | Chiều: 13:30 – 17:00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-10 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © {currentYear} Trường Đại học An Giang - Đại học Quốc gia TP. Hồ Chí Minh. Bảo lưu mọi quyền.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.agu.edu.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#164E9B] transition-colors"
            >
              Cổng thông tin AGU
            </a>
            <span>•</span>
            <a
              href="https://vnuhcm.edu.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#164E9B] transition-colors"
            >
              Đại học Quốc gia TP.HCM
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
