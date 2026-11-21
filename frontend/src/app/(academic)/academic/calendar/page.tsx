"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
} from "lucide-react";

export default function AcademicCalendarPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Link href="/academic" className="hover:text-[#164E9B] flex items-center gap-1">
            <ArrowLeft className="size-3" />
            <span>Tổng quan học vụ</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700">Lịch học vụ &amp; Thông báo</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
          Lịch Học vụ &amp; Kế hoạch Đào tạo Sau Đại học
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Theo dõi các mốc thời gian bảo vệ đề cương, thẩm định bài báo và hạn chót nộp báo cáo định kỳ toàn trường.
        </p>
      </div>

      {/* Main Calendar Events List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calendar className="size-4 text-[#164E9B]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Kế hoạch đào tạo &amp; Hạn chót sắp tới (0 sự kiện)
          </h2>
        </div>

        <div className="space-y-3">
          <p className="py-8 text-center text-sm text-slate-500">Chưa có sự kiện học vụ.</p>
        </div>
      </div>
    </div>
  );
}
