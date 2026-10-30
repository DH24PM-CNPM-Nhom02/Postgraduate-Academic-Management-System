"use client";

import React, { useState } from "react";
import {
  X,
  FileEdit,
  CheckCircle2,
  User,
  Calendar,
  Building,
} from "lucide-react";
import type { TopicChangeItem } from "@/src/types/academic";

export type { TopicChangeItem };

export interface TopicChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TopicChangeItem | null;
  onDecision: (id: string, decision: "approve" | "revise" | "reject", reason?: string) => void;
}

export function TopicChangeModal({
  isOpen,
  onClose,
  data,
  onDecision,
}: TopicChangeModalProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#164E9B] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white shadow-xs">
              <FileEdit className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Thẩm định Đề nghị Điều chỉnh Tên Đề tài Luận án
              </h2>
              <p className="text-xs text-white/80">
                Mã yêu cầu: <strong className="text-white">{data.id}</strong> • Nộp ngày: {data.requestDate}
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Student Dossier Quick Info */}
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <User className="size-4 text-[#164E9B]" />
              <div>
                <span className="text-slate-500 block">Nghiên cứu sinh:</span>
                <strong className="text-slate-900">{data.studentName}</strong> ({data.studentCode})
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building className="size-4 text-[#164E9B]" />
              <div>
                <span className="text-slate-500 block">Chuyên ngành &amp; Khóa:</span>
                <span className="font-semibold text-slate-900">{data.department} ({data.cohort})</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-[#164E9B]" />
              <div>
                <span className="text-slate-500 block">GVHD chính:</span>
                <span className="font-semibold text-slate-900">{data.supervisorName}</span>
              </div>
            </div>
          </div>

          {/* Visual Diff: Old Topic vs Proposed Topic */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span>So sánh nội dung đề tài</span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                Đối chiếu thay đổi
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Topic */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600 uppercase tracking-wide">
                    Tên đề tài hiện tại (Gốc)
                  </span>
                  <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    QĐ Giao đề tài 2024
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-800 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200">
                  “{data.currentTopic}”
                </p>
              </div>

              {/* Proposed Topic */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#164E9B] uppercase tracking-wide">
                    Tên đề tài đề xuất mới
                  </span>
                  <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    Đề xuất mới
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-950 leading-relaxed italic bg-white p-3 rounded-lg border border-blue-200 shadow-2xs">
                  “{data.proposedTopic}”
                </p>
              </div>
            </div>
          </div>

          {/* Scientific Rationale from Student */}
          <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Lý do &amp; Căn cứ đề nghị điều chỉnh
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {data.reason}
            </p>
          </div>

          {/* Opinion of Supervisor */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Ý kiến của Giảng viên Hướng dẫn</span>
              </h4>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Đồng ý đề xuất
              </span>
            </div>
            <p className="text-xs text-slate-800 italic bg-white p-3 rounded-lg border border-emerald-100">
              “{data.supervisorOpinion}”
            </p>
            <p className="text-right text-[11px] font-bold text-slate-700">
              Ký duyệt: {data.supervisorName}
            </p>
          </div>

          {/* Reject / Revise reason field if opened */}
          {showRejectInput && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 space-y-2 animate-in fade-in duration-100">
              <label className="block text-xs font-bold text-rose-800">
                Nhập lý do từ chối hoặc nội dung yêu cầu NCS giải trình thêm: <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ví dụ: Đề tài mới mở rộng phạm vi quá lớn so với đề cương ban đầu, cần họp tiểu ban chuyên môn thẩm định..."
                className="w-full rounded-lg border border-rose-300 p-2.5 text-xs focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectInput(false)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!rejectReason.trim()) {
                      alert("Vui lòng nhập lý do cụ thể.");
                      return;
                    }
                    onDecision(data.id, "reject", rejectReason);
                    onClose();
                  }}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                >
                  Xác nhận Từ chối
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>

          <div className="flex items-center gap-2">
            {!showRejectInput && (
              <>
                <button
                  type="button"
                  onClick={() => setShowRejectInput(true)}
                  className="rounded-lg border border-rose-300 bg-white px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                >
                  Từ chối / Yêu cầu giải trình
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDecision(data.id, "approve");
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Chấp thuận &amp; Cập nhật Quyết định</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopicChangeModal;
