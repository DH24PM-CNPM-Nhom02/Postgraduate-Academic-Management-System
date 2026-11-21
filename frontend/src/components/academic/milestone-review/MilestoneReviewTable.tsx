"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ClipboardList, Filter, Loader2, RefreshCw, Search } from "lucide-react";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import type { PendingReviewMilestone } from "@/src/types/api/progress";

const MILESTONE_OPTIONS = [
  { value: "all", label: "Tất cả các mốc" },
  { value: "1", label: "Mốc 1 · Nhập học" },
  { value: "2", label: "Mốc 2 · Tiểu luận tổng quan" },
  { value: "3", label: "Mốc 3 · Đề cương chi tiết" },
  { value: "4", label: "Mốc 4 · Chuyên đề 1" },
  { value: "5", label: "Mốc 5 · Chuyên đề 2" },
  { value: "6", label: "Mốc 6 · Bảo vệ giữa kỳ" },
  { value: "7", label: "Mốc 7 · Seminar cuối khóa" },
  { value: "8", label: "Mốc 8 · Bảo vệ cấp Bộ môn" },
  { value: "9", label: "Mốc 9 · Bảo vệ cấp Trường và Phản biện kín" },
];

interface MilestoneReviewTableProps {
  items: PendingReviewMilestone[];
  milestone?: number;
  onMilestoneChange: (value?: number) => void;
  selectedId?: string;
  onSelect: (id: string) => void;
  loading: boolean;
  fetching: boolean;
  error?: string;
  onRefresh: () => void;
}

export function MilestoneReviewTable({ items, milestone, onMilestoneChange, selectedId, onSelect, loading, fetching, error, onRefresh }: MilestoneReviewTableProps) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi");
    return items.filter(({ ncs, moc }) =>
      [ncs.hoTen, ncs.mshv, moc.tenMoc].some((text) => text.toLocaleLowerCase("vi").includes(keyword)),
    );
  }, [items, search]);

  const columns = useMemo<ColumnDef<PendingReviewMilestone>[]>(() => [
    {
      id: "ncs",
      header: "Nghiên cứu sinh",
      cell: ({ row: { original: { ncs } } }) => (
        <div>
          <div className="font-bold text-slate-800">{ncs.hoTen}</div>
          <div className="text-[11px] text-slate-500">{ncs.mshv}{ncs.lop && ` · ${ncs.lop}`}</div>
        </div>
      ),
    },
    {
      id: "moc",
      header: "Mốc tiến độ",
      cell: ({ row: { original: { moc } } }) => <span className="font-semibold">Mốc {moc.thuTu} · {moc.tenMoc}</span>,
    },
    {
      id: "evidence",
      header: "Minh chứng",
      cell: ({ row: { original: { minhChungMoiNhat } } }) => minhChungMoiNhat ? `Lần nộp ${minhChungMoiNhat.lanNop}` : "Chưa có minh chứng",
    },
    {
      id: "score",
      header: "Phiếu nhận xét",
      cell: ({ row: { original: item } }) => item.moc.yeuCauDiem && item.minhChungMoiNhat
        ? `${item.minhChungMoiNhat._count.phieuNhanXets} phiếu`
        : "—",
    },
    {
      id: "date",
      header: "Ngày nộp",
      cell: ({ row: { original: { minhChungMoiNhat, submittedAt } } }) => {
        const date = minhChungMoiNhat?.ngayNop ?? submittedAt;
        return date ? new Date(date).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "—";
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row: { original: item } }) => (
        <div className="text-right">
          <button
            type="button"
            disabled={!item.minhChungMoiNhat}
            aria-expanded={selectedId === item.id}
            aria-controls={selectedId === item.id ? "milestone-review-panel" : undefined}
            onClick={() => onSelect(item.id)}
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 font-bold text-[#164E9B] hover:bg-blue-100 disabled:opacity-50"
          >
            {selectedId === item.id ? "Đang thẩm định" : "Thẩm định"}
          </button>
        </div>
      ),
    },
  ], [onSelect, selectedId]);

  const table = useManagementDataTable({ data: filtered, columns, globalFilter: "", onGlobalFilterChange: setSearch });

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
          <Filter className="size-4 text-[#164E9B]" /> Bộ lọc &amp; tra cứu hồ sơ
        </h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onRefresh} disabled={fetching} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-blue-50/50 px-3 py-1.5 text-xs font-semibold text-[#164E9B] hover:bg-blue-100 disabled:opacity-50">
            <RefreshCw className={`size-3.5 ${fetching ? "animate-spin" : ""}`} /> Đồng bộ từ máy chủ
          </button>
          <button type="button" onClick={() => { setSearch(""); onMilestoneChange(); table.setPageIndex(0); }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">
            Đặt lại bộ lọc
          </button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <input type="search" aria-label="Tìm hồ sơ" value={search} placeholder="Tìm theo họ tên, MSHV hoặc tên mốc..."
            onChange={(e) => { setSearch(e.target.value); table.setPageIndex(0); }}
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs outline-none focus:border-[#164E9B]" />
        </div>
        <Select items={MILESTONE_OPTIONS} value={milestone?.toString() ?? "all"} onValueChange={(value) => {
          onMilestoneChange(value && value !== "all" ? Number(value) : undefined);
          table.setPageIndex(0);
        }}>
          <SelectTrigger aria-label="Mốc tiến độ" className="h-9 w-full rounded-xl bg-slate-50/50 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {MILESTONE_OPTIONS.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}
      <ManagementDataTable table={table} itemLabel="hồ sơ" headerStyles={{ actions: "px-3 py-3 text-right" }}
        emptyState={loading ? (
          <span role="status" className="inline-flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> Đang tải hồ sơ...</span>
        ) : error ? "Bấm đồng bộ từ máy chủ để thử lại." : (
          <><ClipboardList className="mx-auto mb-2 size-8 text-slate-300" /> Không có hồ sơ phù hợp.</>
        )} />
    </section>
  );
}
