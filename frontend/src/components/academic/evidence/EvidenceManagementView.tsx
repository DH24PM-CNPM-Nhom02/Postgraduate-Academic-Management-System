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
  Loader2,
} from "lucide-react";
import {
  DocumentPreviewModal,
  ApprovalDialog,
  MOCK_EVIDENCES,
} from "@/src/components/academic";
import { useAcademicEvidences } from "@/src/hooks/use-academic";
import type { EvidenceItem } from "@/src/types/academic";

interface EvidenceManagementViewProps {
  embedded?: boolean;
}

export function EvidenceManagementView({ embedded = false }: EvidenceManagementViewProps) {
  // Chỉ gọi hook khi component này được mount!
  const { data: initialData, isLoading } = useAcademicEvidences();

  const [evidenceFilter, setEvidenceFilter] = useState("all");
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const evidencesList = useMemo(() => {
    const base = initialData && Array.isArray(initialData) && initialData.length > 0 ? initialData : MOCK_EVIDENCES;
    return base.filter((item) => !removedIds.includes(item.id));
  }, [initialData, removedIds]);

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

    setRemovedIds((prev) => [...prev, approvalData.id]);
    triggerToast(
      `${actionLabel} minh chứng cho NCS ${approvalData.studentName}. Hệ thống đã gửi email thông báo và cập nhật tiến độ đào tạo.`
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-xl text-xs font-semibold text-emerald-900 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="rounded p-1 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div>
        {!embedded && (
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/academic" className="hover:text-[#164E9B] flex items-center gap-1">
              <ArrowLeft className="size-3" />
              <span>Tổng quan học vụ</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">Duyệt minh chứng học vị &amp; Báo cáo</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
              Hàng chờ Duyệt Minh chứng Học vụ &amp; Báo cáo Chuyên đề
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Thẩm định báo cáo chuyên đề, bài báo khoa học, chứng chỉ tiếng Anh theo luồng duyệt 2 cấp (GVHD xác nhận và Giáo vụ phê duyệt).
            </p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Loader2 className="size-3.5 animate-spin text-[#164E9B]" />
              <span>Đang tải...</span>
            </div>
          )}
        </div>
      </div>

      {/* Status metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tổng hồ sơ tiếp nhận
            </span>
            <FileText className="size-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F2744]">{evidencesList.length}</span>
            <span className="text-xs text-slate-500">minh chứng &amp; báo cáo</span>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Chờ GVHD xác nhận
            </span>
            <Clock className="size-4 text-amber-600" />
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
            <ShieldCheck className="size-4 text-[#164E9B]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F2744]">
              {evidencesList.filter((e) => e.step === "academic_review").length}
            </span>
            <span className="text-xs font-semibold text-[#164E9B]">sẵn sàng thẩm định</span>
          </div>
        </div>
      </div>

      {/* Main List & Filter */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="size-4 text-[#164E9B]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Danh sách Minh chứng cần thẩm định
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-3.5 text-slate-400" />
            <select
              value={evidenceFilter}
              onChange={(e) => setEvidenceFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B] outline-none cursor-pointer"
            >
              <option value="all">Tất cả bước duyệt</option>
              <option value="academic">Chờ Giáo vụ duyệt (Ưu tiên)</option>
              <option value="gvhd">Chờ GVHD xác nhận</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Nghiên cứu sinh</th>
                <th className="py-3 px-3">Mốc đào tạo</th>
                <th className="py-3 px-3">Tài liệu / Minh chứng nộp</th>
                <th className="py-3 px-3">Thời gian nộp</th>
                <th className="py-3 px-3">Bước phê duyệt</th>
                <th className="py-3 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvidences.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="size-8 mx-auto text-emerald-500 mb-2" />
                    <p className="font-semibold text-slate-600">
                      Không còn minh chứng nào trong hàng chờ thẩm định.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEvidences.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{item.studentName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.studentCode} • {item.department}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        {item.milestone}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800 line-clamp-1">{item.documentTitle}</p>
                      <span className="text-[10px] text-slate-400">Dung lượng: {item.fileSize}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {item.submittedAt}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${item.badgeColor}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setPreviewData(item);
                            setPreviewModalOpen(true);
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700 hover:bg-slate-50 shadow-2xs text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="size-3" />
                          <span>Xem</span>
                        </button>
                        <button
                          onClick={() => {
                            setApprovalData(item);
                            setApprovalModalOpen(true);
                          }}
                          className="rounded-lg bg-[#164E9B] px-2.5 py-1 text-white hover:bg-[#123E7C] shadow-2xs text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <FileCheck2 className="size-3" />
                          <span>Duyệt</span>
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

      {/* DOCUMENT PREVIEW MODAL */}
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

      {/* APPROVAL DIALOG */}
      <ApprovalDialog
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        onSubmit={handleApprovalSubmit}
        recordTitle={approvalData?.documentTitle}
        studentName={approvalData?.studentName}
        studentCode={approvalData?.studentCode}
        milestoneName={approvalData?.milestone}
        currentStep={approvalData?.step}
      />
    </div>
  );
}
