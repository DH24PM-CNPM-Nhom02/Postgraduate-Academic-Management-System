"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Award, ClipboardList, FileCheck2 } from "lucide-react";
import { usePendingMilestoneReviews } from "@/src/hooks/api/use-milestone-review";
import type { PendingReviewMilestone } from "@/src/types/api/progress";
import { MilestoneReviewTable } from "./MilestoneReviewTable";
import { MilestoneReviewPanel } from "./MilestoneReviewPanel";

const EMPTY_ITEMS: PendingReviewMilestone[] = [];

export function MilestoneReviewView({ embedded = false, admin = false }: { embedded?: boolean; admin?: boolean }) {
  const [milestone, setMilestone] = useState<number>();
  const queue = usePendingMilestoneReviews(milestone);
  const items = queue.data ?? EMPTY_ITEMS;
  const [selection, setSelection] = useState<{ id: string } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selected = items.find((item) => item.id === selection?.id);
  const selectItem = useCallback((id: string) => {
    setSelection({ id });
  }, []);

  const selectedEvidenceId = selected?.minhChungMoiNhat?.id;
  useEffect(() => {
    if (!selection || !selectedEvidenceId) return;
    const panel = panelRef.current;
    if (!panel) return;
    const frame = requestAnimationFrame(() => {
      panel.focus({ preventScroll: true });
      panel.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [selection, selectedEvidenceId]);

  function changeMilestone(value?: number) {
    if (value !== milestone) setSelection(null);
    setMilestone(value);
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <div>
        {!embedded && (
          <nav aria-label="Đường dẫn" className="mb-1 flex items-center gap-2 text-xs text-slate-500">
            <Link href={admin ? "/admin/overview" : "/academic"} className="flex items-center gap-1 hover:text-[#164E9B]">
              <ArrowLeft className="size-3" /> {admin ? "Tổng quan quản trị" : "Tổng quan học vụ"}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="font-semibold text-slate-700">Duyệt mốc tiến độ</span>
          </nav>
        )}
        <h1 className="text-xl font-black tracking-tight text-[#0F2744] sm:text-2xl">Duyệt mốc tiến độ</h1>
        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
          Kiểm tra minh chứng, nhập phiếu nhận xét và xử lý hồ sơ đang chờ duyệt.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: milestone ? `Hồ sơ chờ duyệt mốc ${milestone}` : "Hồ sơ chờ duyệt", value: items.length, icon: ClipboardList },
          { label: "Mốc yêu cầu chấm điểm", value: items.filter((item) => item.moc.yeuCauDiem).length, icon: Award },
          { label: "Mốc không yêu cầu điểm", value: items.filter((item) => !item.moc.yeuCauDiem).length, icon: FileCheck2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#164E9B]">
                <Icon className="size-4" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-black text-[#0F2744]">{queue.data ? value : "—"}</div>
          </div>
        ))}
      </div>

      <MilestoneReviewTable
        items={items}
        milestone={milestone}
        onMilestoneChange={changeMilestone}
        selectedId={selected?.id}
        onSelect={selectItem}
        loading={queue.isPending}
        fetching={queue.isFetching}
        error={queue.error?.message}
        onRefresh={() => void queue.refetch()}
      />

      {selected?.minhChungMoiNhat && (
        <div ref={panelRef} id="milestone-review-panel" tabIndex={-1} className="scroll-mt-20 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
          <MilestoneReviewPanel
            key={selected.minhChungMoiNhat.id}
            item={selected}
            evidence={selected.minhChungMoiNhat}
            onClose={() => setSelection(null)}
            onReviewed={() => setSelection(null)}
          />
        </div>
      )}
    </div>
  );
}
