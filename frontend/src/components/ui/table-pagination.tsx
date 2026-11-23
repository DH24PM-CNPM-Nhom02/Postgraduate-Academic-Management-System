"use client";

import React, { useId } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

export interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  className?: string;
  disabled?: boolean;
  activeColor?: string;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

export function TablePagination({
  currentPage,
  totalItems,
  pageSize = 8,
  onPageChange,
  itemLabel = "mục",
  className = "",
  disabled = false,
  activeColor,
  pageSizeOptions,
  onPageSizeChange,
}: TablePaginationProps) {
  const pageSizeSelectId = useId();
  const safePageSize = Math.max(1, pageSize);
  const validPageSizeOptions = pageSizeOptions
    ? [...new Set([...pageSizeOptions, safePageSize])].filter((size) => Number.isInteger(size) && size > 0)
    : [];
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (safePage - 1) * safePageSize + 1;
  const endItem = Math.min(safePage * safePageSize, totalItems);

  // Thuật toán tạo dải số trang dạng pill
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1);

    if (safePage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (safePage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-3 gap-3 border-t border-slate-100 ${className}`}
    >
      {/* Bên trái: Thông tin hiển thị */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <div className="tabular-nums">
          {totalItems > 0 ? (
            <span>
              Hiển thị <span className="font-semibold text-slate-700">{startItem}</span> -{" "}
              <span className="font-semibold text-slate-700">{endItem}</span> của{" "}
              <span className="font-semibold text-slate-700">{totalItems}</span> {itemLabel}
            </span>
          ) : (
            <span>Không có {itemLabel} nào</span>
          )}
        </div>

        {onPageSizeChange && pageSizeOptions && pageSizeOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-slate-500" htmlFor={pageSizeSelectId}>
              Số dòng/trang
            </label>
            <Select
              items={validPageSizeOptions.map((size) => ({ value: String(size), label: String(size) }))}
              value={String(pageSize)}
              modal={false}
              onValueChange={(value) => {
                const nextSize = Number(value);
                if (Number.isInteger(nextSize) && nextSize > 0) onPageSizeChange(nextSize);
              }}
            >
              <SelectTrigger id={pageSizeSelectId} className="h-8 w-[4.5rem] rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700">
                <SelectValue>{(value) => value}</SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="min-w-20 rounded-lg border border-slate-200 bg-white text-xs shadow-xl">
                {validPageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Bên phải: Nút điều hướng phân trang */}
      <div className="flex items-center gap-1 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1 || disabled || totalItems === 0}
          aria-label="Trang trước"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:border-slate-100 disabled:bg-slate-50/50 cursor-pointer"
        >
          <ChevronLeft className="size-3.5" />
          <span className="hidden sm:inline">Trang trước</span>
        </button>

        {pageNumbers.map((p, idx) => {
          if (typeof p === "string") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="inline-flex size-7 items-center justify-center text-slate-400 select-none text-xs"
              >
                ...
              </span>
            );
          }

          const isActive = p === safePage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              disabled={disabled}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex size-7 items-center justify-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? `${activeColor || "bg-[#164E9B] text-white border-[#164E9B]"} shadow-xs`
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages || disabled || totalItems === 0}
          aria-label="Trang sau"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:border-slate-100 disabled:bg-slate-50/50 cursor-pointer"
        >
          <span className="hidden sm:inline">Trang sau</span>
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export default TablePagination;
