"use client";

import { toast } from "sonner";

import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, ClipboardCheck, FileText, History, ShieldCheck, UserRound, X, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { PdfAttachment } from "@/src/components/upload/PdfAttachment";
import { useDecisions } from "@/src/hooks/api/use-decisions";
import { useMilestoneEvaluations, useMilestoneReviewHistory, useReviewMilestone } from "@/src/hooks/api/use-milestone-review";
import type { PendingReviewMilestone } from "@/src/types/api/progress";
import { DecisionAttachment } from "../decisions/DecisionAttachment";
import { MilestoneEvaluations } from "./MilestoneEvaluations";
import { RejectMilestoneDialog } from "./RejectMilestoneDialog";

interface MilestoneReviewPanelProps {
  item: PendingReviewMilestone;
  evidence: NonNullable<PendingReviewMilestone["minhChungMoiNhat"]>;
  onClose: () => void;
  onReviewed: () => void;
}

const submissionStatuses = {
  PENDING_REVIEW: { label: "Chờ duyệt", className: "bg-amber-50 text-amber-800" },
  PASSED: { label: "Đã duyệt", className: "bg-emerald-50 text-emerald-800" },
  REJECTED: { label: "Đã từ chối", className: "bg-rose-50 text-rose-800" },
};

function formatSubmissionDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export function MilestoneReviewPanel({ item, evidence, onClose, onReviewed }: MilestoneReviewPanelProps) {
  const decisions = useDecisions();
  const evaluations = useMilestoneEvaluations(evidence.id, item.moc.yeuCauDiem);
  const history = useMilestoneReviewHistory(item.ncs.id);
  const review = useReviewMilestone(item.id);
  const [decisionId, setDecisionId] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);

  const decisionOptions = useMemo(() => (decisions.data ?? [])
    .filter((decision) => decision.loai === "CAN_CU_DUYET_MOC" && decision.trangThai === "HIEU_LUC" &&
      (decision.ncsId === item.ncs.id || decision.ncsId == null))
    .map((decision) => ({
      decision,
      value: decision.id,
      label: `${decision.soQuyetDinh} · ${formatSubmissionDate(decision.ngayQuyetDinh)}`,
    })), [decisions.data, item.ncs.id]);

  const decision = decisionOptions.find((option) => option.value === decisionId)?.decision;
  const milestone = history.data?.tienTrinhs.find((milestone) => milestone.id === item.id);
  const submissionHistory = milestone?.minhChungs;
  const closed = milestone !== undefined && milestone.trangThai !== "PENDING_REVIEW";
  const summary = evaluations.data?.tongHop;
  const scoreReady = !item.moc.yeuCauDiem ||
    (!evaluations.isError && summary?.duPhieu === true && (summary.diemTrungBinh ?? 0) >= 7);
  const canApprove = !!decision && scoreReady && !review.isPending && !closed;

  return (
    <section aria-labelledby="milestone-review-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-blue-100 bg-linear-to-br from-blue-50 to-white px-4 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="hidden size-11 shrink-0 place-items-center rounded-xl border border-blue-200 bg-white text-[#164E9B] shadow-xs sm:grid">
              <ClipboardCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-[#164E9B]">Thẩm định mốc {item.moc.thuTu}</p>
              <h2 id="milestone-review-title" className="mt-1 text-xl font-black tracking-tight text-[#0F2744]">
                {item.moc.tenMoc}
              </h2>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={review.isPending} aria-label="Đóng thẩm định"
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50">
            <X className="size-4" />
          </button>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-white/80 p-3">
            <UserRound className="mt-0.5 size-4 shrink-0 text-[#164E9B]" aria-hidden="true" />
            <div>
              <dt className="text-[11px] font-semibold text-slate-500">Nghiên cứu sinh</dt>
              <dd className="mt-0.5 text-sm font-bold text-slate-900">{item.ncs.hoTen}</dd>
              <dd className="text-xs text-slate-600">{item.ncs.mshv}{item.ncs.lop && ` · ${item.ncs.lop}`}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-white/80 p-3">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-[#164E9B]" aria-hidden="true" />
            <div>
              <dt className="text-[11px] font-semibold text-slate-500">Lần nộp đang xem</dt>
              <dd className="mt-0.5 text-sm font-bold text-slate-900">Lần {evidence.lanNop} · {formatSubmissionDate(evidence.ngayNop)}</dd>
              <dd className="text-xs text-slate-600">{item.moc.yeuCauDiem ? "Có yêu cầu phiếu nhận xét" : "Không yêu cầu chấm điểm"}</dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="space-y-4 bg-slate-50/70 p-4 sm:p-6">
        {closed && <p role="status" className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">Mốc đã được xử lý. Đồng bộ danh sách để cập nhật hàng chờ.</p>}

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-4">
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-xs">
              <h3 className="flex items-center gap-2 font-bold text-slate-900"><FileText className="size-4 text-[#164E9B]" /> Minh chứng đính kèm</h3>
              {evidence.ghiChuNcs && (
                <div className="rounded-xl bg-blue-50/60 p-3">
                  <p className="font-semibold text-slate-800">Ghi chú của nghiên cứu sinh</p>
                  <p className="mt-1 whitespace-pre-wrap text-slate-700">{evidence.ghiChuNcs}</p>
                </div>
              )}
              <PdfAttachment fileId={evidence.fileId} title={`Minh chứng mốc ${item.moc.thuTu}`} fallbackName={`Minh_chung_lan_${evidence.lanNop}.pdf`} />
            </div>
            {item.moc.yeuCauDiem && (
              <MilestoneEvaluations evidenceId={evidence.id} ncsId={item.ncs.id} data={evaluations.data}
                error={evaluations.error?.message} onRetry={() => void evaluations.refetch()} locked={review.isPending || closed} />
            )}
          </div>

          <div className="space-y-4">
            <section className="space-y-4 rounded-2xl border border-blue-200 bg-white p-4 text-xs shadow-xs">
              <div className="flex items-center gap-2 border-b border-blue-100 pb-3">
                <span className="grid size-8 place-items-center rounded-lg bg-blue-50 text-[#164E9B]"><ShieldCheck className="size-4" /></span>
                <h3 className="text-sm font-bold text-slate-900">Căn cứ duyệt mốc</h3>
              </div>
              <Select items={decisionOptions} value={decision?.id ?? null} onValueChange={setDecisionId} disabled={review.isPending || closed || !decisionOptions.length}>
                <SelectTrigger aria-label="Quyết định căn cứ" className="w-full rounded-xl bg-slate-50/50 text-xs">
                  <SelectValue placeholder="Chọn quyết định còn hiệu lực" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {decisionOptions.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                </SelectContent>
              </Select>
              {decisions.isPending && <p role="status" className="text-slate-500">Đang tải quyết định...</p>}
              {decisions.error && <p role="alert" className="text-rose-700">{decisions.error.message} <button type="button" className="underline" onClick={() => void decisions.refetch()}>Thử lại</button></p>}
              {decisions.isSuccess && !decisionOptions.length && <p className="text-slate-500">Chưa có quyết định căn cứ còn hiệu lực áp dụng cho NCS này.</p>}
              {decision && (
                <div className="space-y-2">
                  {decision.ghiChu && <p className="whitespace-pre-wrap text-slate-600">{decision.ghiChu}</p>}
                  {decision.fileId && <DecisionAttachment key={decision.fileId} fileId={decision.fileId} decisionNumber={decision.soQuyetDinh} fileName={decision.fileName} />}
                </div>
              )}
              {!scoreReady && summary && <p className="rounded-xl bg-amber-50 p-2.5 text-amber-800">Hồ sơ chưa đủ điều kiện về số phiếu hoặc điểm trung bình.</p>}
              <div className="grid gap-2 border-t border-slate-100 pt-3">
                <button type="button" disabled={!canApprove} onClick={() => {
                  if (!decision || !canApprove) return;
                  review.mutate({ quyetDinhId: decision.id }, {
                    onSuccess: () => {
                      toast.success(`Đã duyệt mốc ${item.moc.thuTu} của ${item.ncs.hoTen} theo quyết định ${decision.soQuyetDinh}.`);
                      onReviewed();
                    },
                    onError: (error) => { toast.error(error.message); },
                  });
                }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 font-bold text-white disabled:opacity-50">
                  <CheckCircle2 className="size-4" /> Duyệt mốc
                </button>
                <button type="button" disabled={review.isPending || closed} onClick={() => { review.reset(); setRejectOpen(true); }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 font-bold text-rose-700 disabled:opacity-50">
                  <XCircle className="size-4" /> Từ chối minh chứng
                </button>
              </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-xs">
              <h3 className="flex items-center gap-2 font-bold text-slate-900"><History className="size-4 text-[#164E9B]" /> Lịch sử nộp minh chứng</h3>
              {history.isPending && <p role="status" className="text-slate-500">Đang tải lịch sử...</p>}
              {history.error && <p role="alert" className="text-rose-700">{history.error.message} <button type="button" className="underline" onClick={() => void history.refetch()}>Thử lại</button></p>}
              {history.isSuccess && !submissionHistory?.length && <p className="text-slate-500">Chưa có lịch sử nộp.</p>}
              {!!submissionHistory?.length && (
                <ol className="space-y-2">
                  {submissionHistory.map((submission) => {
                    const status = submissionStatuses[submission.trangThai];
                    return (
                      <li key={submission.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-slate-700"><strong>Lần {submission.lanNop}</strong> · {formatSubmissionDate(submission.ngayNop)}</p>
                          <span className={`rounded-full px-2 py-0.5 font-semibold ${status.className}`}>{status.label}</span>
                        </div>
                        {submission.lyDoTuChoi && <p className="mt-1.5 whitespace-pre-wrap text-rose-700">{submission.lyDoTuChoi}</p>}
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          </div>
        </div>
      </div>

      {rejectOpen && (
        <RejectMilestoneDialog pending={review.isPending} error={review.error?.message}
          onClose={() => { review.reset(); setRejectOpen(false); }}
          onConfirm={(reason) => review.mutate({ lyDo: reason }, {
            onSuccess: () => {
              toast.success(`Đã từ chối minh chứng mốc ${item.moc.thuTu} của ${item.ncs.hoTen}.`);
              onReviewed();
            },
            onError: (error) => { toast.error(error.message); },
          })} />
      )}
    </section>
  );
}
