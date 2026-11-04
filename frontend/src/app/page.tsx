"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  ClipboardList,
  BookOpen,
  HelpCircle,
  FileSpreadsheet,
  Download,
  Building2,
  Mail,
  Phone,
  Clock,
  ChevronRight,
  GraduationCap,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { HoverLogo } from "@/src/components/academic";
import { MOCK_FORMS } from "@/src/components/academic/mockData";
import { REGULATIONS_LIST } from "@/src/components/shared/RegulationsView";
import { FAQ_ITEMS } from "@/src/components/shared/FaqContactView";

export default function Home() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F5FA] flex flex-col justify-between antialiased selection:bg-[#164E9B] selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-xl text-xs font-semibold text-emerald-900 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="rounded p-1 hover:bg-emerald-100 text-emerald-700 ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Modern Header / Navbar theo chuẩn Impeccable */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xs transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
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

          {/* Quick Navigation Links (Thủ tục & Biểu mẫu, Quy chế & Quy định, Hỏi đáp & Liên hệ) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <a
              href="#procedures"
              onClick={(e) => scrollToSection(e, "procedures")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#164E9B] hover:bg-blue-50/80 transition-all cursor-pointer"
            >
              <ClipboardList className="size-4 text-[#164E9B]" />
              <span>Thủ tục &amp; Biểu mẫu</span>
            </a>

            <a
              href="#regulations"
              onClick={(e) => scrollToSection(e, "regulations")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#164E9B] hover:bg-blue-50/80 transition-all cursor-pointer"
            >
              <BookOpen className="size-4 text-[#164E9B]" />
              <span>Quy chế &amp; Quy định</span>
            </a>

            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, "faq")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#164E9B] hover:bg-blue-50/80 transition-all cursor-pointer"
            >
              <HelpCircle className="size-4 text-[#164E9B]" />
              <span>Hỏi đáp &amp; Liên hệ</span>
            </a>
          </nav>

          {/* Portal Access Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/student/progress"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white hover:text-[#164E9B] hover:border-blue-200 transition-all shadow-2xs"
            >
              <GraduationCap className="size-3.5 text-[#164E9B]" />
              <span>Cổng NCS</span>
            </Link>

            <Link
              href="/supervisor/dashboard"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white hover:text-[#164E9B] hover:border-blue-200 transition-all shadow-2xs"
            >
              <UserCheck className="size-3.5 text-emerald-600" />
              <span>Cổng GVHD</span>
            </Link>

            <Link
              href="/academic"
              className="inline-flex items-center gap-2 rounded-xl bg-[#164E9B] px-4 py-2 text-xs font-bold text-white hover:bg-[#113E7D] transition-all shadow-xs hover:shadow-sm"
            >
              <span>Vào Cổng SĐH</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-12 sm:space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* HERO SECTION */}
        <section className="text-center space-y-5 max-w-4xl mx-auto pt-4 sm:pt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 border border-blue-200 px-4 py-1 text-xs font-bold text-[#164E9B]">
            <ShieldCheck className="size-4" />
            <span>Hệ thống Quản lý Đào tạo Sau Đại học • AGU SRS v2.0 (ĐHQG-HCM)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F2744] tracking-tight leading-tight">
            Cổng Thông tin &amp; Quản trị Đào tạo Sau Đại học
          </h1>

          <p className="max-w-3xl mx-auto text-slate-600 text-sm sm:text-base leading-relaxed">
            Nền tảng số hóa toàn diện quy trình đào tạo Tiến sĩ tại Trường Đại học An Giang: Theo dõi 9 mốc đào tạo, xét duyệt minh chứng 2 cấp, kiểm soát tự động định mức hướng dẫn BR-09 và chuẩn đầu ra công bố khoa học quốc tế.
          </p>

          {/* 3 Portal Entry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left pt-6">
            {/* Academic Staff Portal */}
            <Link
              href="/academic"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#164E9B] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-[#164E9B] group-hover:bg-[#164E9B] group-hover:text-white transition-colors">
                  <ShieldCheck className="size-6" />
                </div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-[#164E9B] transition-colors">
                  Cổng Cán bộ Giáo vụ
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Quản lý hồ sơ 18 NCS, xét duyệt minh chứng 2 cấp, thẩm định điểm bài báo WoS/Scopus và giám sát hạn ngạch GVHD toàn trường.
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-bold text-[#164E9B] group-hover:translate-x-1 transition-transform">
                <span>Truy cập Cổng Giáo vụ</span>
                <ChevronRight className="size-4 ml-1" />
              </div>
            </Link>

            {/* Supervisor Portal */}
            <Link
              href="/supervisor/dashboard"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <UserCheck className="size-6" />
                </div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Cổng Giảng viên Hướng dẫn
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bàn làm việc số của GVHD: Theo dõi danh sách NCS hướng dẫn, nhận xét báo cáo định kỳ 6 tháng và giám sát định mức tải trọng BR-09.
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                <span>Truy cập Bàn làm việc GVHD</span>
                <ChevronRight className="size-4 ml-1" />
              </div>
            </Link>

            {/* Student Portal */}
            <Link
              href="/student/progress"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <GraduationCap className="size-6" />
                </div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  Cổng Nghiên cứu sinh
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tiến trình 9 mốc đào tạo chuẩn hóa: Nộp minh chứng mốc, theo dõi tiến độ phản biện chuyên môn, xem điểm nhận xét và đăng ký bảo vệ.
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition-transform">
                <span>Truy cập Tiến độ NCS</span>
                <ChevronRight className="size-4 ml-1" />
              </div>
            </Link>
          </div>
        </section>

        {/* SECTION 1: THỦ TỤC & BIỂU MẪU HỌC VỤ (id="procedures") */}
        <section id="procedures" className="scroll-mt-24 space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164E9B] uppercase tracking-wider mb-1">
                <ClipboardList className="size-4" />
                <span>Nghiệp vụ học vụ chuẩn</span>
              </div>
              <h2 className="text-2xl font-black text-[#0F2744] tracking-tight">
                Thủ tục &amp; Biểu mẫu Học vụ Sau Đại học
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Tải các văn bản mẫu quy chuẩn và hướng dẫn thực hiện quy trình đào tạo tiến sĩ AGU &amp; ĐHQG-HCM.
              </p>
            </div>
            <Link
              href="/academic/procedures"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164E9B] hover:text-[#113E7D] transition-colors"
            >
              <span>Xem toàn bộ 23 thủ tục &amp; biểu mẫu</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Quick Forms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_FORMS.map((form, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-[#164E9B] hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#164E9B] group-hover:bg-[#164E9B] group-hover:text-white transition-colors">
                    <FileSpreadsheet className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] font-bold text-[#164E9B] block">
                      {form.code}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 truncate" title={form.name}>
                      {form.name}
                    </h3>
                    <span className="text-[10px] text-slate-400">
                      Định dạng {form.format} • {form.size}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => triggerToast(`Đang tải tập tin: ${form.code} - ${form.name}`)}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-[#164E9B] hover:border-blue-200 transition-colors shadow-2xs"
                  title="Tải biểu mẫu"
                >
                  <Download className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/academic/procedures"
              className="inline-flex items-center gap-2 rounded-xl border border-[#164E9B] bg-white px-5 py-2.5 text-xs font-bold text-[#164E9B] hover:bg-blue-50 transition-colors shadow-xs"
            >
              <ClipboardList className="size-4" />
              <span>Tra cứu đầy đủ Quy trình thủ tục &amp; Biểu mẫu tải về</span>
            </Link>
          </div>
        </section>

        {/* SECTION 2: QUY CHẾ & QUY ĐỊNH (id="regulations") */}
        <section id="regulations" className="scroll-mt-24 space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <BookOpen className="size-4" />
                <span>Cơ sở pháp lý</span>
              </div>
              <h2 className="text-2xl font-black text-[#0F2744] tracking-tight">
                Quy chế &amp; Quy định Đào tạo Tiến sĩ
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Các quy chế then chốt về định mức hướng dẫn BR-09, chuẩn đầu ra bài báo BR-08 và khung đào tạo.
              </p>
            </div>
            <Link
              href="/academic/regulations"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164E9B] hover:text-[#113E7D] transition-colors"
            >
              <span>Xem chi tiết văn bản quy định</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {REGULATIONS_LIST.slice(0, 4).map((reg) => (
              <div
                key={reg.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#164E9B] transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#164E9B]">{reg.code}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${reg.badgeColor}`}>
                      {reg.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {reg.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {reg.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {reg.authority}
                  </span>
                  <button
                    onClick={() => triggerToast(`Đang tải văn bản quy định: ${reg.file}`)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#164E9B] hover:underline"
                  >
                    <Download className="size-3.5" />
                    <span>Tải PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: HỎI ĐÁP & LIÊN HỆ (id="faq") */}
        <section id="faq" className="scroll-mt-24 space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                <HelpCircle className="size-4" />
                <span>Trợ giúp &amp; Tiếp nhận</span>
              </div>
              <h2 className="text-2xl font-black text-[#0F2744] tracking-tight">
                Hỏi đáp &amp; Thông tin Liên hệ
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Hỗ trợ giải đáp các vướng mắc về học vụ, duyệt minh chứng và tài khoản truy cập.
              </p>
            </div>
            <Link
              href="/academic/faq"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164E9B] hover:text-[#113E7D] transition-colors"
            >
              <span>Xem trang hỏi đáp chi tiết</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* FAQ Previews */}
            <div className="lg:col-span-2 space-y-3">
              {FAQ_ITEMS.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-1.5"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#164E9B]">
                    {item.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {item.question}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Office Contact Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building2 className="size-5 text-[#164E9B]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Phòng Đào tạo Sau Đại học
                </h3>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Building2 className="size-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    Phòng B202, Tòa nhà Hiệu bộ, Số 18 Ung Văn Khiêm, P. Đông Xuyên, TP. Long Xuyên, An Giang.
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="size-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">sdh@agu.edu.vn</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="size-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">(0296) 6256565 (Số lẻ: 1042)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="size-4 text-slate-400 shrink-0" />
                  <span>07:30 - 11:30 | 13:30 - 17:00 (Thứ 2 - 6)</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/academic/faq"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 border border-blue-200 py-2.5 text-xs font-bold text-[#164E9B] hover:bg-[#164E9B] hover:text-white transition-colors"
                >
                  <HelpCircle className="size-4" />
                  <span>Gửi thắc mắc trực tuyến</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <HoverLogo sizeClass="size-8" />
            <div>
              <p className="font-bold text-slate-800">
                Trường Đại học An Giang - Đại học Quốc gia TP. Hồ Chí Minh
              </p>
              <p className="text-[11px] text-slate-400">
                Phòng Đào tạo Sau Đại học • Hệ thống Quản trị Học vụ Tiến sĩ AGU
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <Link href="/academic/procedures" className="hover:text-[#164E9B]">Thủ tục &amp; Biểu mẫu</Link>
            <span>•</span>
            <Link href="/academic/regulations" className="hover:text-[#164E9B]">Quy chế</Link>
            <span>•</span>
            <Link href="/academic/faq" className="hover:text-[#164E9B]">Hỏi đáp</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
