"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Download,
  ArrowLeft,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { MOCK_PROCEDURES } from "@/src/components/academic";

export default function AcademicProceduresPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-xl text-xs font-semibold text-emerald-900 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="rounded p-1 hover:bg-emerald-100 text-emerald-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Link href="/academic" className="hover:text-[#164E9B] flex items-center gap-1">
            <ArrowLeft className="size-3" />
            <span>Tổng quan học vụ</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700">Thủ tục học vụ</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
          Hệ thống Thủ tục Học vụ &amp; Quy trình Đào tạo Tiến sĩ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Hướng dẫn trình tự xử lý 23 nghiệp vụ đào tạo tiến sĩ và tải các mẫu đơn quy chuẩn ban hành bởi AGU &amp; ĐHQG-HCM.
        </p>
      </div>

      {/* Grid of Procedures */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ClipboardList className="size-4 text-[#164E9B]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Danh mục Thủ tục &amp; Biểu mẫu quy chuẩn ({MOCK_PROCEDURES.length} thủ tục)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_PROCEDURES.map((proc) => (
            <div
              key={proc.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 hover:border-[#164E9B] hover:bg-white transition-all shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-[#164E9B]">{proc.code}</span>
                  <span className="rounded bg-slate-200 px-2 py-0.5 font-semibold text-slate-700">
                    {proc.category}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                  {proc.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2">{proc.description}</p>
                <p className="text-[10px] text-slate-400">Thời gian quy định: {proc.timeline}</p>
              </div>

              <div className="border-t border-slate-200 pt-2.5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Biểu mẫu đính kèm:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {proc.forms.map((f, idx) => (
                    <button
                      key={idx}
                      onClick={() => triggerToast(`Đang tải tập tin biểu mẫu học vụ: ${f}`)}
                      className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-[10px] font-semibold text-[#164E9B] border border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      <Download className="size-3" />
                      <span>{f}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
