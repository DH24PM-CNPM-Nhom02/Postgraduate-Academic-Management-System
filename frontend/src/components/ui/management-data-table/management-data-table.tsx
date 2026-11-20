"use client";

import React, { type ReactNode } from "react";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { TablePagination } from "@/src/components/ui/table-pagination";

export interface ManagementDataTableProps<TData> {
  table: TanstackTable<TData>;
  headerStyles?: Record<string, string>;
  cellStyles?: Record<string, string>;
  emptyState: ReactNode;
  itemLabel?: string;
  minWidth?: string;
}

/** Shared renderer for management tables. Column definitions and empty state stay page-specific. */
export function ManagementDataTable<TData>({
  table,
  headerStyles = {},
  cellStyles = {},
  emptyState,
  itemLabel = "mục",
  minWidth = "min-w-[980px]",
}: ManagementDataTableProps<TData>) {
  const rows = table.getRowModel().rows;

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <Table className={`w-full ${minWidth} text-left text-xs text-slate-700`}>
          <TableHeader className="bg-slate-50 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-slate-200">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={headerStyles[header.id] ?? "py-3 px-3"}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 bg-white">
            {rows.length ? rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-blue-50/40 transition-colors border-b border-slate-100"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cellStyles[cell.column.id] ?? "py-3.5 px-3"}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={table.getAllLeafColumns().length} className="py-12 text-center text-slate-400">
                  {emptyState}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={table.getState().pagination.pageIndex + 1}
        totalItems={table.getFilteredRowModel().rows.length}
        pageSize={table.getState().pagination.pageSize}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        itemLabel={itemLabel}
      />
    </>
  );
}
