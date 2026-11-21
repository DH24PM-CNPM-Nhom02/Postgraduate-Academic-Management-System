"use client";

import { RefreshCw, RotateCcw, Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import type { ThesisViewFilterStatus } from "@/src/types/api/thesis";

type FilterOption = { value: string; label: string };

export interface ThesisFilters {
  search: string;
  cohort: string;
  status: ThesisViewFilterStatus;
  supervisorId: string;
}

export const EMPTY_THESIS_FILTERS: ThesisFilters = {
  search: "",
  cohort: "ALL",
  status: "ALL",
  supervisorId: "ALL",
};

const STATUS_OPTIONS: { value: ThesisViewFilterStatus; label: string }[] = [
  { value: "ALL", label: "Tất cả trạng thái đề tài" },
  { value: "HIEU_LUC", label: "Có đề tài đang hiệu lực" },
  { value: "CHUA_GIAO", label: "Chưa có đề tài hiệu lực" },
  { value: "DA_THAY_THE", label: "Có đề tài đã thay thế" },
  { value: "DA_HUY", label: "Có đề tài đã hủy" },
];

interface ThesesFilterBarProps {
  filters: ThesisFilters;
  onChange: (filters: ThesisFilters) => void;
  cohortOptions: FilterOption[];
  supervisorOptions: FilterOption[];
  isFiltered: boolean;
  isFetching: boolean;
  onRefresh: () => void;
}

export function ThesesFilterBar({
  filters,
  onChange,
  cohortOptions,
  supervisorOptions,
  isFiltered,
  isFetching,
  onRefresh,
}: ThesesFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-52 flex-1">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
        <Input
          type="search"
          aria-label="Tìm theo họ tên, MSHV hoặc tên đề tài"
          placeholder="Tìm theo họ tên, MSHV hoặc tên đề tài"
          className="h-9 pl-9 text-xs"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
      </div>
      <ThesisFilterSelect
        label="Khóa học"
        options={cohortOptions}
        value={filters.cohort}
        onChange={(cohort) => onChange({ ...filters, cohort })}
      />
      <ThesisFilterSelect
        label="Trạng thái đề tài"
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={(status) => onChange({ ...filters, status })}
      />
      <ThesisFilterSelect
        label="Giảng viên hướng dẫn"
        options={supervisorOptions}
        value={filters.supervisorId}
        onChange={(supervisorId) => onChange({ ...filters, supervisorId })}
      />
      <Button type="button" variant="outline" size="lg" disabled={!isFiltered} onClick={() => onChange(EMPTY_THESIS_FILTERS)}>
        <RotateCcw /> Đặt lại
      </Button>
      <Button type="button" variant="outline" size="icon-lg" aria-label="Làm mới danh sách" disabled={isFetching} onClick={onRefresh}>
        <RefreshCw className={isFetching ? "animate-spin" : undefined} />
      </Button>
    </div>
  );
}

function ThesisFilterSelect<Value extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: Value; label: string }[];
  value: Value;
  onChange: (value: Value) => void;
}) {
  return (
    <Select items={options} value={value} onValueChange={(next) => next && onChange(next)}>
      <SelectTrigger aria-label={label} className="h-9 max-w-56 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
