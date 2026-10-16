"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileCheck2,
  FileText,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Filter,
} from "lucide-react";
import {
  DocumentPreviewModal,
  ApprovalDialog,
  MOCK_EVIDENCES,
  EvidenceItem,
} from "@/src/components/academic";

export default function EvidenceApprovalPage() {
  const [evidenceFilter, setEvidenceFilter] = useState("all");
  const [evidencesList, setEvidencesList] = useState(MOCK_EVIDENCES);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<EvidenceItem | null>(null);

  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalData, setApprovalData] = useState<EvidenceItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const filteredEvidences = useMemo(() => {
    if (evidenceFilter === "all") return evidencesList;
    if (evidenceFilter === "gvhd") return evidencesList.filter((e) => e.step === "gvhd_confirm");
    if (evidenceFilter === "academic") return evidencesList.filter((e) => e.step === "academic_review");
    return evidencesList;
  }, [evidenceFilter, evidencesList]);

  const handleApprovalSubmit = (result: { decision: string; notes: string; score?: number }) => {
    if (!approvalData) return;
    const actionLabel =
      result.decision === "approve"
        ? "Đã phê duyệt Đạt"
        : result.decision === "revise"
        ? "Đã yêu cầu bổ sung"
        : "Đã từ chối";

    setEvidencesList((prev) => prev.filter((item) => item.id !== approvalData.id));
    triggerToast(
      `${actionLabel} minh chứng cho NCS ${approvalData.studentName}. Hệ thống đã gửi email thông báo và cập nhật tiến độ đào tạo.`
    );
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
          <span className="font-semibold text-slate-700">Duyệt minh chứng học vị &amp; Báo cáo</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
          Hàng chờ Duyệt Minh chứng Học vụ &amp; Báo cáo Chuyên đề
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Thẩm định báo cáo chuyên đề, bài báo khoa học, chứng chỉ tiếng Anh theo luồng duyệt 2 cấp (GVHD xác nhận và Giáo vụ phê duyệt).
        </p>
      </div>

      {/* Status metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tổng hồ sơ tiếp nhận
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-[#164E9B]">
              <FileCheck2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F2744]">{evidencesList.length}</span>
            <span className="text-xs text-slate-500">minh chứng</span>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Chờ GVHD xác nhận
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-900">
              {evidencesList.filter((e) => e.step === "gvhd_confirm").length}
            </span>
            <span className="text-xs text-amber-700">hồ sơ</span>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#164E9B]">
              Chờ Giáo vụ phê duyệt
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-[#164E9B]">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F2744]">
              {evidencesList.filter((e) => e.step === "academic_review").length}
            </span>
            <span className="text-xs text-blue-700">hồ sơ trực tiếp</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-[#164E9B]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Danh sách Minh chứng ({filteredEvidences.length} hồ sơ)
            </h2>
          </div>

          {/* Evidence filter pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setEvidenceFilter("all")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                evidenceFilter === "all" ? "bg-white text-[#164E9B] shadow-2xs font-bold" : "text-slate-600"
              }`}
            >
              Tất cả ({evidencesList.length})
            </button>
            <button
              onClick={() => setEvidenceFilter("gvhd")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                evidenceFilter === "gvhd" ? "bg-white text-[#164E9B] shadow-2xs font-bold" : "text-slate-600"
              }`}
            >
              Chờ GVHD ({evidencesList.filter((e) => e.step === "gvhd_confirm").length})
            </button>
            <button
              onClick={() => setEvidenceFilter("academic")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                evidenceFilter === "academic" ? "bg-white text-[#164E9B] shadow-2xs font-bold" : "text-slate-600"
              }`}
            >
              Chờ Giáo vụ ({evidencesList.filter((e) => e.step === "academic_review").length})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Mã hồ sơ</th>
                <th className="py-3 px-3">NCS nộp</th>
                <th className="py-3 px-3">Mốc đào tạo</th>
                <th className="py-3 px-3">Minh chứng &amp; Tập tin</th>
                <th className="py-3 px-3">Thời gian nộp</th>
                <th className="py-3 px-3">Trạng thái cấp duyệt</th>
                <th className="py-3 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvidences.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileCheck2 className="size-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">Hiện tại không có minh chứng nào trong danh mục này.</p>
                  </td>
                </tr>
              ) : (
                filteredEvidences.map((ev) => (
                  <tr key={ev.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-600">{ev.id}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{ev.studentName}</span>
                      <span className="text-[11px] text-slate-500">{ev.studentCode} • {ev.department}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#164E9B]">{ev.milestone}</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => {
                          setPreviewData(ev);
                          setPreviewModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 text-slate-700 hover:text-[#164E9B]"
                      >
                        <FileText className="size-3.5 text-rose-500" />
                        <span className="font-medium underline truncate max-w-xs">{ev.documentTitle}</span>
                      </button>
                      <span className="text-[10px] text-slate-400">PDF • {ev.fileSize}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{ev.submittedAt}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${ev.badgeColor}`}>
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setPreviewData(ev);
                            setPreviewModalOpen(true);
                          }}
                          className="rounded-lg border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-100"
                          title="Xem trước PDF an toàn"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setApprovalData(ev);
                            setApprovalModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#164E9B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#113E7D] transition-colors shadow-2xs"
                        >
                          <CheckCircle2 className="size-3.5" />
                          <span>Thẩm định</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <DocumentPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        documentTitle={previewData?.documentTitle}
        studentName={previewData?.studentName}
        studentCode={previewData?.studentCode}
        milestoneName={previewData?.milestone}
        submissionDate={previewData?.submittedAt}
        fileSize={previewData?.fileSize}
      />

      <ApprovalDialog
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        onSubmit={handleApprovalSubmit}
        recordTitle={approvalData?.documentTitle}
        studentName={approvalData?.studentName}
        studentCode={approvalData?.studentCode}
        milestoneName={approvalData?.milestone}
        currentStep={approvalData?.step as "gvhd_confirm" | "academic_review" | undefined}
      />
    </div>
  );
}
