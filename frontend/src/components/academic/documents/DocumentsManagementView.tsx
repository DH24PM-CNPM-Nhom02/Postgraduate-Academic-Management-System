"use client";

import { useMemo, useState } from "react";
import { type ColumnDef, type FilterFn } from "@tanstack/react-table";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/src/components/shared/ConfirmDialog";
import {
  ManagementDataTable,
  useManagementDataTable,
} from "@/src/components/ui/management-data-table";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import { useDocuments, useDeleteDocument } from "@/src/hooks/api/use-documents";
import { formatDate, formatFileSize } from "@/src/lib/utils";
import type { DocumentListItem, DocumentType } from "@/src/types/api/document";
import { UploadDocumentModal } from "./UploadDocumentModal";
import { DocumentCellAction } from "./DocumentCellAction";
import Link from "next/link";
const labels: Record<DocumentType, string> = {
  MINH_CHUNG_MOC: "Minh chứng mốc",
  PHIEU_NHAN_XET: "Phiếu nhận xét",
  QUYET_DINH: "Quyết định",
  MINH_CHUNG_NGOAI_NGU: "Minh chứng ngoại ngữ",
  MINH_CHUNG_CONG_NO: "Minh chứng công nợ",
  DON_TU: "Đơn từ",
  BIEU_MAU: "Biểu mẫu",
  QUY_DINH: "Quy định",
  KHAC: "Khác",
};
const filters = { all: "Tất cả loại tài liệu", ...labels };
const empty: DocumentListItem[] = [];

function normalizeSearch(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d").trim();
}

const filterByFileName: FilterFn<DocumentListItem> = (row, _columnId, keyword: string) =>
  normalizeSearch(row.original.originalName).includes(keyword);
filterByFileName.resolveFilterValue = normalizeSearch;

export function DocumentsManagementView( { embedded = false, area = "academic" }: { embedded?: boolean; area?: string }) {
  const query = useDocuments();
  const remove = useDeleteDocument();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState<DocumentListItem | null>(null);
  const data = useMemo(() => {
    const rows = query.data ?? empty;
    return type === "all"
      ? rows
      : rows.filter((row) => row.documentType === type);
  }, [query.data, type]);

  const columns = useMemo<ColumnDef<DocumentListItem>[]>(
    () => [
      {
        accessorKey: "originalName",
        header: "Tên tệp",
        cell: ({ row }) => (
          <span
            className="block max-w-[240px] truncate sm:max-w-[320px]"
            title={row.original.originalName}
          >
            {row.original.originalName}
          </span>
        ),
      },
      {
        accessorKey: "documentType",
        header: "Loại tài liệu",
        enableGlobalFilter: false,
        cell: ({ row }) => labels[row.original.documentType],
      },
      {
        accessorKey: "size",
        header: "Dung lượng",
        enableGlobalFilter: false,
        cell: ({ row }) => formatFileSize(row.original.size),
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tải lên",
        enableGlobalFilter: false,
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => (
          <DocumentCellAction key={row.original.id} document={row.original} onDelete={setSelected} />
        ),
      },
    ],
    [],
  );
  const table = useManagementDataTable({
    data,
    columns,
    globalFilter: search.trim(),
    onGlobalFilterChange: setSearch,
    globalFilterFn: filterByFileName,
  });

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {!embedded && (
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href={area === "admin" ? "/admin/overview" : "/academic"} className="hover:text-[#164E9B] flex items-center gap-1">
                <ArrowLeft className="size-3.5" /> Tổng quan học vụ
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-700">
                Quản lý tài liệu
              </span>
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
            Quản lý tài liệu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Danh sách tài liệu đã tải lên.
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-2 text-xs font-bold text-[#164E9B] hover:bg-blue-100 shadow-2xs transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
          <Upload />
          Tải lên tài liệu
        </Button>
      </header>
      
      <div className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap gap-3">
          <Input
            aria-label="Tìm theo tên tệp"
            placeholder="Tìm theo tên tệp…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select
            items={filters}
            value={type}
            onValueChange={(v) => setType(v ?? "all")}
          >
            <SelectTrigger aria-label="Lọc loại tài liệu" className="min-w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {Object.entries(filters).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {query.isError ? (
          <div
            role="alert"
            className="flex items-center gap-3 text-sm text-rose-700"
          >
            {query.error.message}
            <Button variant="outline" onClick={() => query.refetch()}>
              Thử lại
            </Button>
          </div>
        ) : (
          <ManagementDataTable
            table={table}
            itemLabel="tài liệu"
            minWidth="min-w-[680px]"
            emptyState={
              query.isPending
                ? "Đang tải danh sách…"
                : search.trim() || type !== "all"
                  ? "Không tìm thấy tài liệu phù hợp."
                  : "Chưa có tài liệu."
            }
          />
        )}
      </div>
      {uploadOpen && (
        <UploadDocumentModal onClose={() => setUploadOpen(false)} />
      )}
      {selected && (
        <ConfirmDialog
          isOpen
          variant="destructive"
          title="Xóa tài liệu"
          description={`Bạn muốn xóa “${selected.originalName}”?`}
          confirmLabel="Xóa tài liệu"
          isLoading={remove.isPending}
          error={remove.error?.message}
          onClose={() => {
            setSelected(null);
            remove.reset();
          }}
          onConfirm={() =>
            remove.mutate(selected.id, {
              onSuccess: () => {
                toast.success("Đã xóa tài liệu.");
                setSelected(null);
              },
            })
          }
        />
      )}
    </section>
  );
}
