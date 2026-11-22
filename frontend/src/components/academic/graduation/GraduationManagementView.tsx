"use client";

import { useMemo, useState } from "react";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { ArrowLeft, Check, Eye, GraduationCap, Search, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { useGraduationList } from "@/src/hooks/api/use-graduation";
import type { GraduationCheckApiResponse, GraduationConditionApiItem } from "@/src/types/api/graduation";
import { GraduationConfirmDialog } from "./GraduationConfirmDialog";
import { GraduationDetailDialog } from "./GraduationDetailDialog";
import { GraduationLoadError, graduationPrimaryButton } from "./GraduationDialog";
import { canConfirmGraduation, hasGraduated, studyStatusLabel } from "./graduation-status";

const eligibilityLabels = { all: "Tất cả kết quả", eligible: "Đủ điều kiện", ineligible: "Chưa đủ điều kiện" };
type EligibilityFilter = keyof typeof eligibilityLabels;
const conditionLabels: Record<string, string> = {
  HOAN_THANH_MOC: "Mốc",
  TRANG_THAI_HOC_TAP: "Học tập",
  THOI_HAN: "Thời hạn",
  NGOAI_NGU: "Ngoại ngữ",
  CONG_NO: "Công nợ",
  DE_NGHI_CHO_DUYET: "Đề nghị",
};
const EMPTY_STUDENTS: GraduationCheckApiResponse[] = [];

function normalizeSearch(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d").trim();
}

const filterByIdentity: FilterFn<GraduationCheckApiResponse> = ({ original }, _column, search: string) =>
  normalizeSearch(`${original.mshv} ${original.hoTen}`).includes(search);
filterByIdentity.resolveFilterValue = normalizeSearch;

function ConditionBadge({ condition }: { condition: GraduationConditionApiItem }) {
  const Icon = condition.dat ? Check : X;
  return (
    <span
      title={`${condition.ten} · ${condition.ghiChu}`}
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-1 font-medium ${condition.dat ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}
    >
      <Icon className="size-3" aria-hidden="true" />
      {conditionLabels[condition.ma] ?? condition.ten}
      <span className="sr-only">{condition.dat ? "đạt" : "chưa đạt"}</span>
    </span>
  );
}

export function GraduationManagementView({ area }: { area: "academic" | "admin" }) {
  const query = useGraduationList();
  const [search, setSearch] = useState("");
  const [eligibility, setEligibility] = useState<EligibilityFilter>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [detail, setDetail] = useState<GraduationCheckApiResponse | null>(null);
  const [confirmation, setConfirmation] = useState<GraduationCheckApiResponse[] | null>(null);
  const allStudents = query.data ?? EMPTY_STUDENTS;
  const selected = allStudents.filter((student) => selectedIds.has(student.ncsId) && canConfirmGraduation(student));
  const data = useMemo(() => {
    if (eligibility === "all") return allStudents;
    return allStudents.filter((student) => !hasGraduated(student) && student.duDieuKien === (eligibility === "eligible"));
  }, [allStudents, eligibility]);

  const columns = useMemo<ColumnDef<GraduationCheckApiResponse>[]>(() => {
    function changeSelection(ids: string[], checked: boolean) {
      setSelectedIds((current) => {
        const next = new Set(current);
        for (const id of ids) {
          if (checked) next.add(id);
          else next.delete(id);
        }
        return next;
      });
    }

    return [
      {
        id: "selection",
        header: ({ table }) => {
          const eligibleIds = table.getRowModel().rows
            .map(({ original }) => original)
            .filter(canConfirmGraduation)
            .map(({ ncsId }) => ncsId);
          const count = eligibleIds.filter((id) => selectedIds.has(id)).length;
          return (
            <input
              type="checkbox"
              aria-label="Chọn các NCS đủ điều kiện trên trang này"
              className="size-4 accent-[#164E9B]"
              disabled={eligibleIds.length === 0}
              checked={eligibleIds.length > 0 && count === eligibleIds.length}
              ref={(input) => { if (input) input.indeterminate = count > 0 && count < eligibleIds.length; }}
              onChange={(event) => changeSelection(eligibleIds, event.target.checked)}
            />
          );
        },
        cell: ({ row }) => (
          <input
            type="checkbox"
            aria-label={`Chọn ${row.original.mshv}`}
            className="size-4 accent-[#164E9B]"
            disabled={!canConfirmGraduation(row.original)}
            checked={canConfirmGraduation(row.original) && selectedIds.has(row.original.ncsId)}
            onChange={(event) => changeSelection([row.original.ncsId], event.target.checked)}
          />
        ),
      },
      {
        accessorKey: "hoTen",
        header: "Nghiên cứu sinh",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-semibold text-slate-900">{row.original.hoTen}</p>
            <p className="font-medium text-[#164E9B]">{row.original.mshv}</p>
          </div>
        ),
      },
      {
        id: "study-status",
        header: "Trạng thái học tập",
        cell: ({ row }) => studyStatusLabel(row.original.trangThaiHocTap),
      },
      {
        id: "conditions",
        header: "Điều kiện xét tốt nghiệp",
        cell: ({ row }) => (
          <div className="flex max-w-96 flex-wrap gap-1.5">
            {row.original.dieuKien.map((condition) => <ConditionBadge key={condition.ma} condition={condition} />)}
          </div>
        ),
      },
      {
        id: "result",
        header: "Kết quả xét",
        cell: ({ row }) => {
          const student = row.original;
          if (hasGraduated(student)) {
            return <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-[#164E9B]">Đã tốt nghiệp</span>;
          }
          return student.duDieuKien
            ? <span className="whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">Đủ điều kiện</span>
            : <span className="whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-800">Chưa đủ điều kiện</span>;
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => (
          <Button type="button" variant="outline" size="sm" onClick={() => setDetail(row.original)}>
            <Eye className="size-3.5" /> Chi tiết
          </Button>
        ),
      },
    ];
  }, [selectedIds]);

  const table = useManagementDataTable({
    data,
    columns,
    globalFilter: search,
    onGlobalFilterChange: setSearch,
    globalFilterFn: filterByIdentity,
  });

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <nav aria-label="Điều hướng" className="mb-1 flex items-center gap-2 text-xs text-slate-500">
            <Link href={area === "admin" ? "/admin/overview" : "/academic"} className="flex items-center gap-1 hover:text-[#164E9B]">
              <ArrowLeft className="size-3.5" /> Tổng quan học vụ
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="font-semibold text-slate-700">Xét tốt nghiệp</span>
          </nav>
          <h1 className="text-xl font-black tracking-tight text-[#0F2744] sm:text-2xl">Xét tốt nghiệp</h1>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Kiểm tra điều kiện và công nhận tốt nghiệp cho nghiên cứu sinh.</p>
        </div>
        <Button
          type="button"
          className={graduationPrimaryButton}
          disabled={query.isError || selected.length === 0}
          onClick={() => setConfirmation(selected)}
        >
          <GraduationCap className="size-4" />
          Xác nhận tốt nghiệp{selected.length > 0 && ` (${selected.length})`}
        </Button>
      </header>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <div className="relative min-w-52 flex-1 sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input aria-label="Tìm theo mã hoặc họ tên NCS" placeholder="Tìm theo mã hoặc họ tên NCS…" className="h-9 pl-9" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <Select items={eligibilityLabels} value={eligibility} onValueChange={(value) => setEligibility(value ?? "all")}>
              <SelectTrigger aria-label="Lọc kết quả xét tốt nghiệp" className="h-9 min-w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {Object.entries(eligibilityLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {selected.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <span aria-live="polite">Đã chọn {selected.length} NCS</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>Bỏ chọn tất cả</Button>
            </div>
          )}
        </div>
        {query.isError ? (
          <GraduationLoadError message={query.error.message} onRetry={() => void query.refetch()} />
        ) : (
          <ManagementDataTable
            table={table}
            minWidth="min-w-[780px]"
            itemLabel="NCS"
            emptyState={query.isPending
              ? "Đang tải danh sách…"
              : search.trim() || eligibility !== "all"
                ? "Không tìm thấy nghiên cứu sinh phù hợp."
                : "Chưa có nghiên cứu sinh trong danh sách xét tốt nghiệp."}
          />
        )}
      </div>

      {detail && (
        <GraduationDetailDialog
          key={detail.ncsId}
          student={detail}
          onClose={() => setDetail(null)}
          onConfirm={(student) => {
            setDetail(null);
            setConfirmation([student]);
          }}
        />
      )}
      {confirmation && (
        <GraduationConfirmDialog
          students={confirmation}
          decisionsHref={`/${area}/decisions`}
          onClose={() => setConfirmation(null)}
          onConfirmed={(ids) => {
            setSelectedIds((current) => {
              const next = new Set(current);
              for (const id of ids) next.delete(id);
              return next;
            });
            setConfirmation(null);
          }}
        />
      )}
    </section>
  );
}
