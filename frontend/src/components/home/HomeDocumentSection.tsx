"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  Download,
  Eye,
  FileText,
  Info,
  X,
} from "lucide-react";
import type { StaticFormItem, StaticRegulationItem } from "./homeDocumentData";
import { FALLBACK_FORMS, FALLBACK_REGULATIONS } from "./homeDocumentData";

export function HomeDocumentSection() {
  const [selectedDoc, setSelectedDoc] = useState<StaticFormItem | StaticRegulationItem | null>(null);

  const handleDownload = (name: string) => {
    alert(`Đang tải tệp: ${name}\nTài liệu được phát hành chính thức từ Cổng SĐH Trường Đại học An Giang.`);
  };

  return (
    <section id="documents" className="scroll-mt-20 space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164E9B] uppercase tracking-wider mb-1">
            <ClipboardList className="size-4" />
            <span>Văn bản &amp; Biểu mẫu Chính thức</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
            Biểu mẫu Học vụ &amp; Quy định Quy chế
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tài liệu hướng dẫn, biểu mẫu đơn từ và hệ thống văn bản pháp quy đào tạo sau đại học hiện hành
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-[#164E9B]">
          <Link href="/forms" className="hover:underline flex items-center gap-1">
            <span>Tất cả biểu mẫu</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/regulations" className="hover:underline flex items-center gap-1">
            <span>Tất cả quy chế</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* 2-Column Grid: Left (Forms) & Right (Regulations) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Essential Forms */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-[#164E9B]">
                <FileText className="size-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Biểu mẫu học vụ thiết yếu
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {FALLBACK_FORMS.length} biểu mẫu chuẩn
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs divide-y divide-slate-100">
            {FALLBACK_FORMS.map((form) => (
              <div
                key={form.code}
                className="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-slate-50/80 rounded-xl"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      form.format === "XLSX"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-[#164E9B] border border-blue-200"
                    }`}
                  >
                    {form.format}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#164E9B]">
                        {form.code}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600">
                        {form.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                      {form.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Dung lượng: {form.size} • Định dạng {form.format}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedDoc(form)}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    title="Xem chi tiết hướng dẫn"
                    aria-label={`Xem chi tiết ${form.name}`}
                  >
                    <Info className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(form.name)}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-[#164E9B] hover:bg-blue-100 transition-colors"
                    title="Tải biểu mẫu"
                  >
                    <Download className="size-3.5" />
                    <span className="hidden sm:inline">Tải về</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Essential Regulations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                <BookOpen className="size-4" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Văn bản Quy định &amp; Quy chế
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {FALLBACK_REGULATIONS.length} văn bản pháp quy
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs divide-y divide-slate-100">
            {FALLBACK_REGULATIONS.map((reg) => (
              <div
                key={reg.id}
                className="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-slate-50/80 rounded-xl"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                    PDF
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-800">
                        {reg.code}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {reg.date}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                      {reg.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Cơ quan ban hành: {reg.authority}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedDoc(reg)}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    title="Xem tóm tắt nội dung"
                    aria-label={`Xem tóm tắt ${reg.title}`}
                  >
                    <Eye className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(reg.title)}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                    title="Tải văn bản toàn văn"
                  >
                    <Download className="size-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Detail / Summary Modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#164E9B]">
                  {"code" in selectedDoc ? selectedDoc.code : ""}
                </span>
                <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                  {"title" in selectedDoc ? selectedDoc.title : selectedDoc.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                aria-label="Đóng chi tiết"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3.5 text-xs sm:text-sm text-slate-700">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Mục đích &amp; Phạm vi áp dụng
                </h4>
                <p className="leading-relaxed text-slate-600">
                  {selectedDoc.summary}
                </p>
              </div>

              {"keyPoints" in selectedDoc && selectedDoc.keyPoints && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Các điểm trọng tâm
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedDoc.keyPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="flex size-1.5 rounded-full bg-[#164E9B] mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
                <p>
                  Định dạng: <strong>{selectedDoc.format}</strong> • Dung lượng: <strong>{selectedDoc.size}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  const docTitle = "title" in selectedDoc ? selectedDoc.title : selectedDoc.name;
                  handleDownload(docTitle);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#164E9B] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#113E7D]"
              >
                <Download className="size-3.5" />
                <span>Tải tệp tin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
