"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";
import { ConfirmDialog } from "@/src/components/shared/ConfirmDialog";
import { academicStudentKeys, useNcsCohorts, useNcsTrainingMajors } from "@/src/hooks/use-academic-students";
import { parseApiError } from "@/src/lib/api";
import { TrainingCatalogService, type CatalogKind, type CatalogItem } from "@/src/services/training-catalog";

const labels = { majors: "ngành đào tạo", cohorts: "niên khóa" };
const primary = "inline-flex items-center gap-2 rounded-xl bg-[#164E9B] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50";
const secondary = "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50";
const input = "mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal";
const panel = "space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs";

function itemCode(item: CatalogItem) {
  return "maNganh" in item ? item.maNganh : item.maKhoaHoc;
}

function useRefreshCatalogs() {
  const client = useQueryClient();
  return async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: academicStudentKeys.all }),
      client.invalidateQueries({ queryKey: ["academic", "student"] }),
    ]);
  };
}

function CatalogForm({ kind, item, onClose }: {
  kind: CatalogKind;
  item: CatalogItem | null;
  onClose: () => void;
}) {
  const major = item && "maNganh" in item ? item : null;
  const cohort = item && "maKhoaHoc" in item ? item : null;
  const codeLabel = kind === "majors" ? "Mã ngành" : "Mã niên khóa";
  const refresh = useRefreshCatalogs();
  const save = useMutation({
    mutationFn: async (form: FormData) => {
      const code = String(form.get("code")).trim();
      if (!code) throw new Error(`Vui lòng nhập ${codeLabel.toLowerCase()}.`);
      if (kind === "majors") {
        const name = String(form.get("name")).trim();
        if (!name) throw new Error("Vui lòng nhập tên ngành.");
        await TrainingCatalogService.saveMajor({ maNganh: code, tenNganh: name }, major?.id);
      } else {
        const year = String(form.get("year")).trim();
        await TrainingCatalogService.saveCohort({
          maKhoaHoc: code,
          namTuyenSinh: year ? Number(year) : null,
          ghiChu: String(form.get("notes")).trim() || null,
        }, cohort?.id);
      }
    },
    onSuccess: async () => {
      toast.success(`Đã ${item ? "cập nhật" : "thêm"} ${labels[kind]}.`);
      await refresh();
      onClose();
    },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!save.isPending) save.mutate(new FormData(event.currentTarget));
  }

  return (
    <form className={panel} onSubmit={submit}>
      <h2 className="text-lg font-bold">{item ? "Chỉnh sửa" : "Thêm"} {labels[kind]}</h2>
      <fieldset disabled={save.isPending} className="grid gap-4 text-sm font-semibold sm:grid-cols-2">
        <label>{codeLabel} *
          <input autoFocus name="code" required maxLength={20} defaultValue={item ? itemCode(item) : ""} className={input} />
        </label>
        {kind === "majors" ? (
          <label>Tên ngành *
            <input name="name" required maxLength={150} defaultValue={major?.tenNganh} className={input} />
          </label>
        ) : (
          <>
            <label>Năm tuyển sinh
              <input name="year" type="number" min={1000} max={9999} step={1} defaultValue={cohort?.namTuyenSinh ?? ""} className={input} />
            </label>
            <label className="sm:col-span-2">Ghi chú
              <textarea name="notes" rows={3} defaultValue={cohort?.ghiChu ?? ""} className={input} />
            </label>
          </>
        )}
      </fieldset>
      {save.isError && <p role="alert" className="text-sm text-rose-700">{parseApiError(save.error).message}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={save.isPending} className={primary}>{save.isPending ? "Đang lưu…" : "Lưu"}</button>
        <button type="button" disabled={save.isPending} onClick={onClose} className={secondary}>Hủy</button>
      </div>
    </form>
  );
}

export function TrainingCatalogView({ kind, area }: { kind: CatalogKind; area: "admin" | "academic" }) {
  const majors = useNcsTrainingMajors(kind === "majors");
  const cohorts = useNcsCohorts(kind === "cohorts");
  const query = kind === "majors" ? majors : cohorts;
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState<CatalogItem | "new" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CatalogItem | null>(null);
  const refresh = useRefreshCatalogs();
  const remove = useMutation({
    mutationFn: (item: CatalogItem) => TrainingCatalogService.remove(kind, item.id),
    onSuccess: async () => {
      toast.success(`Đã xóa ${labels[kind]}.`);
      await refresh();
      setPendingDelete(null);
    },
  });

  const columns = useMemo<ColumnDef<CatalogItem>[]>(() => {
    const fields: ColumnDef<CatalogItem>[] = kind === "majors" ? [
      { accessorKey: "maNganh", header: "Mã ngành" },
      { accessorKey: "tenNganh", header: "Tên ngành" },
    ] : [
      { accessorKey: "maKhoaHoc", header: "Mã niên khóa" },
      { accessorKey: "namTuyenSinh", header: "Năm tuyển sinh", cell: info => info.getValue<number | null>() ?? "—" },
      { accessorKey: "ghiChu", header: "Ghi chú", cell: info => <span className="whitespace-pre-wrap">{info.getValue<string | null>() || "—"}</span> },
    ];
    return [...fields, {
      id: "actions", header: "Thao tác", cell: ({ row }) => (
        <div className="flex gap-2">
          <button className={secondary} onClick={() => setEditor(row.original)} aria-label={`Sửa ${itemCode(row.original)}`}><Pencil size={14} /> Sửa</button>
          <button className={secondary + " text-rose-700"} onClick={() => setPendingDelete(row.original)} aria-label={`Xóa ${itemCode(row.original)}`}><Trash2 size={14} /> Xóa</button>
        </div>
      ),
    }];
  }, [kind]);

  const data = useMemo(() => query.data ?? [], [query.data]);
  const table = useManagementDataTable<CatalogItem>({
    data, columns, getRowId: item => String(item.id), globalFilter: search,
    onGlobalFilterChange: setSearch,
    globalFilterFn: ({ original }, _column, value) => {
      const fields = "maNganh" in original ? [original.maNganh, original.tenNganh] :
        [original.maKhoaHoc, original.namTuyenSinh, original.ghiChu];
      return fields.some(field => String(field ?? "").toLocaleLowerCase("vi").includes(String(value).trim().toLocaleLowerCase("vi")));
    },
  });
  const label = labels[kind];

  return (
    <main className="space-y-5 text-slate-900">
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <nav aria-label="Đường dẫn điều hướng" className="mb-1 flex items-center gap-2 text-xs text-slate-500">
            <Link href={area === "admin" ? "/admin/overview" : "/academic"} className="flex items-center gap-1 hover:text-[#164E9B]">
              <ArrowLeft aria-hidden="true" className="size-3.5" /> Tổng quan học vụ
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="font-semibold text-slate-700">Quản lý {label}</span>
          </nav>
          <h1 className="text-xl font-black tracking-tight text-[#0F2744] sm:text-2xl">Quản lý {label}</h1>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            {kind === "cohorts"
              ? "Tra cứu và cập nhật mã niên khóa, năm tuyển sinh và ghi chú cho từng khóa nghiên cứu sinh."
              : "Tra cứu và cập nhật mã ngành, tên ngành đào tạo dùng trong hồ sơ nghiên cứu sinh."}
          </p>
        </div>
        {!editor && <button className={primary} onClick={() => setEditor("new")}><Plus size={16} /> Thêm {label}</button>}
      </header>
      {editor ? <CatalogForm kind={kind} item={editor === "new" ? null : editor} onClose={() => setEditor(null)} /> : (
        <section className={panel}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <Search size={16} className="text-slate-500" />
              <input className="min-w-0 flex-1 text-sm outline-none" type="search" aria-label={`Tìm ${label}`}
                placeholder={kind === "majors" ? "Tìm theo mã hoặc tên ngành" : "Tìm theo mã niên khóa, năm hoặc ghi chú"}
                value={search} onChange={e => { setSearch(e.target.value); table.setPageIndex(0); }} />
            </label>
            <button className={secondary} disabled={query.isFetching} onClick={() => void query.refetch()}><RefreshCw size={14} /> Làm mới</button>
          </div>
          {query.isError && <p role="alert" className="text-sm text-rose-700">{parseApiError(query.error).message}</p>}
          <ManagementDataTable table={table} minWidth="min-w-[600px]" itemLabel={label}
            emptyState={query.isLoading ? "Đang tải danh mục…" : query.isError ? "Vui lòng bấm Làm mới để tải lại." :
              search.trim() ? "Không tìm thấy kết quả phù hợp." : `Chưa có ${label}.`} />
        </section>
      )}
      <ConfirmDialog isOpen={!!pendingDelete} title={`Xóa ${label}`}
        description={`Bạn muốn xóa ${label} có mã ${pendingDelete ? itemCode(pendingDelete) : ""}?`}
        variant="destructive" confirmLabel="Xóa" isLoading={remove.isPending}
        error={remove.isError ? parseApiError(remove.error).message : null}
        onConfirm={() => { if (pendingDelete && !remove.isPending) remove.mutate(pendingDelete); }}
        onClose={() => { if (!remove.isPending) { setPendingDelete(null); remove.reset(); } }} />
    </main>
  );
}
