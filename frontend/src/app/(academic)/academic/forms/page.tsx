"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Download,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { MOCK_FORMS } from "@/src/components/academic";

export default function AcademicFormsPage() {
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
          <span className="font-semibold text-slate-700">Biểu mẫu &amp; Đơn từ</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
          Kho Biểu mẫu Quy chuẩn Đào tạo Sau Đại học
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Tải các văn bản mẫu phục vụ nộp hồ sơ đề tài, chuyên đề, báo cáo tiến độ và bảo vệ luận án tiến sĩ.
        </p>
      </div>

      {/* Forms Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileSpreadsheet className="size-4 text-[#164E9B]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Danh mục Biểu mẫu ({MOCK_FORMS.length} văn bản mẫu)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_FORMS.map((form, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 hover:border-[#164E9B] hover:bg-white transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#164E9B]">
                  <FileSpreadsheet className="size-4.5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#164E9B] block">
                    {form.code}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{form.name}</h3>
                  <span className="text-[10px] text-slate-400">
                    {form.format} • {form.size}
                  </span>
                </div>
              </div>

              <button
                onClick={() => triggerToast(`Đang tải tập tin: ${form.code} - ${form.name}`)}
                className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-[#164E9B] transition-colors"
                title="Tải biểu mẫu"
              >
                <Download className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
