"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Clock,
  History,
  FileText,
} from "lucide-react";

export type ApprovalDecision = "approve" | "revise" | "reject";

export interface ApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: {
    decision: ApprovalDecision;
    notes: string;
    score?: number;
  }) => void;
  recordTitle?: string;
  studentName?: string;
  studentCode?: string;
  milestoneName?: string;
  currentStep?: "gvhd_confirm" | "academic_review";
}

export function ApprovalDialog({
  isOpen,
  onClose,
  onSubmit,
  recordTitle = "Minh chứng Báo cáo chuyên đề tiến sĩ 01",
  studentName = "Nguyễn Văn An",
  studentCode = "NCS230104",
  milestoneName = "Mốc 3: Báo cáo chuyên đề 1",
  currentStep = "gvhd_confirm",
}: ApprovalDialogProps) {
  const [decision, setDecision] = useState<ApprovalDecision>("approve");
  const [notes, setNotes] = useState("");
  const [score, setScore] = useState<string>("8.5");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((decision === "reject" || decision === "revise") && !notes.trim()) {
      setValidationError("Bắt buộc phải nhập lý do và căn cứ nhận xét khi Từ chối hoặc Yêu cầu bổ sung.");
      return;
    }
    setValidationError(null);
    setIsConfirming(true);
  };

  const handleFinalConfirm = () => {
    onSubmit({
      decision,
      notes,
      score: score ? parseFloat(score) : undefined,
    });
    setIsConfirming(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#164E9B] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white shadow-xs">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {currentStep === "gvhd_confirm"
                  ? "Xác nhận chuyên môn từ Giảng viên Hướng dẫn"
                  : "Thẩm định & Phê duyệt minh chứng học vụ"}
              </h2>
              <p className="text-xs text-white/80">
                NCS: <strong className="text-white">{studentName}</strong> ({studentCode}) • {milestoneName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Workflow Tracker Stepper */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold">
                ✓
              </span>
              <span>1. NCS nộp minh chứng</span>
            </div>
            <ArrowRight className="size-3.5 text-slate-300" />
            <div
              className={`flex items-center gap-2 ${
                currentStep === "gvhd_confirm"
                  ? "text-[#164E9B] font-bold"
                  : "text-emerald-700"
              }`}
            >
              <span
                className={`flex size-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  currentStep === "gvhd_confirm"
                    ? "bg-[#164E9B] text-white ring-2 ring-[#164E9B]/30"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                2
              </span>
              <span>2. GVHD xác nhận</span>
            </div>
            <ArrowRight className="size-3.5 text-slate-300" />
            <div
              className={`flex items-center gap-2 ${
                currentStep === "academic_review"
                  ? "text-[#164E9B] font-bold"
                  : "text-slate-400"
              }`}
            >
              <span
                className={`flex size-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  currentStep === "academic_review"
                    ? "bg-[#164E9B] text-white ring-2 ring-[#164E9B]/30"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                3
              </span>
              <span>3. Giáo vụ/ĐVCM duyệt</span>
            </div>
          </div>
        </div>

        {/* Content Form */}
        {!isConfirming ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Record summary card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs text-slate-700 flex items-start gap-3">
              <FileText className="size-5 shrink-0 text-[#164E9B] mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-slate-900 block truncate">{recordTitle}</span>
                <span className="text-slate-500">
                  Tập tin minh chứng: <code className="bg-white px-1.5 py-0.5 rounded border text-[11px]">Bao_cao_chuyen_de_1_v2.pdf</code> (3.8 MB)
                </span>
              </div>
            </div>

            {/* Decision selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Kết quả đánh giá chuyên môn <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-3 gap-3">
                {/* Approve */}
                <label
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
                    decision === "approve"
                      ? "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 text-emerald-900"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="approve"
                    checked={decision === "approve"}
                    onChange={() => setDecision("approve")}
                    className="sr-only"
                  />
                  <CheckCircle2 className="size-6 text-emerald-600 mb-1" />
                  <span className="text-xs font-bold">Xác nhận Đạt</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Đủ điều kiện chuyển bước
                  </span>
                </label>

                {/* Revise */}
                <label
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
                    decision === "revise"
                      ? "border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 text-amber-900"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="revise"
                    checked={decision === "revise"}
                    onChange={() => setDecision("revise")}
                    className="sr-only"
                  />
                  <AlertTriangle className="size-6 text-amber-600 mb-1" />
                  <span className="text-xs font-bold">Yêu cầu bổ sung</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Cần sửa đổi nộp lại
                  </span>
                </label>

                {/* Reject */}
                <label
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all ${
                    decision === "reject"
                      ? "border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20 text-rose-900"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    value="reject"
                    checked={decision === "reject"}
                    onChange={() => setDecision("reject")}
                    className="sr-only"
                  />
                  <XCircle className="size-6 text-rose-600 mb-1" />
                  <span className="text-xs font-bold">Không duyệt</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Từ chối minh chứng
                  </span>
                </label>
              </div>
            </div>

            {/* Score input (Optional) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Điểm chuyên đề / Đánh giá (Thang điểm 10):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="Ví dụ: 8.5"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Người xác nhận:
                </label>
                <div className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">
                  TS. Bùi Lê Tuấn Anh (Cán bộ GVHD)
                </div>
              </div>
            </div>

            {/* Comments / Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Ý kiến nhận xét & Hướng dẫn chỉnh sửa:
                {(decision === "reject" || decision === "revise") && (
                  <span className="text-rose-500 font-bold ml-1">* (Bắt buộc)</span>
                )}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder={
                  decision === "approve"
                    ? "Nhập nhận xét chuyên môn (không bắt buộc đối với kết quả Đạt)..."
                    : "Mô tả cụ thể nội dung cần hoàn thiện hoặc lý do không phê duyệt để NCS chỉnh sửa..."
                }
                className="w-full rounded-lg border border-slate-300 p-3 text-xs focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B]"
              />
              {validationError && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <ShieldAlert className="size-3.5" />
                  {validationError}
                </p>
              )}
            </div>

            {/* Audit History Snapshot */}
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <History className="size-3.5 text-[#164E9B]" />
                <span>Nhật ký thẩm định trước đó</span>
              </div>
              <p>• 14/10/2026 14:32: NCS Nguyễn Văn An nộp minh chứng phiên bản v2.</p>
              <p>• 14/10/2026 14:30: Hệ thống tự động kiểm tra định dạng PDF hợp lệ (16 trang).</p>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#164E9B] px-5 py-2 text-xs font-bold text-white hover:bg-[#113E7D] transition-colors shadow-xs"
              >
                <CheckCircle2 className="size-4" />
                <span>Tiếp tục & Xác nhận</span>
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Dialog Step */
          <div className="p-6 space-y-5 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <ShieldAlert className="size-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-amber-900">
                <h4 className="font-bold text-sm text-amber-950">
                  Xác nhận lưu quyết định học vụ vĩnh viễn
                </h4>
                <p>
                  Bạn đang ghi nhận kết quả:{" "}
                  <strong className="uppercase">
                    {decision === "approve"
                      ? "Xác nhận Đạt"
                      : decision === "revise"
                      ? "Yêu cầu bổ sung"
                      : "Không duyệt"}
                  </strong>{" "}
                  cho NCS <strong>{studentName}</strong>.
                </p>
                <p className="text-amber-800">
                  Quyết định này sẽ được gửi email thông báo trực tiếp đến NCS và lưu vào nhật ký kiểm toán hệ thống (Audit Trail).
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 text-xs space-y-2 bg-slate-50">
              <div className="flex justify-between">
                <span className="text-slate-500">Mốc đào tạo:</span>
                <span className="font-semibold text-slate-900">{milestoneName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Điểm đánh giá:</span>
                <span className="font-bold text-[#164E9B]">{score || "Chưa nhập"} / 10</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Nhận xét:</span>
                <p className="italic text-slate-700 bg-white p-2 rounded border border-slate-200">
                  {notes || "Đạt yêu cầu học vụ của mốc đào tạo."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Quay lại chỉnh sửa
              </button>
              <button
                type="button"
                onClick={handleFinalConfirm}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <CheckCircle2 className="size-4" />
                <span>Hoàn tất & Ký duyệt</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApprovalDialog;
