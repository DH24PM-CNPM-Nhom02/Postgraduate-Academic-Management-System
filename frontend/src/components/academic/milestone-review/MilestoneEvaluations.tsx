"use client";

import { toast } from "sonner";

import { useState } from "react";
import { Award, CheckCircle2, CircleAlert, Pencil, Plus, Trash2 } from "lucide-react";
import { PdfAttachment } from "@/src/components/upload/PdfAttachment";
import { useDeleteMilestoneEvaluation } from "@/src/hooks/api/use-milestone-review";
import type { ReviewEvaluation, ReviewEvaluations } from "@/src/types/api/progress";
import { EvaluationForm } from "./EvaluationForm";

interface MilestoneEvaluationsProps {
  evidenceId: string;
  ncsId: string;
  data?: ReviewEvaluations;
  error?: string;
  onRetry: () => void;
  locked: boolean;
}

export function MilestoneEvaluations({ evidenceId, ncsId, data, error, onRetry, locked }: MilestoneEvaluationsProps) {
  const [form, setForm] = useState<{ evaluation?: ReviewEvaluation } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deletion = useDeleteMilestoneEvaluation(evidenceId);
  const summary = data?.tongHop;
  const average = summary?.diemTrungBinh ?? null;
  const meetsScoreThreshold = average !== null && average >= 7;
  const busy = locked || deletion.isPending;

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 font-bold text-slate-900"><Award className="size-4 text-[#164E9B]" /> Phiếu nhận xét</h3>
          <p className="mt-1 text-slate-500">Cần tối thiểu {summary?.soPhieuToiThieu ?? 3} phiếu và điểm trung bình từ 7.</p>
        </div>
        <button type="button" disabled={busy || !data} onClick={() => setForm({})} className="inline-flex items-center gap-1 rounded-xl bg-[#164E9B] px-3 py-2 font-bold text-white disabled:opacity-50">
          <Plus className="size-4" /> Nhập phiếu
        </button>
      </div>
      {error && (
        <p role="alert" className="text-rose-700">{error} <button type="button" onClick={onRetry} className="underline">Thử lại</button></p>
      )}
      {!data && !error && <p role="status" className="text-slate-500">Đang tải phiếu nhận xét...</p>}
      {summary && (
        <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
            <p className="font-bold text-[#0F2744]">Điểm trung bình</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-4xl leading-none font-black tracking-tight text-[#164E9B] tabular-nums">
                {average === null ? "—" : average.toLocaleString("vi-VN", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
              </span>
              {average !== null && <span className="text-sm font-semibold text-slate-600">/ 10</span>}
            </div>
            {average === null ? (
              <p className="mt-2 text-slate-600">Chưa có điểm</p>
            ) : (
              <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-semibold ${meetsScoreThreshold ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                {meetsScoreThreshold ? <CheckCircle2 className="size-3.5" /> : <CircleAlert className="size-3.5" />}
                {meetsScoreThreshold ? "Đạt ngưỡng điểm" : "Dưới ngưỡng 7 điểm"}
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="font-semibold text-slate-600">Số phiếu đã nhập</p>
            <p className="mt-1 text-2xl font-black text-slate-900 tabular-nums">
              {summary.soPhieu}<span className="text-sm font-semibold text-slate-600"> / {summary.soPhieuToiThieu} tối thiểu</span>
            </p>
          </div>
        </div>
      )}
      {data?.phieus.map((evaluation) => (
        <article key={evaluation.id} className="space-y-2 rounded-xl border border-slate-200 p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <span className="font-bold text-slate-800">{evaluation.tenNguoiCham}</span>
              {evaluation.donViNguoiCham && <div className="text-slate-500">{evaluation.donViNguoiCham}</div>}
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-emerald-50 px-2 py-1 font-bold text-emerald-800">{Number(evaluation.diem)} điểm</span>
              <button type="button" aria-label={`Sửa phiếu của ${evaluation.tenNguoiCham}`} disabled={busy} onClick={() => setForm({ evaluation })} className="rounded-lg border border-slate-200 p-1.5 text-[#164E9B] disabled:opacity-50"><Pencil className="size-3.5" /></button>
              <button type="button" aria-label={`Xóa phiếu của ${evaluation.tenNguoiCham}`} disabled={busy} onClick={() => { deletion.reset(); setDeleteId(evaluation.id); }} className="rounded-lg border border-rose-200 p-1.5 text-rose-700 disabled:opacity-50"><Trash2 className="size-3.5" /></button>
            </div>
          </div>
          {evaluation.nhanXet && <p className="whitespace-pre-wrap text-slate-600">{evaluation.nhanXet}</p>}
          {evaluation.fileId && (
            <PdfAttachment key={evaluation.fileId} fileId={evaluation.fileId} title={`Phiếu nhận xét của ${evaluation.tenNguoiCham}`} fallbackName="Phieu_nhan_xet.pdf" />
          )}
          {deleteId === evaluation.id && (
            <div className="space-y-2 rounded-lg bg-rose-50 p-2 text-rose-800">
              <p>Xóa phiếu nhận xét của {evaluation.tenNguoiCham}?</p>
              {deletion.error && <p role="alert">{deletion.error.message}</p>}
              <div className="flex gap-3">
                <button type="button" disabled={busy} onClick={() => setDeleteId(null)}>Hủy</button>
                <button type="button" disabled={busy} onClick={() => deletion.mutate(evaluation.id, { onSuccess: () => { toast.success("Đã xóa phiếu nhận xét."); setDeleteId(null); } })} className="font-bold underline">Xác nhận xóa</button>
              </div>
            </div>
          )}
        </article>
      ))}
      {form && <EvaluationForm evidenceId={evidenceId} ncsId={ncsId} evaluation={form.evaluation} onClose={() => setForm(null)} />}
    </section>
  );
}
