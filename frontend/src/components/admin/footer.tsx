"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { HoverLogo } from "@/src/components/academic/HoverLogo";

export function AdminFooter() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-700 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              Phân hệ Quản trị Hệ thống — Giám sát hoạt động đào tạo Sau Đại học.
            </p>
          </div>

          {/* Cột 2: Thông tin liên hệ & Hỗ trợ kỹ thuật */}
          <div className="space-y-2.5 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Quản trị Kỹ thuật &amp; Vận hành
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin className="size-3.5 shrink-0 text-[#164E9B] mt-0.5" />
                <span>Số 18 Ung Văn Khiêm, P. Đông Xuyên, TP. Long Xuyên, An Giang</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 shrink-0 text-[#164E9B]" />
                <span>(0296) 3843110 (Số máy lẻ: 110 - Bộ phận SĐH / CNTT)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 shrink-0 text-[#164E9B]" />
                <span>admin@agu.edu.vn | sdh@agu.edu.vn</span>
              </li>
            </ul>
          </div>

          {/* Cột 3: Quản trị & Điều hướng nhanh */}
          <div className="space-y-2.5 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Quản trị &amp; Nghiệp vụ SĐH
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <Link
                  href="/admin"
                  className="hover:text-[#164E9B] hover:underline flex items-center gap-1.5"
                >
                  <BookOpen className="size-3 text-[#164E9B]" />
                  <span>Quản lý tài khoản &amp; Phân quyền RBAC</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/audit-log"
                  className="hover:text-[#164E9B] hover:underline flex items-center gap-1.5"
                >
                  <BookOpen className="size-3 text-[#164E9B]" />
                  <span>Nhật ký kiểm toán truy vết hệ thống</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/overview"
                  className="hover:text-[#164E9B] hover:underline flex items-center gap-1.5"
                >
                  <BookOpen className="size-3 text-[#164E9B]" />
                  <span>Bàn làm việc Giáo vụ Đào tạo SĐH</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/regulations"
                  className="hover:text-[#164E9B] hover:underline flex items-center gap-1.5"
                >
                  <BookOpen className="size-3 text-[#164E9B]" />
                  <span>Quy chế Đào tạo Tiến sĩ &amp; Định mức BR-09</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom sub-footer */}
        <div className="mt-8 border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Trường Đại học An Giang - ĐHQG-HCM. Bản quyền thuộc Phân hệ Quản trị Hệ thống.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <Link href="/admin/regulations" className="hover:text-slate-800">
              Chính sách bảo mật
            </Link>
            <span>•</span>
            <Link href="/admin/audit-log" className="hover:text-slate-800">
              Nhật ký truy cập
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

export default AdminFooter;
