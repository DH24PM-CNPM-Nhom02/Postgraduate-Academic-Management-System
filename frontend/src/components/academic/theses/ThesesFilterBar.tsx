"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, Filter, RotateCcw, RefreshCw, X } from "lucide-react";
import type { ThesisViewFilterStatus } from "@/src/types/api/thesis";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";

export interface ThesesFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  cohort: string;
  onCohortChange: (value: string) => void;
  status: ThesisViewFilterStatus;
  onStatusChange: (value: ThesisViewFilterStatus) => void;
  supervisorId: string;
  onSupervisorChange: (value: string) => void;
  onResetFilters: () => void;
  cohortOptions?: { value: string; label: string }[];
  supervisorOptions?: { value: string; label: string }[];
  isFiltered?: boolean;
  totalResults?: number;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

const DEFAULT_COHORT_OPTIONS = [
  { value: "ALL", label: "Tất cả khóa học" },
];

const DEFAULT_STATUS_OPTIONS: { value: ThesisViewFilterStatus; label: string }[] = [
  { value: "ALL", label: "Tất cả trạng thái đề tài" },
  { value: "HIEU_LUC", label: "Đang hiệu lực (Có đề tài)" },
  { value: "CHUA_GIAO", label: "Chưa giao đề tài" },
  { value: "DA_THAY_THE", label: "Đã từng đổi đề tài" },
  { value: "DA_HUY", label: "Đã từng có đề tài hủy" },
];

const DEFAULT_SUPERVISOR_OPTIONS = [
  { value: "ALL", label: "Tất cả GVHD" },
];

export function ThesesFilterBar({
  search,
  onSearchChange,
  cohort,
  onCohortChange,
  status,
  onStatusChange,
  supervisorId,
  onSupervisorChange,
  onResetFilters,
  cohortOptions = DEFAULT_COHORT_OPTIONS,
  supervisorOptions = DEFAULT_SUPERVISOR_OPTIONS,
  isFiltered = false,
  totalResults,
  isLoading = false,
  onRefresh,
  className = "",
}: ThesesFilterBarProps) {
  // Local state cho ô search để gõ phím mượt mà và debounce
  const [localSearch, setLocalSearch] = useState(search);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dọn dẹp debounce timer khi unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setLocalSearch(nextVal);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearchChange(nextVal);
    }, 300);
  };

  const handleClearSearch = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setLocalSearch("");
    onSearchChange("");
  };

  const handleReset = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setLocalSearch("");
    onResetFilters();
  };

  const statusItems = useMemo(() => DEFAULT_STATUS_OPTIONS, []);
  const cohortItems = useMemo(
    () => (cohortOptions.length > 0 ? cohortOptions : DEFAULT_COHORT_OPTIONS),
    [cohortOptions]
  );
  const supervisorItems = useMemo(
    () => (supervisorOptions.length > 0 ? supervisorOptions : DEFAULT_SUPERVISOR_OPTIONS),
    [supervisorOptions]
  );

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 ${className}`}
    >
      {/* HEADER BỘ LỌC */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-[#164E9B]">
            <Filter className="size-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Tra cứu &amp; Lọc Đề tài Luận án
            </h2>
            {totalResults !== undefined && (
              <p className="text-[11px] text-slate-500">
                Tìm thấy{" "}
                <strong className="text-slate-800">{totalResults}</strong> nghiên
                cứu sinh
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              title="Làm mới danh sách dữ liệu"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`size-3.5 ${isLoading ? "animate-spin text-[#164E9B]" : ""}`}
              />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            disabled={!isFiltered && !localSearch}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              isFiltered || localSearch
                ? "border-blue-200 bg-blue-50 text-[#164E9B] hover:bg-blue-100"
                : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            <RotateCcw className="size-3.5" />
            <span>Đặt lại bộ lọc</span>
          </button>
        </div>
      </div>

      {/* CÁC ĐIỀU KIỆN LỌC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Ô TÌM KIẾM THEO TÊN/MSHV/ĐỀ TÀI */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchInput}
            placeholder="Tìm theo họ tên, MSHV, tên đề tài..."
            className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-8 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none transition-colors"
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Xóa từ khóa"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* 2. LỌC KHÓA HỌC */}
        <Select
          items={cohortItems}
          value={cohort || "ALL"}
          onValueChange={(val) => {
            onCohortChange(val ?? "ALL");
          }}
        >
          <SelectTrigger className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B] cursor-pointer">
            <SelectValue placeholder="Tất cả khóa học">
              {(val) =>
                cohortItems.find((it) => it.value === val)?.label ||
                "Tất cả khóa học"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            className="max-h-60 rounded-xl border border-slate-200 bg-white shadow-xl text-xs z-50"
            alignItemWithTrigger={false}
          >
            {cohortItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 3. LỌC TRẠNG THÁI ĐỀ TÀI */}
        <Select
          items={statusItems}
          value={status || "ALL"}
          onValueChange={(val) => {
            onStatusChange((val as ThesisViewFilterStatus) ?? "ALL");
          }}
        >
          <SelectTrigger className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B] cursor-pointer">
            <SelectValue placeholder="Tất cả trạng thái đề tài">
              {(val) =>
                statusItems.find((it) => it.value === val)?.label ||
                "Tất cả trạng thái đề tài"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            className="max-h-60 rounded-xl border border-slate-200 bg-white shadow-xl text-xs z-50"
            alignItemWithTrigger={false}
          >
            {statusItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 4. LỌC GIẢNG VIÊN HƯỚNG DẪN */}
        <Select
          items={supervisorItems}
          value={supervisorId || "ALL"}
          onValueChange={(val) => {
            onSupervisorChange(val ?? "ALL");
          }}
        >
          <SelectTrigger className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B] cursor-pointer">
            <SelectValue placeholder="Tất cả GVHD">
              {(val) =>
                supervisorItems.find((it) => it.value === val)?.label ||
                "Tất cả GVHD"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            className="max-h-60 rounded-xl border border-slate-200 bg-white shadow-xl text-xs z-50"
            alignItemWithTrigger={false}
          >
            {supervisorItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default ThesesFilterBar;
