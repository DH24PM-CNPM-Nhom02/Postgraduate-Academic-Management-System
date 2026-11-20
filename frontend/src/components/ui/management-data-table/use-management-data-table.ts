"use client";

import { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type Updater,
} from "@tanstack/react-table";

export interface UseManagementDataTableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  globalFilter: string;
  onGlobalFilterChange: (updater: Updater<string>) => void;
  columnFilters?: ColumnFiltersState;
  globalFilterFn?: FilterFn<TData>;
  initialPageSize?: number;
}

/** Shared TanStack setup for management pages with client-side filtering and pagination. */
export function useManagementDataTable<TData>({
  data,
  columns,
  globalFilter,
  onGlobalFilterChange,
  columnFilters = [],
  globalFilterFn,
  initialPageSize = 8,
}: UseManagementDataTableOptions<TData>) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: initialPageSize });

  // TanStack Table instances expose mutable APIs that React Compiler cannot memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  return useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters, pagination },
    onPaginationChange: setPagination,
    onGlobalFilterChange,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
}
