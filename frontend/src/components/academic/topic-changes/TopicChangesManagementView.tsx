"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Tabs } from "@base-ui/react/tabs";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";
import { ArrowLeft, Eye, Loader2, RefreshCw, RotateCcw, Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ManagementDataTable } from "@/src/components/ui/management-data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { useChangeRequests, useChangeRequestsForSearch } from "@/src/hooks/use-change-requests";
import { parseApiError } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type { ChangeRequestItem, ChangeRequestStatus, ChangeRequestType } from "@/src/types/api/change-request";
import { REQUEST_STATUSES, REQUEST_STATUS_OPTIONS, REQUEST_TYPES, supervisorName } from "./change-request-labels";
import { ChangeRequestReviewModal } from "./ChangeRequestReviewModal";

const DEFAULT_STATUS = "CHO_DUYET";
const EMPTY_REQUESTS: ChangeRequestItem[] = [];
const CELL_STYLES = {
  subject: "min-w-60 whitespace-normal break-words px-3 py-3.5",
  actions: "px-3 py-3.5 text-right",
};

function normalizeSearch(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d").trim();
}

function RequestSubject({ item }: { item: ChangeRequestItem }) {
  switch (item.loai) {
    case "DOI_DE_TAI":
      return <span className="line-clamp-2" title={item.tenDeTaiMoi ?? undefined}>{item.tenDeTaiMoi || "—"}</span>;
    case "DOI_GVHD":
      return <span>{supervisorName(item.gvhdMoi)}</span>;
    case "GIA_HAN":
      return (
        <div className="space-y-1">
          <p>{item.soThangGiaHan == null ? "—" : `${item.soThangGiaHan} tháng`}</p>
          {item.hanMoiDeNghi && <p className="text-slate-500">Đến {formatDate(item.hanMoiDeNghi)}</p>}
        </div>
      );
  }
}

export function TopicChangesManagementView({
  embedded = false,
  area = "academic",
}: {
  embedded?: boolean;
  area?: "academic" | "admin";
}) {
  const [type, setType] = useState<ChangeRequestType>("DOI_DE_TAI");
  const [status, setStatus] = useState<ChangeRequestStatus | "ALL">(DEFAULT_STATUS);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 8 });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const keyword = normalizeSearch(search);
  const searching = Boolean(keyword);
  const filters = { loai: type, trangThai: status === "ALL" ? undefined : status };
  const pageQuery = useChangeRequests(
    { ...filters, page: pagination.pageIndex + 1, limit: pagination.pageSize },
    !searching,
  );
  const searchQuery = useChangeRequestsForSearch(filters, searching);
  const searchItems = searchQuery.data ?? EMPTY_REQUESTS;
  const filteredItems = useMemo(() => searchItems.filter((item) =>
    [item.ncs.mshv, item.ncs.hoTen, item.tenDeTaiMoi, item.gvhdMoi?.hoTen]
      .some((field) => field && normalizeSearch(field).includes(keyword)),
  ), [searchItems, keyword]);

  const query = searching ? searchQuery : pageQuery;
  const items = searching ? filteredItems : pageQuery.data?.data ?? EMPTY_REQUESTS;
  const total = searching ? filteredItems.length : pageQuery.data?.total ?? 0;
  const resetPage = () => setPagination((current) => ({ ...current, pageIndex: 0 }));
  const openDetail = useCallback((id: string) => setSelectedId(id), []);

  // A review or another user's update can shrink the selected status queue.
  const lastPageIndex = Math.max(0, Math.ceil(total / pagination.pageSize) - 1);
  if (query.data && pagination.pageIndex > lastPageIndex) {
    setPagination({ ...pagination, pageIndex: lastPageIndex });
  }

  const columns = useMemo<ColumnDef<ChangeRequestItem>[]>(() => [
    {
      accessorKey: "ncs.mshv",
      header: "MSHV",
      cell: ({ row }) => (
        <button type="button" className="cursor-pointer font-mono font-semibold text-[#164E9B] hover:underline" onClick={() => openDetail(row.original.id)}>
          {row.original.ncs.mshv}
        </button>
      ),
    },
    {
      accessorKey: "ncs.hoTen",
      header: "Họ tên NCS",
      cell: ({ row }) => <span className="font-semibold text-slate-900">{row.original.ncs.hoTen}</span>,
    },
    {
      id: "subject",
      header: type === "DOI_DE_TAI" ? "Đề tài đề xuất" : type === "DOI_GVHD" ? "GVHD đề xuất" : "Thời gian đề nghị gia hạn",
      cell: ({ row }) => <RequestSubject item={row.original} />,
    },
    {
      accessorKey: "createdAt",
      header: "Ngày gửi",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: "trangThai",
      header: "Trạng thái",
      cell: ({ row }) => {
        const badge = REQUEST_STATUSES[row.original.trangThai];
        return <span className={`inline-flex rounded-full border px-2 py-1 font-medium ${badge.color}`}>{badge.label}</span>;
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="outline"
          aria-label={`Xem đề nghị của ${row.original.ncs.hoTen}, ${row.original.ncs.mshv}`}
          onClick={() => openDetail(row.original.id)}
        >
          <Eye /> {row.original.trangThai === "CHO_DUYET" ? "Xem xét" : "Chi tiết"}
        </Button>
      ),
    },
  ], [type, openDetail]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: items,
    columns,
    getRowId: (item) => item.id,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: !searching,
    rowCount: total,
    autoResetPageIndex: false,
  });

  const typeLabel = REQUEST_TYPES.find((option) => option.value === type)?.label;
  const resetFilters = () => {
    setStatus(DEFAULT_STATUS);
    setSearch("");
    resetPage();
  };
  const error = query.error ? parseApiError(query.error).message : null;

  return (
    <div className="space-y-5">
      <header>
        {!embedded && (

          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href={area === "admin" ? "/admin/overview" : "/academic"} className="hover:text-[#164E9B] flex items-center gap-1">
              <ArrowLeft className="size-3.5" /> Tổng quan học vụ
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">
              Duyệt đề nghị điều chỉnh
            </span>
          </div>
        )}
        <h1 className="text-xl font-bold tracking-tight text-[#0F2744] sm:text-2xl">Duyệt đề nghị điều chỉnh</h1>
      </header>

      <Tabs.Root
        value={type}
        onValueChange={(value) => {
          setType(value);
          resetPage();
        }}
        className="space-y-4"
      >
        <Tabs.List aria-label="Loại đề nghị điều chỉnh" className="flex w-fit max-w-full flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
          {REQUEST_TYPES.map((option) => (
            <Tabs.Tab
              key={option.value}
              value={option.value}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-600 outline-offset-2 hover:text-[#164E9B] data-active:bg-white data-active:text-[#164E9B] data-active:shadow-xs"
            >
              {option.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel key={type} value={type} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs text-slate-600">
            {type === "GIA_HAN"
              ? "Chỉ nghiên cứu sinh được gửi đề nghị gia hạn cho chính mình."
              : "Nghiên cứu sinh có thể tự gửi đề nghị. GVHD đang hướng dẫn có thể gửi thay."}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-52 flex-1">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
              <Input
                type="search"
                className="h-9 pl-9"
                aria-label="Tìm đề nghị"
                placeholder={type === "DOI_DE_TAI" ? "Tìm theo MSHV, họ tên hoặc đề tài" : type === "DOI_GVHD" ? "Tìm theo MSHV, họ tên hoặc GVHD" : "Tìm theo MSHV hoặc họ tên"}
                value={search}
                onChange={(event) => { setSearch(event.target.value); resetPage(); }}
              />
            </div>
            <Select
              items={REQUEST_STATUS_OPTIONS}
              value={status as string}
              onValueChange={(value) => {
                if (value !== "ALL" && (!value || !Object.hasOwn(REQUEST_STATUSES, value))) return;
                setStatus(value as ChangeRequestStatus | "ALL");
                resetPage();
              }}
            >
              <SelectTrigger aria-label="Trạng thái đề nghị" className="h-9 min-w-44"><SelectValue /></SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {REQUEST_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" size="lg" disabled={!search && status === DEFAULT_STATUS} onClick={resetFilters}>
              <RotateCcw /> Đặt lại
            </Button>
            <Button type="button" variant="outline" size="icon-lg" aria-label="Làm mới danh sách" disabled={query.isFetching} onClick={() => void query.refetch()}>
              <RefreshCw className={query.isFetching ? "animate-spin" : undefined} />
            </Button>
          </div>
          {error && (
            <div role="alert" className="flex flex-wrap items-center gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
              <p>{error}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => void query.refetch()}>Thử lại</Button>
            </div>
          )}
          <ManagementDataTable
            table={table}
            cellStyles={CELL_STYLES}
            headerStyles={{ actions: "px-3 py-3 text-right" }}
            minWidth="min-w-[790px]"
            itemLabel="đề nghị"
            emptyState={query.isPending ? (
              <p role="status"><Loader2 className="mx-auto mb-2 size-5 animate-spin" /> Đang tải đề nghị…</p>
            ) : (
              <p>{error ? "Không tải được danh sách đề nghị." : `Không có đề nghị ${typeLabel?.toLowerCase()} khớp với bộ lọc.`}</p>
            )}
          />
        </Tabs.Panel>
      </Tabs.Root>

      {selectedId && <ChangeRequestReviewModal key={selectedId} id={selectedId} area={area} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
