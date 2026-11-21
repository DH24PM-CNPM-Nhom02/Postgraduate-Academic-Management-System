"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { useAcademicTheses } from "@/src/hooks/use-theses";
import { parseApiError } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type { AcademicThesisNcsItem } from "@/src/types/api/thesis";
import { ThesesKpiCards } from "./ThesesKpiCards";
import { EMPTY_THESIS_FILTERS, ThesesFilterBar, type ThesisFilters } from "./ThesesFilterBar";
import { ThesesTable } from "./ThesesTable";
import { ThesisAssignmentModal } from "./ThesisAssignmentModal";
import { ThesisDeactivateModal } from "./ThesisDeactivateModal";
import { ThesisDetailDrawer } from "./ThesisDetailDrawer";

export interface ThesesManagementViewProps {
  embedded?: boolean;
  area?: "academic" | "admin";
}

type ActivePanel =
  | { kind: "assign"; item: AcademicThesisNcsItem | null }
  | { kind: "detail" | "deactivate"; item: AcademicThesisNcsItem };

const EMPTY_ITEMS: AcademicThesisNcsItem[] = [];

function normalizeSearch(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d").trim();
}

function matchesFilters(item: AcademicThesisNcsItem, filters: ThesisFilters, keyword: string) {
  if (filters.cohort !== "ALL" && item.khoaHoc !== filters.cohort) return false;
  if (filters.supervisorId !== "ALL" && !item.phanCongs?.some(({ gvhd }) => gvhd.id === filters.supervisorId)) return false;
  if (filters.status === "DA_HUY" || filters.status === "DA_THAY_THE") {
    if (!item.deTais?.some(({ trangThai }) => trangThai === filters.status)) return false;
  } else if (filters.status !== "ALL" && item.trangThaiDeTai !== filters.status) {
    return false;
  }

  return !keyword || [
    item.mshv,
    item.hoTen,
    item.deTaiHienTai?.tenDeTai ?? "",
    ...(item.deTais ?? []).map(({ tenDeTai }) => tenDeTai),
  ].some((value) => normalizeSearch(value).includes(keyword));
}

function exportThesesCsv(items: AcademicThesisNcsItem[]) {
  const headers = ["MSHV", "Họ tên NCS", "Khóa học", "Trạng thái đề tài", "Tên đề tài hiện tại", "Số quyết định", "Ngày ký", "GVHD chính", "Đồng hướng dẫn"];
  const rows = items.map((item) => {
    const decision = item.deTaiHienTai?.quyetDinh;
    const supervisors = item.phanCongs ?? [];
    return [
      item.mshv,
      item.hoTen,
      item.khoaHoc ?? "",
      item.trangThaiDeTai === "HIEU_LUC" ? "Có đề tài đang hiệu lực" : "Chưa có đề tài hiệu lực",
      item.deTaiHienTai?.tenDeTai ?? "",
      decision?.soQuyetDinh ?? "",
      decision ? formatDate(decision.ngayQuyetDinh) : "",
      supervisors.filter(({ vaiTro }) => vaiTro === "HUONG_DAN_CHINH").map(({ gvhd }) => gvhd.hoTen).join(", "),
      supervisors.filter(({ vaiTro }) => vaiTro === "DONG_HUONG_DAN").map(({ gvhd }) => gvhd.hoTen).join(", "),
    ];
  });
  const csv = [headers, ...rows].map((row) => row.map((value) => {
    const safeValue = /^[\s]*[=+@-]|^[\t\r\n]/.test(value) ? "'" + value : value;
    return '"' + safeValue.replace(/"/g, '""') + '"';
  }).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "DanhSach_DeTaiLuanAn.csv";
  link.click();
  URL.revokeObjectURL(url);
  toast.success("Đã xuất danh sách đề tài luận án.");
}

function ThesesManagementViewContent({ embedded = false, area = "academic"}: ThesesManagementViewProps) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ThesisFilters>(() => ({
    ...EMPTY_THESIS_FILTERS,
    search: searchParams.get("search") ?? "",
  }));
  const [panel, setPanel] = useState<ActivePanel | null>(null);
  const query = useAcademicTheses();
  const items = query.data ?? EMPTY_ITEMS;
  const keyword = normalizeSearch(filters.search);
  const isFiltered = Boolean(filters.search) || filters.cohort !== "ALL" || filters.status !== "ALL" || filters.supervisorId !== "ALL";
  const filteredItems = useMemo(
    () => items.filter((item) => matchesFilters(item, filters, keyword)),
    [items, filters, keyword],
  );

  const { cohortOptions, supervisorOptions } = useMemo(() => {
    const cohorts = new Set<string>();
    const supervisors = new Map<string, string>();
    for (const item of items) {
      if (item.khoaHoc) cohorts.add(item.khoaHoc);
      for (const { gvhd } of item.phanCongs ?? []) supervisors.set(gvhd.id, gvhd.hoTen);
    }
    return {
      cohortOptions: [
        { value: "ALL", label: "Tất cả khóa học" },
        ...[...cohorts].sort((a, b) => a.localeCompare(b, "vi", { numeric: true }))
          .map((cohort) => ({ value: cohort, label: cohort })),
      ],
      supervisorOptions: [
        { value: "ALL", label: "Tất cả GVHD" },
        ...[...supervisors].sort(([, a], [, b]) => a.localeCompare(b, "vi"))
          .map(([value, label]) => ({ value, label })),
      ],
    };
  }, [items]);

  const closePanel = () => setPanel(null);
  const openDetail = useCallback((item: AcademicThesisNcsItem) => setPanel({ kind: "detail", item }), []);
  const openAssign = useCallback((item: AcademicThesisNcsItem) => setPanel({ kind: "assign", item }), []);
  const openDeactivate = useCallback((item: AcademicThesisNcsItem) => setPanel({ kind: "deactivate", item }), []);
  const resetFilters = () => setFilters(EMPTY_THESIS_FILTERS);
  const errorMessage = query.error ? parseApiError(query.error).message : undefined;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {!embedded && (
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href={area === "admin" ? "/admin/overview" : "/academic"} className="hover:text-[#164E9B] flex items-center gap-1">
                <ArrowLeft className="size-3.5" /> Tổng quan học vụ
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-700">
                Quản lý đề tài luận án
              </span>
            </div>
          )}
          <h1 className="text-xl font-bold tracking-tight text-[#0F2744] sm:text-2xl">Quản lý đề tài luận án</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="lg" disabled={!filteredItems.length} onClick={() => exportThesesCsv(filteredItems)}>
            <Download /> Xuất CSV
          </Button>
          <Button type="button" size="lg" className="bg-[#164E9B] text-white hover:bg-[#123E7C]" disabled={!query.data} onClick={() => setPanel({ kind: "assign", item: null })}>
            <Plus /> Giao đề tài mới
          </Button>
        </div>
      </header>

      {(query.isLoading || query.data) && <ThesesKpiCards items={filteredItems} isLoading={query.isLoading} />}

      <section aria-label="Danh sách đề tài luận án" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <ThesesFilterBar
          filters={filters}
          onChange={setFilters}
          cohortOptions={cohortOptions}
          supervisorOptions={supervisorOptions}
          isFiltered={isFiltered}
          isFetching={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
        {errorMessage && query.data && <p role="alert" className="text-xs text-rose-700">Không thể cập nhật danh sách. {errorMessage}</p>}
        <ThesesTable
          data={filteredItems}
          isLoading={query.isLoading}
          errorMessage={query.data ? undefined : errorMessage}
          onRetry={() => void query.refetch()}
          onResetFilters={isFiltered ? resetFilters : undefined}
          onViewDetail={openDetail}
          onAssignThesis={openAssign}
          onDeactivateThesis={openDeactivate}
        />
      </section>

      {panel?.kind === "assign" && <ThesisAssignmentModal onClose={closePanel} student={panel.item} students={items} />}
      {panel?.kind === "deactivate" && panel.item.deTaiHienTai && (
        <ThesisDeactivateModal onClose={closePanel} item={panel.item} thesis={panel.item.deTaiHienTai} />
      )}
      {panel?.kind === "detail" && (
        <ThesisDetailDrawer
          isOpen
          onClose={closePanel}
          ncsId={panel.item.id}
          ncsSummary={panel.item}
          onAssignThesis={openAssign}
          onDeactivateThesis={openDeactivate}
        />
      )}
    </div>
  );
}

export function ThesesManagementView(props: ThesesManagementViewProps) {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-slate-500">Đang tải danh sách đề tài luận án…</p>}>
      <ThesesManagementViewContent {...props} />
    </Suspense>
  );
}

export default ThesesManagementView;
