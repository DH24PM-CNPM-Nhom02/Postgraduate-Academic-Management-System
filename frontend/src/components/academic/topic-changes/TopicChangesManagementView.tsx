"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileEdit,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  TopicChangeModal,
  MOCK_TOPIC_CHANGES,
} from "@/src/components/academic";
import { useAcademicTopicChanges } from "@/src/hooks/use-academic";
import type { TopicChangeItem } from "@/src/types/academic";

interface TopicChangesManagementViewProps {
  embedded?: boolean;
}

export function TopicChangesManagementView({ embedded = false }: TopicChangesManagementViewProps) {
  // Chỉ fetch khi component này được mount!
  const { data: initialData, isLoading } = useAcademicTopicChanges();

  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const topicChangesList = useMemo(() => {
    const base = initialData && Array.isArray(initialData) && initialData.length > 0 ? initialData : MOCK_TOPIC_CHANGES;
    return base.filter((item) => !removedIds.includes(item.id));
  }, [initialData, removedIds]);

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

    setRemovedIds((prev) => [...prev, id]);
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
            <span className="font-semibold text-slate-700">Duyệt đề nghị đổi đề tài</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
              Duyệt Đề nghị Điều chỉnh Tên Đề tài Luận án Tiến sĩ
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              So sánh trực quan đề tài cũ và đề xuất mới, đối chiếu lý do khoa học và ý kiến GVHD trước khi Giáo vụ phê duyệt dự thảo quyết định.
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
                className="rounded-xl border border-slate-200 p-4.5 hover:border-[#164E9B]/40 transition-all space-y-3 bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#0F2744] text-sm">{item.studentName}</span>
                    <span className="font-mono text-xs text-slate-500">({item.studentCode})</span>
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#164E9B]">
                      {item.department}
                    </span>
                    <span className="text-xs text-slate-400">• {item.cohort}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="size-3.5 text-slate-400" />
                    <span>Nộp: {item.requestDate}</span>
                  </div>
                </div>

                {/* Old vs New Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Tên đề tài hiện hành:
                    </span>
                    <p className="font-semibold text-slate-700 italic">“{item.currentTopic}”</p>
                  </div>

                  <div className="rounded-lg bg-blue-50/60 p-3 border border-blue-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#164E9B] block mb-1 flex items-center gap-1">
                      <Sparkles className="size-3 text-[#164E9B]" />
                      Tên đề tài đề xuất mới:
                    </span>
                    <p className="font-bold text-[#0F2744] italic">“{item.proposedTopic}”</p>
                  </div>
                </div>

                {/* Supervisor Opinion & Reason */}
                <div className="rounded-lg bg-slate-50/80 p-3 text-xs space-y-1.5 border border-slate-100">
                  <div className="flex items-start gap-1.5">
                    <strong className="text-slate-700 shrink-0">Lý do khoa học:</strong>
                    <span className="text-slate-600">{item.reason}</span>
                  </div>
                  <div className="flex items-start gap-1.5 pt-1 border-t border-slate-200/60">
                    <strong className="text-[#164E9B] shrink-0">Ý kiến GVHD ({item.supervisorName}):</strong>
                    <span className="text-slate-700 italic">{item.supervisorOpinion}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSelectedTopicChange(item);
                      setTopicModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#164E9B] px-4 py-2 text-xs font-bold text-white hover:bg-[#123E7C] shadow-xs transition-all cursor-pointer"
                  >
                    <Eye className="size-3.5" />
                    <span>Xem xét &amp; Phê duyệt điều chỉnh</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* TOPIC CHANGE COMPARISON MODAL */}
      <TopicChangeModal
        isOpen={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        data={selectedTopicChange}
        onDecision={handleTopicDecision}
      />
    </div>
  );
}
