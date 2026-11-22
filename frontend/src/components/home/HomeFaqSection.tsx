"use client";

import Link from "next/link";
import { ArrowRight, Building2, Clock, HelpCircle, Mail, Phone } from "lucide-react";
import { FAQ_ITEMS } from "@/src/components/shared/FaqContactView";

export function HomeFaqSection() {
  return (
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
  );
}
