"use client";

import { useState } from "react";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { ArrowLeft, Download, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatGraduatedRecordField, graduatedRecordFields } from "@/src/components/graduation/graduated-record-fields";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";
import { useExportGraduatedNcs, useGraduatedNcs } from "@/src/hooks/api/use-graduation";
import type { GraduatedNcsRecord } from "@/src/types/api/graduation";
import { GraduationLoadError, graduationPrimaryButton } from "./GraduationDialog";

const FILE_NAME = "danh-sach-ncs-da-tot-nghiep.xlsx";
const EMPTY_RECORDS: GraduatedNcsRecord[] = [];

const columns: ColumnDef<GraduatedNcsRecord>[] = graduatedRecordFields.map(({ key, label }) => ({
  accessorKey: key,
  header: label,
  enableGlobalFilter: key === "hoTen",
  cell: ({ row }) => {
    const value = formatGraduatedRecordField(row.original, key);
    if (!value) return <span className="text-slate-400" aria-label="Chưa có dữ liệu">—</span>;
    if (key === "mshv") return <span className="whitespace-nowrap font-semibold text-[#164E9B]">{value}</span>;
    return value;
  },
}));

function normalizeSearch(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d").trim();
}

const filterByIdentity: FilterFn<GraduatedNcsRecord> = ({ original }, _column, search: string) =>
  normalizeSearch(`${original.mshv} ${original.hoTen}`).includes(search);
filterByIdentity.resolveFilterValue = normalizeSearch;

export function GraduatedNcsView({ area }: { area: "academic" | "admin" }) {
  const [search, setSearch] = useState("");
  const query = useGraduatedNcs();
  const exportFile = useExportGraduatedNcs();
  const records = query.data ?? EMPTY_RECORDS;
  const table = useManagementDataTable({
    data: records,
    columns,
    globalFilter: search,
    onGlobalFilterChange: setSearch,
    globalFilterFn: filterByIdentity,
  });

  function download() {
    exportFile.mutate(undefined, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = FILE_NAME;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <nav aria-label="Điều hướng" className="mb-1 flex items-center gap-2 text-xs text-slate-500">
            <Link href={area === "admin" ? "/admin/graduation-check" : "/graduation-check"} className="flex items-center gap-1 hover:text-[#164E9B]">
              <ArrowLeft className="size-3.5" /> Xét tốt nghiệp
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="font-semibold text-slate-700">NCS đã tốt nghiệp</span>
          </nav>
          <h1 className="text-xl font-black tracking-tight text-[#0F2744] sm:text-2xl">NCS đã tốt nghiệp</h1>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Tra cứu hồ sơ công nhận tốt nghiệp và thông tin cấp bằng.</p>
        </div>
        <Button
          type="button"
          className={graduationPrimaryButton}
          title="Xuất toàn bộ danh sách NCS đã tốt nghiệp"
          disabled={exportFile.isPending || !query.isSuccess || records.length === 0}
          onClick={download}
        >
          <Download className="size-4" />
          {exportFile.isPending ? "Đang xuất Excel…" : "Xuất Excel"}
        </Button>
      </header>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            aria-label="Tìm theo mã hoặc họ tên NCS"
            placeholder="Tìm theo mã hoặc họ tên NCS…"
            className="h-9 pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        {query.isError ? (
          <GraduationLoadError message={query.error.message} onRetry={() => void query.refetch()} />
        ) : (
          <ManagementDataTable
            table={table}
            minWidth="min-w-[1350px]"
            itemLabel="NCS"
            emptyState={query.isPending
              ? "Đang tải danh sách…"
              : records.length ? "Không tìm thấy nghiên cứu sinh phù hợp." : "Chưa có nghiên cứu sinh đã tốt nghiệp."}
          />
        )}
      </div>
    </section>
  );
}
