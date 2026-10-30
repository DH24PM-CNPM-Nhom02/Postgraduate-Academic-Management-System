"use client";

import React from "react";
import Link from "next/link";
import {
  CalendarDays,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { MOCK_CALENDAR_EVENTS } from "@/src/components/academic";

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
            Kế hoạch đào tạo &amp; Hạn chót sắp tới ({MOCK_CALENDAR_EVENTS.length} sự kiện)
          </h2>
        </div>

        <div className="space-y-3">
          {MOCK_CALENDAR_EVENTS.map((ev) => (
            <div
              key={ev.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 hover:bg-white hover:border-[#164E9B] transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#164E9B] text-white">
                  <CalendarDays className="size-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">{ev.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{ev.scope}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="font-mono text-xs font-bold text-[#164E9B] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                  {ev.date}
                </span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5">
                  {ev.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
