"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { HoverLogo } from "./HoverLogo";

export function AcademicFooter() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-700 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Cột 1: Thông tin cơ quan chủ quản */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <HoverLogo sizeClass="size-8" />
              <span className="text-xs font-black uppercase tracking-wider text-[#0F2744]">
                Trường Đại học An Giang
              </span>
            </div>
            <p className="text-xs font-semibold text-[#164E9B]">
              Đại học Quốc gia TP. Hồ Chí Minh
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Phòng Đào tạo - Bộ phận Quản lý Sau Đại học (Giáo vụ SĐH). Hệ thống thông tin theo dõi tiến độ đào tạo NCS, thẩm định minh chứng học vụ và giám sát định mức hướng dẫn theo quy chế BR-09.
            </p>
          </div>

          {/* Cột 2: Thông tin liên hệ & Giờ làm việc */}
          <div className="space-y-2.5 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Bộ phận Giáo vụ Sau đại học
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin className="size-3.5 shrink-0 text-[#164E9B] mt-0.5" />
                <span>Số 18 Ung Văn Khiêm, P. Đông Xuyên, TP. Long Xuyên, An Giang</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 shrink-0 text-[#164E9B]" />
                <span>(0296) 3843110 (Số máy lẻ: 110 - Bộ phận SĐH)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 shrink-0 text-[#164E9B]" />
                <span>sdh@agu.edu.vn</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500 text-[11px]">
                <Clock className="size-3.5 shrink-0 text-slate-400" />
                <span>Thứ 2 - Thứ 6: 07:30 - 11:30 | 13:30 - 17:00</span>
              </li>
            </ul>
          </div>

          {/* Cột 3: Tra cứu văn bản quy chế */}
          <div className="space-y-2.5 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Văn bản &amp; Quy định Giáo vụ
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <Link
                  href="/academic?tab=regulations"
                  className="hover:text-[#164E9B] hover:underline flex items-center gap-1.5"
                >
                  <BookOpen className="size-3 text-[#164E9B]" />
                  <span>Quy chế Đào tạo Tiến sĩ ĐHQG-HCM</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/academic?tab=supervisors"
                  className="hover:text-[#164E9B] hover:underline flex items-center gap-1.5"
                >
                  <BookOpen className="size-3 text-[#164E9B]" />
                  <span>Quy định định mức GVHD (BR-09)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/academic?tab=procedures"
                  className="hover:text-[#164E9B] hover:underline flex items-center gap-1.5"
                >
                  <BookOpen className="size-3 text-[#164E9B]" />
                  <span>Thủ tục bảo vệ đề cương &amp; luận án</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/academic?tab=forms"
                  className="hover:text-[#164E9B] hover:underline flex items-center gap-1.5"
                >
                  <BookOpen className="size-3 text-[#164E9B]" />
                  <span>Hệ thống biểu mẫu đào tạo tiến sĩ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Thông tin kỹ thuật & Bảo mật */}
          <div className="space-y-2.5 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Hệ thống &amp; An toàn dữ liệu
            </h4>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Mã hóa bảo mật phân quyền RBAC</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Tất cả minh chứng học vụ và quyết định phê duyệt được số hóa, gắn dấu thời gian và lưu trữ an toàn.
              </p>
              <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-1.5 flex justify-between">
                <span>Phân hệ: Academic Affairs Staff</span>
                <span>Build 2026.10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom sub-footer */}
        <div className="mt-8 border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Trường Đại học An Giang - ĐHQG-HCM. Bảo lưu mọi quyền.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <Link href="/academic?tab=regulations" className="hover:text-slate-800">
              Quy định bảo mật
            </Link>
            <span>•</span>
            <Link href="/academic?tab=faq" className="hover:text-slate-800">
              Trợ giúp học vụ
            </Link>
            <span>•</span>
            <a
              href="https://www.agu.edu.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-800 flex items-center gap-1"
            >
              <span>agu.edu.vn</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AcademicFooter;
