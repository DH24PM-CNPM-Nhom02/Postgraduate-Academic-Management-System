"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";
import { formatDate } from "@/src/lib/utils";
import type { AcademicThesisNcsItem } from "@/src/types/api/thesis";
import { ThesisRowAction, type ThesisRowActionProps } from "./ThesisRowAction";
import { ThesisStatusBadge } from "./ThesisStatusBadge";

interface ThesesTableProps extends Omit<ThesisRowActionProps, "item" | "onViewDecision"> {
  data: AcademicThesisNcsItem[];
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onResetFilters?: () => void;
}

const CELL_STYLES = {
  thesis: "w-2/5 min-w-64 whitespace-normal px-3 py-3.5",
  supervisors: "min-w-40 whitespace-normal px-3 py-3.5",
  actions: "px-3 py-3.5 text-right",
};

export function ThesesTable({
  data,
  isLoading,
  errorMessage,
  onRetry,
  onResetFilters,
  onViewDetail,
  onAssignThesis,
  onDeactivateThesis,
}: ThesesTableProps) {
  const columns = useMemo<ColumnDef<AcademicThesisNcsItem>[]>(() => [
    {
      accessorKey: "mshv",
      header: "MSHV",
      cell: ({ row }) => (
        <button
          type="button"
          className="cursor-pointer font-mono font-semibold text-[#164E9B] hover:underline"
          onClick={() => onViewDetail(row.original)}
        >
          {row.original.mshv}
        </button>
      ),
    },
    {
      accessorKey: "hoTen",
      header: "Họ tên NCS",
      cell: ({ row }) => <span className="font-semibold text-slate-900">{row.original.hoTen}</span>,
    },
    {
      accessorKey: "khoaHoc",
      header: "Khóa học",
      cell: ({ row }) => row.original.khoaHoc || "—",
    },
    {
      id: "thesis",
      header: "Đề tài hiện tại",
      cell: ({ row }) => {
        const item = row.original;
        const thesis = item.deTaiHienTai;
        const decision = thesis?.quyetDinh;
        const historyCount = item.deTais?.filter(({ trangThai }) => trangThai !== "HIEU_LUC").length ?? 0;
        return (
          <div className="max-w-xs space-y-1">
            {thesis ? (
              <p className="line-clamp-2 break-words font-medium text-slate-900" title={thesis.tenDeTai}>
                {thesis.tenDeTai}
              </p>
            ) : <span className="text-slate-400">—</span>}
            {decision && (
              <p className="text-slate-500">
                QĐ {decision.soQuyetDinh} · {formatDate(decision.ngayQuyetDinh)}
              </p>
            )}
            {historyCount > 0 && (
              <button type="button" className="cursor-pointer text-[#164E9B] hover:underline" onClick={() => onViewDetail(item)}>
                Xem lịch sử ({historyCount})
              </button>
            )}
          </div>
        );
      },
    },
    {
      id: "supervisors",
      header: "Giảng viên hướng dẫn",
      cell: ({ row }) => {
        const assignments = row.original.phanCongs ?? [];
        if (!assignments.length) return <span className="text-slate-400">Chưa phân công</span>;
        return assignments.map(({ id, vaiTro, gvhd }) => (
          <p key={id} className="leading-relaxed">
            {gvhd.hoTen}
            {vaiTro === "HUONG_DAN_CHINH" && <span className="text-slate-500"> · Chính</span>}
            {vaiTro === "DONG_HUONG_DAN" && <span className="text-slate-500"> · Đồng hướng dẫn</span>}
          </p>
        ));
      },
    },
    {
      accessorKey: "trangThaiDeTai",
      header: "Trạng thái hiện tại",
      cell: ({ row }) => <ThesisStatusBadge status={row.original.trangThaiDeTai} />,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <ThesisRowAction
          item={row.original}
          onViewDetail={onViewDetail}
          onAssignThesis={onAssignThesis}
          onDeactivateThesis={onDeactivateThesis}
          onViewDecision={onViewDetail}
        />
      ),
    },
  ], [onViewDetail, onAssignThesis, onDeactivateThesis]);

  const table = useManagementDataTable({
    data,
    columns,
    globalFilter: "",
    onGlobalFilterChange: () => {},
  });

  let emptyState = (
    <div className="space-y-2">
      <BookOpen className="mx-auto size-6" />
      <p className="text-slate-600">
        {onResetFilters ? "Không có nghiên cứu sinh khớp với bộ lọc." : "Chưa có dữ liệu nghiên cứu sinh."}
      </p>
      {onResetFilters && <Button type="button" variant="outline" onClick={onResetFilters}>Đặt lại bộ lọc</Button>}
    </div>
  );
  if (isLoading) {
    emptyState = <p role="status"><Loader2 className="mx-auto mb-2 size-5 animate-spin" />Đang tải đề tài…</p>;
  } else if (errorMessage) {
    emptyState = (
      <div className="space-y-2" role="alert">
        <AlertCircle className="mx-auto size-6 text-rose-600" />
        <p className="text-slate-700">{errorMessage}</p>
        <Button type="button" variant="outline" onClick={onRetry}>Thử lại</Button>
      </div>
    );
  }

  return (
    <ManagementDataTable
      table={table}
      cellStyles={CELL_STYLES}
      headerStyles={{ actions: "px-3 py-3 text-right" }}
      emptyState={emptyState}
      itemLabel="nghiên cứu sinh"
    />
  );
}
