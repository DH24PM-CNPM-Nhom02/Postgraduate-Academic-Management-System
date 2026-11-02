"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ClipboardList,
  FileSpreadsheet,
  Download,
  Search,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  Filter,
} from "lucide-react";
import { MOCK_PROCEDURES, MOCK_FORMS } from "@/src/components/academic/mockData";

export interface ProceduresFormsViewProps {
  roleContext?: "academic" | "supervisor" | "student" | "public";
  backHref?: string;
  backLabel?: string;
}

export function ProceduresFormsView({
  roleContext = "academic",
  backHref,
  backLabel,
}: ProceduresFormsViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "procedures" | "forms">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const defaultBackHref =
    backHref ||
    (roleContext === "academic"
      ? "/academic"
      : roleContext === "supervisor"
      ? "/supervisor/dashboard"
      : roleContext === "student"
      ? "/student/progress"
      : "/");

  const defaultBackLabel =
    backLabel ||
    (roleContext === "academic"
      ? "Tổng quan học vụ"
      : roleContext === "supervisor"
      ? "Bàn làm việc GVHD"
      : roleContext === "student"
      ? "Tiến độ đào tạo NCS"
      : "Trang chủ");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    MOCK_PROCEDURES.forEach((p) => set.add(p.category));
    return ["ALL", ...Array.from(set)];
  }, []);

  const filteredProcedures = useMemo(() => {
    return MOCK_PROCEDURES.filter((proc) => {
      const matchCategory = selectedCategory === "ALL" || proc.category === selectedCategory;
      const matchQuery =
        proc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.forms.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchTerm]);

  const filteredForms = useMemo(() => {
    return MOCK_FORMS.filter((form) => {
      return (
        form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm]);

  return (
    <div className="space-y-6">
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

      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Link href={defaultBackHref} className="hover:text-[#164E9B] flex items-center gap-1 font-medium transition-colors">
            <ArrowLeft className="size-3.5" />
            <span>{defaultBackLabel}</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Thủ tục &amp; Biểu mẫu học vụ</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
              Thủ tục &amp; Biểu mẫu Học vụ Sau Đại học
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Tra cứu quy trình 23 nghiệp vụ đào tạo tiến sĩ và tải các văn bản, mẫu đơn quy chuẩn ban hành bởi AGU &amp; ĐHQG-HCM.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-[#164E9B]">
              <Sparkles className="size-3.5 text-[#164E9B]" />
              <span>Quy chế BR-08 &amp; BR-09</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search & Tabs Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-3.5 py-1.5 transition-all ${
                activeTab === "all"
                  ? "bg-white text-[#164E9B] shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              Tất cả ({MOCK_PROCEDURES.length + MOCK_FORMS.length})
            </button>
            <button
              onClick={() => setActiveTab("procedures")}
              className={`rounded-lg px-3.5 py-1.5 transition-all flex items-center gap-1.5 ${
                activeTab === "procedures"
                  ? "bg-white text-[#164E9B] shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              <ClipboardList className="size-3.5" />
              <span>Thủ tục &amp; Quy trình ({MOCK_PROCEDURES.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("forms")}
              className={`rounded-lg px-3.5 py-1.5 transition-all flex items-center gap-1.5 ${
                activeTab === "forms"
                  ? "bg-white text-[#164E9B] shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              <FileSpreadsheet className="size-3.5" />
              <span>Kho Biểu mẫu tải về ({MOCK_FORMS.length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm thủ tục, mã quy trình, tên biểu mẫu..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#164E9B] focus:bg-white focus:outline-hidden transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills (khi hiển thị thủ tục) */}
        {activeTab !== "forms" && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 border-t border-slate-100 text-xs">
            <span className="text-slate-400 flex items-center gap-1 text-[11px] font-semibold pr-1">
              <Filter className="size-3" />
              Lọc danh mục:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#164E9B] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "ALL" ? "Tất cả danh mục" : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 1: KHO BIỂU MẪU QUY CHUẨN (Hiển thị khi activeTab === 'all' hoặc 'forms') */}
      {(activeTab === "all" || activeTab === "forms") && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-[#164E9B]">
                <FileSpreadsheet className="size-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Kho Biểu mẫu Quy chuẩn Tải nhanh ({filteredForms.length} biểu mẫu)
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Định dạng Word (.docx) &amp; Excel (.xlsx) chuẩn AGU
            </span>
          </div>

          {filteredForms.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Không tìm thấy biểu mẫu nào khớp với từ khóa tìm kiếm.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredForms.map((form, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 hover:border-[#164E9B] hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#164E9B] group-hover:bg-[#164E9B] group-hover:text-white transition-colors">
                      <FileText className="size-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] font-bold text-[#164E9B] block">
                        {form.code}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 truncate" title={form.name}>
                        {form.name}
                      </h3>
                      <span className="text-[10px] text-slate-500">
                        {form.format} • {form.size}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      triggerToast(`Đang tải tập tin biểu mẫu: ${form.code} - ${form.name}`)
                    }
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-[#164E9B] hover:border-blue-200 transition-colors shadow-2xs"
                    title={`Tải xuống ${form.code}`}
                  >
                    <Download className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: DANH MỤC THỦ TỤC & QUY TRÌNH ĐÀO TẠO (Hiển thị khi activeTab === 'all' hoặc 'procedures') */}
      {(activeTab === "all" || activeTab === "procedures") && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-[#164E9B]">
                <ClipboardList className="size-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Danh mục Quy trình &amp; Thủ tục Học vụ ({filteredProcedures.length} quy trình)
              </h2>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Kèm biểu mẫu đính kèm theo từng bước
            </span>
          </div>

          {filteredProcedures.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Không tìm thấy thủ tục nào khớp với điều kiện lọc.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProcedures.map((proc) => (
                <div
                  key={proc.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3.5 hover:border-[#164E9B] hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-[#164E9B] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {proc.code}
                      </span>
                      <span className="rounded bg-slate-200 px-2 py-0.5 font-semibold text-slate-700">
                        {proc.category}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {proc.title}
                    </h3>

                    <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                      {proc.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                      <Clock className="size-3 text-slate-400 shrink-0" />
                      <span>Thời hạn: {proc.timeline}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-2.5 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Biểu mẫu đính kèm thủ tục:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proc.forms.map((f, idx) => (
                        <button
                          key={idx}
                          onClick={() => triggerToast(`Đang tải tập tin biểu mẫu học vụ: ${f}`)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-[#164E9B] border border-blue-200 hover:bg-blue-50 transition-colors shadow-2xs"
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
          )}
        </div>
      )}
    </div>
  );
}

export default ProceduresFormsView;
