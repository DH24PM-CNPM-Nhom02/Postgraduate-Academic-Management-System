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

// A new filter array on each render would repeatedly trigger TanStack's page reset.
const EMPTY_COLUMN_FILTERS: ColumnFiltersState = [];

export interface UseManagementDataTableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  getRowId?: (row: TData) => string;
  globalFilter?: string;
  onGlobalFilterChange?: (updater: Updater<string>) => void;
  columnFilters?: ColumnFiltersState;
  globalFilterFn?: FilterFn<TData>;
  initialPageSize?: number;
}

/** Shared TanStack setup for management pages with client-side filtering and pagination. */
export function useManagementDataTable<TData>({
  data,
  columns,
  getRowId,
  globalFilter = "",
  onGlobalFilterChange,
  columnFilters = EMPTY_COLUMN_FILTERS,
  globalFilterFn,
  initialPageSize = 8,
}: UseManagementDataTableOptions<TData>) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: initialPageSize });

  // TanStack Table instances expose mutable APIs that React Compiler cannot memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  return useReactTable({
    data,
    columns,
    getRowId,
    state: { globalFilter, columnFilters, pagination },
    onPaginationChange: setPagination,
    onGlobalFilterChange,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
}
