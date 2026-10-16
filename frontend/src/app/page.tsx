"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, FileCheck2, Gauge } from "lucide-react";
import { HoverLogo } from "@/src/components/academic";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F0F5FA] flex flex-col justify-between antialiased">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/95 px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HoverLogo sizeClass="size-11" />
            <div>
              <h1 className="text-sm font-black uppercase text-[#0F2744]">
                Trường Đại học An Giang - ĐHQG-HCM
              </h1>
              <p className="text-xs font-semibold text-[#164E9B]">
                Hệ thống Quản lý Đào tạo Sau Đại học
              </p>
            </div>
          </div>

          <Link
            href="/academic"
            className="inline-flex items-center gap-2 rounded-xl bg-[#164E9B] px-4 py-2 text-xs font-bold text-white hover:bg-[#113E7D] transition-colors shadow-xs"
          >
            <span>Vào Cổng Giáo vụ SĐH</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      {/* Main Hero Card */}
      <main className="max-w-4xl mx-auto p-6 flex-1 flex flex-col justify-center items-center text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold text-[#164E9B]">
          <ShieldCheck className="size-4" />
          <span>Phân hệ Cán bộ Giáo vụ (Academic Affairs Staff) • AGU SRS v2.0</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-[#0F2744] tracking-tight">
          Cổng Quản lý Giáo vụ Sau Đại học
        </h2>

        <p className="max-w-2xl text-slate-600 text-sm sm:text-base leading-relaxed">
          Giao diện làm việc trung tâm dành cho Cán bộ Quản lý Giáo vụ Sau đại học (Academic Affairs Staff). Hỗ trợ theo dõi tiến độ 18 NCS theo 9 mốc tiến sĩ, duyệt minh chứng 2 cấp, xét duyệt điều chỉnh đề tài và giám sát định mức hướng dẫn toàn trường theo quy chế BR-09.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left my-4">
          <Link
            href="/academic?tab=students"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#164E9B] hover:shadow-md transition-all group"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#164E9B] mb-3 group-hover:bg-[#164E9B] group-hover:text-white transition-colors">
              <Users className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#164E9B] transition-colors">
              Quản lý Nghiên cứu sinh
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Theo dõi 18 NCS, cảnh báo tiến độ đào tạo 72 tháng và thẩm định điểm bài báo WoS/Scopus.
            </p>
          </Link>

          <Link
            href="/academic?tab=evidence"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FileCheck2 className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
              Duyệt Minh chứng &amp; Báo cáo
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Quy trình duyệt 2 cấp (GVHD xác nhận → Giáo vụ phê duyệt) với trình xem trước PDF an toàn.
            </p>
          </Link>

          <Link
            href="/academic?tab=supervisors"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all group"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Gauge className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              Quản lý Hạn ngạch GVHD
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Kiểm soát tự động quy chế BR-09 (Độc lập 1.0, Đồng HD 0.5, tối đa 3.0-4.0 NCS).
            </p>
          </Link>
        </div>

        {/* Primary CTA */}
        <div className="pt-2">
          <Link
            href="/academic"
            className="inline-flex items-center gap-2.5 rounded-xl bg-[#164E9B] px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-[#113E7D] transition-all hover:scale-102"
          >
            <span>Mở Cổng Quản lý Giáo vụ (Academic Affairs)</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        © 2026 Trường Đại học An Giang - Đại học Quốc gia TP. Hồ Chí Minh. Bảo lưu mọi quyền.
      </footer>
    </div>
  );
}
