"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileEdit,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  TopicChangeModal,
  TopicChangeItem,
  MOCK_TOPIC_CHANGES,
} from "@/src/components/academic";

export default function TopicChangesApprovalPage() {
  const [topicChangesList, setTopicChangesList] = useState(MOCK_TOPIC_CHANGES);
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [selectedTopicChange, setSelectedTopicChange] = useState<TopicChangeItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleTopicDecision = (id: string, decision: "approve" | "revise" | "reject", reason?: string) => {
    const item = topicChangesList.find((t) => t.id === id);
    if (!item) return;

    setTopicChangesList((prev) => prev.filter((t) => t.id !== id));
    if (decision === "approve") {
      triggerToast(
        `Đã chấp thuận đề nghị đổi tên đề tài của NCS ${item.studentName}. Quyết định điều chỉnh đã được khởi tạo dự thảo.`
      );
    } else {
      triggerToast(
        `Đã phản hồi yêu cầu giải trình tới NCS ${item.studentName}: "${reason || "Cần làm rõ căn cứ khoa học"}"`
      );
    }
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
          <span className="font-semibold text-slate-700">Duyệt đề nghị đổi đề tài</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
          Duyệt Đề nghị Điều chỉnh Tên Đề tài Luận án Tiến sĩ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          So sánh trực quan đề tài cũ và đề xuất mới, đối chiếu lý do khoa học và ý kiến GVHD trước khi Giáo vụ phê duyệt dự thảo quyết định.
        </p>
      </div>

      {/* Main List */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileEdit className="size-4 text-[#164E9B]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Yêu cầu chờ thẩm định ({topicChangesList.length} hồ sơ)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {topicChangesList.length === 0 ? "Đã xử lý hết" : "Ưu tiên xử lý trong 5 ngày làm việc"}
          </span>
        </div>

        <div className="space-y-4">
          {topicChangesList.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              <CheckCircle2 className="size-10 mx-auto text-emerald-500 mb-2" />
              <p className="font-semibold text-slate-700 text-sm">Tất cả đề nghị điều chỉnh đề tài đã được xử lý xong!</p>
              <p className="text-slate-400 mt-1">Khi có NCS nộp hồ sơ mới, thông báo sẽ hiển thị tại đây.</p>
            </div>
          ) : (
            topicChangesList.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4 transition-all hover:border-[#164E9B]/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 text-[#164E9B] font-bold text-xs">
                      {item.id}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.studentName} ({item.studentCode})
                      </h3>
                      <p className="text-xs text-slate-500">
                        {item.department} • {item.cohort} • Nộp ngày: {item.requestDate}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200 self-start sm:self-auto">
                    Chờ Thẩm định &amp; Phê duyệt
                  </span>
                </div>

                {/* Side by side diff */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Tên đề tài hiện tại (Gốc)
                    </span>
                    <p className="text-sm italic text-slate-700 leading-relaxed">
                      “{item.currentTopic}”
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-1.5 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#164E9B] block">
                      Tên đề tài đề xuất mới
                    </span>
                    <p className="text-sm font-bold italic text-slate-900 leading-relaxed">
                      “{item.proposedTopic}”
                    </p>
                  </div>
                </div>

                {/* Reason & GVHD feedback */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-lg bg-white p-3 border border-slate-200">
                    <strong className="text-slate-800 block mb-1">Căn cứ &amp; Lý do điều chỉnh:</strong>
                    <p className="text-slate-600 italic">{item.reason}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50/70 p-3 border border-emerald-200 text-emerald-950">
                    <strong className="text-emerald-900 block mb-1">
                      Ý kiến GVHD chính ({item.supervisorName}):
                    </strong>
                    <p className="italic">“{item.supervisorOpinion}”</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setSelectedTopicChange(item);
                      setTopicModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    <Eye className="size-4" />
                    <span>Xem chi tiết đối chiếu</span>
                  </button>
                  <button
                    onClick={() => handleTopicDecision(item.id, "approve")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Chấp thuận &amp; Cập nhật QĐ</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Comparison Modal */}
      <TopicChangeModal
        isOpen={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        data={selectedTopicChange}
        onDecision={handleTopicDecision}
      />
    </div>
  );
}
