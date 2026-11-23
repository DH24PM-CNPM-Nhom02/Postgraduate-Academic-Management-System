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
  pageSizeOptions?: number[];
  onRowClick?: (row: TData) => void;
  renderRowDetails?: (row: TData) => ReactNode;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [8, 16, 32, 64];

/** Shared renderer for management tables. Column definitions and empty state stay page-specific. */
export function ManagementDataTable<TData>({
  table,
  headerStyles = {},
  cellStyles = {},
  emptyState,
  itemLabel = "mục",
  minWidth = "min-w-[980px]",
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onRowClick,
  renderRowDetails,
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
            {rows.length ? rows.map((row) => {
              const details = renderRowDetails?.(row.original);
              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    onClick={onRowClick && (() => onRowClick(row.original))}
                    className={`border-b border-slate-100 transition-colors hover:bg-blue-50/40 ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={cellStyles[cell.column.id] ?? "py-3.5 px-3"}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {details && (
                    <TableRow className="bg-slate-50">
                      <TableCell colSpan={row.getVisibleCells().length} className="whitespace-normal px-3 py-3.5">
                        {details}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            }) : (
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
        totalItems={table.getRowCount()}
        pageSize={table.getState().pagination.pageSize}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={(pageSize) => {
          table.setPageSize(pageSize);
          table.setPageIndex(0);
        }}
        itemLabel={itemLabel}
      />
    </>
  );
}
