"use client";

import { toast } from "sonner";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  UserCheck,
  Search,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Info,
  Plus,
  Loader2,
} from "lucide-react";
import { type ColumnDef, type ColumnFiltersState, type FilterFn } from "@tanstack/react-table";
import {
  ExcelImportModal,
  SupervisorAssignmentModal,
} from "@/src/components/academic";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { SupervisorCellAction } from "./SupervisorCellAction";
import { SupervisorUpdateModal } from "./SupervisorUpdateModal";
import { SupervisorDetailModal } from "./SupervisorDetailModal";
import {
  useAcademicSupervisors,
  useAcademicStudents,
  useDonViList,
} from "@/src/hooks/use-academic";
import type { SupervisorQuotaRecord } from "@/src/types/academic";

interface SupervisorsManagementViewProps {
  embedded?: boolean;
  area?: "academic" | "admin"
}

export function SupervisorsManagementView({ embedded = false, area = "academic" }: SupervisorsManagementViewProps) {
  // Chỉ gọi hook khi component này được mount!
  const { data: initialData, isLoading, isError, refetch, isFetching } = useAcademicSupervisors();
  const { data: studentsData } = useAcademicStudents();

  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams?.get("search") || "");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [quotaStatusFilter, setQuotaStatusFilter] = useState("all");

  const supervisorsList = useMemo(() => {
    const base = initialData ?? [];
    return base;
  }, [initialData]);

  const studentsList = useMemo(() => {
    return studentsData ?? [];
  }, [studentsData]);

  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignSupervisor, setAssignSupervisor] = useState<SupervisorQuotaRecord | null>(null);
  const [supervisorToUpdate, setSupervisorToUpdate] = useState<SupervisorQuotaRecord | null>(null);

  // Lắng nghe phím Escape để đóng Modal chi tiết GVHD
  useEffect(() => {
    if (!selectedSupervisorId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedSupervisorId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSupervisorId]);

  const selectedSupervisor = useMemo(
    () => supervisorsList.find((sv) => sv.id === selectedSupervisorId) ?? null,
    [supervisorsList, selectedSupervisorId]
  );

  const { data: dbDepartments = [] } = useDonViList();

  const handleImportSuccess = (importedCount: number) => {
    void refetch();
    toast.success(`Đã nhập thành công ${importedCount} giảng viên hướng dẫn vào hệ thống.`);
  };

  interface DepartmentFilterItem {
    value: string;
    label: string;
    dropdownLabel: string;
    isParent?: boolean;
    isChild?: boolean;
    level: number;
    hasDividerBefore?: boolean;
    matchingDepartments: string[];
  }

  const departmentFilterItems = useMemo<DepartmentFilterItem[]>(() => {
    const items: DepartmentFilterItem[] = [
      {
        value: "all",
        label: "Tất cả Khoa / Bộ môn",
        dropdownLabel: "Tất cả Khoa / Bộ môn",
        matchingDepartments: [],
        level: 0,
      },
    ];

    if (dbDepartments.length > 0) {
      // 1. Phân nhóm các đơn vị theo cấp cha - con
      const parentUnits = dbDepartments.filter((d) => !d.parentId);
      const childUnitsMap = new Map<string, typeof dbDepartments>();

      dbDepartments.forEach((d) => {
        if (d.parentId) {
          const list = childUnitsMap.get(d.parentId) || [];
          list.push(d);
          childUnitsMap.set(d.parentId, list);
        }
      });

      // Sắp xếp các đơn vị cha theo thứ tự tiếng Việt
      parentUnits.sort((a, b) => a.ten.localeCompare(b.ten, "vi"));

      parentUnits.forEach((parent) => {
        const children = childUnitsMap.get(parent.id) || [];
        children.sort((a, b) => a.ten.localeCompare(b.ten, "vi"));

        const parentIcon = parent.loai === "KHOA" ? "🏛️" : parent.loai === "PHONG_BAN" ? "🏢" : "📂";
        const matching = [parent.ten, ...children.map((c) => c.ten)];

        // Thêm đơn vị cha
        items.push({
          value: parent.ten,
          label: parent.ten,
          dropdownLabel: `${parentIcon} ${parent.ten}${children.length > 0 ? ` (${children.length} bộ môn)` : ""}`,
          isParent: true,
          level: 0,
          hasDividerBefore: true,
          matchingDepartments: matching,
        });

        // Thêm các đơn vị con
        children.forEach((child, idx) => {
          const isLast = idx === children.length - 1;
          const branchPrefix = isLast ? "└── " : "├── ";
          items.push({
            value: child.ten,
            label: child.ten,
            dropdownLabel: `   ${branchPrefix}${child.ten}`,
            isChild: true,
            level: 1,
            matchingDepartments: [child.ten],
          });
        });
      });

      // 2. Bổ sung các đơn vị có trong danh sách GVHD nhưng chưa nằm trong DB
      const allKnownDeptNames = new Set(dbDepartments.map((d) => d.ten));
      const extraDepts = Array.from(
        new Set(
          supervisorsList
            .map((s) => s.department?.trim())
            .filter((dept): dept is string => Boolean(dept) && !allKnownDeptNames.has(dept))
        )
      ).sort((a, b) => a.localeCompare(b, "vi"));

      if (extraDepts.length > 0) {
        items.push({
          value: "__group_other__",
          label: "Đơn vị khác",
          dropdownLabel: "📌 Đơn vị khác",
          isParent: true,
          level: 0,
          hasDividerBefore: true,
          matchingDepartments: extraDepts,
        });

        extraDepts.forEach((dept, idx) => {
          const isLast = idx === extraDepts.length - 1;
          items.push({
            value: dept,
            label: dept,
            dropdownLabel: `   ${isLast ? "└── " : "├── "}${dept}`,
            isChild: true,
            level: 1,
            matchingDepartments: [dept],
          });
        });
      }
    } else {
      // Fallback khi danh mục DB chưa nạp xong: lấy từ danh sách GVHD
      const distinctDepts = Array.from(
        new Set(supervisorsList.map((s) => s.department?.trim()).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b, "vi"));

      distinctDepts.forEach((dept) => {
        items.push({
          value: dept,
          label: dept,
          dropdownLabel: dept,
          matchingDepartments: [dept],
          level: 0,
        });
      });
    }

    return items;
  }, [dbDepartments, supervisorsList]);

  const quotaFilterItems = [
    { value: "all", label: "Tất cả tình trạng hạn ngạch" },
    { value: "available", label: "Còn chỉ tiêu nhận thêm" },
    { value: "full", label: "Đã đủ định mức" },
  ];

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    if (departmentFilter !== "all") filters.push({ id: "department", value: departmentFilter });
    if (quotaStatusFilter !== "all") filters.push({ id: "quotaStatus", value: quotaStatusFilter });
    return filters;
  }, [departmentFilter, quotaStatusFilter]);

  const globalFilterFn: FilterFn<SupervisorQuotaRecord> = (row, _columnId, filterValue) => {
    const query = String(filterValue ?? "").trim().toLocaleLowerCase();
    if (!query) return true;
    const supervisor = row.original;
    return [supervisor.name, supervisor.code, supervisor.department, supervisor.degree]
      .some((value) => value.toLocaleLowerCase().includes(query));
  };

  const columns = useMemo<ColumnDef<SupervisorQuotaRecord>[]>(() => [
    {
      id: "supervisor",
      accessorKey: "name",
      header: "Giảng viên Hướng dẫn",
      cell: ({ row }) => (
        <div>
          <span className="block font-bold text-slate-900">{row.original.name}</span>
          <span className="font-mono text-[10px] text-slate-500">{row.original.code} · {row.original.degree}</span>
        </div>
      ),
    },
    {
      id: "department",
      accessorKey: "department",
      header: "Khoa / Bộ môn",
      filterFn: (row, _columnId, filterValue) => {
        if (!filterValue || filterValue === "all") return true;
        const selected = departmentFilterItems.find((item) => item.value === filterValue);
        const dept = row.original.department;
        const parentDept = row.original.parentDepartment;

        if (selected && selected.matchingDepartments.length > 0) {
          return selected.matchingDepartments.some(
            (m) => m === dept || m === parentDept
          );
        }
        return dept === filterValue || parentDept === filterValue;
      },
      cell: ({ row }) => <span className="font-medium text-slate-700">{row.original.department}</span>,
    },
    {
      id: "independentCount",
      accessorKey: "independentCount",
      header: "HD Độc lập (1.0)",
      cell: ({ row }) => <span className="font-semibold text-slate-800">{row.original.independentCount} NCS ({row.original.independentCount.toFixed(1)}đ)</span>,
    },
    {
      id: "coCount",
      accessorKey: "coCount",
      header: "Đồng HD (0.5)",
      cell: ({ row }) => <span className="font-semibold text-slate-800">{row.original.coCount} NCS ({(row.original.coCount * 0.5).toFixed(1)}đ)</span>,
    },
    {
      id: "quota",
      accessorKey: "usedQuota",
      header: "Hạn ngạch hiện tại",
      cell: ({ row }) => {
        const supervisor = row.original;
        const percent = supervisor.maxQuota > 0
          ? Math.min(100, Math.round((supervisor.usedQuota / supervisor.maxQuota) * 100))
          : 0;
        const isFull = supervisor.remainingQuota <= 0;
        return (
          <div>
            <span className={`font-bold ${isFull ? "text-rose-600" : "text-[#0F2744]"}`}>
              {supervisor.usedQuota.toFixed(1)} / {supervisor.maxQuota.toFixed(1)} NCS
            </span>
            <div className="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full rounded-full transition-all ${isFull ? "bg-rose-500" : percent > 75 ? "bg-amber-500" : "bg-[#164E9B]"}`} style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      },
    },
    {
      id: "quotaStatus",
      accessorFn: (supervisor) => supervisor.remainingQuota > 0 ? "available" : "full",
      header: "Khả năng nhận thêm",
      filterFn: "equalsString",
      cell: ({ row }) => (
        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${row.original.statusColor}`}>
          {row.original.statusText}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="block text-right">Thao tác</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <SupervisorCellAction
            supervisor={row.original}
            onUpdate={setSupervisorToUpdate}
            onViewDetail={(supervisor) => setSelectedSupervisorId(supervisor.id)}
          />
        </div>
      ),
    },
  ], [departmentFilterItems]);

  const table = useManagementDataTable({
    data: supervisorsList,
    columns,
    globalFilter: searchTerm,
    onGlobalFilterChange: setSearchTerm,
    columnFilters,
    globalFilterFn,
    initialPageSize: 8,
  });

  const totalSupervisors = supervisorsList.length;
  const availableSupervisors = supervisorsList.filter((s) => s.remainingQuota > 0).length;
  const fullSupervisors = supervisorsList.filter((s) => s.remainingQuota === 0).length;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {isError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          Không thể tải danh sách từ máy chủ. Vui lòng bấm làm mới để thử lại.
        </p>
      )}
      {/* PAGE HEADER & BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {!embedded && (
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href={area === "admin" ? "/admin/overview" : "/academic"} className="hover:text-[#164E9B] flex items-center gap-1">
                <ArrowLeft className="size-3.5" /> Tổng quan học vụ
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-700">
                Quản lý Giáo viên hướng dẫn
              </span>
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
            Quản lý Định mức &amp; Hạn ngạch GVHD (Quy định số 655/QĐ-ĐHAG)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kiểm soát và phân bổ hạn ngạch hướng dẫn nghiên cứu sinh theo Quy định chương trình và tổ chức đào tạo trình độ tiến sĩ.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
              <Loader2 className="size-3.5 animate-spin text-[#164E9B]" />
              <span>Đang tải...</span>
            </div>
          )}
          {/* NÚT PHÂN CÔNG NCS MỚI */}
          <button
            disabled={studentsList.length === 0 || supervisorsList.length === 0}
            onClick={() => {
              setAssignSupervisor(null);
              setAssignModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-3.5 py-2 text-xs font-bold text-[#164E9B] hover:bg-blue-100 shadow-2xs transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserCheck className="size-4" />
            <span>Phân công NCS</span>
          </button>

          {/* NÚT THÊM GVHD (MỞ MODAL IMPORT EXCEL) */}
          <button
            onClick={() => setImportModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#164E9B] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#123E7C] shadow-xs transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Thêm GVHD</span>
          </button>
        </div>
      </div>

      {/* QUICK SUMMARY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tổng số GVHD
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-[#164E9B]">
              <UserCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F2744]">{totalSupervisors}</span>
            <span className="text-xs text-slate-500">giảng viên làm việc tại trường &amp; thỉnh giảng</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Đủ tiêu chuẩn hướng dẫn NCS</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Còn chỉ tiêu nhận thêm
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-900">{availableSupervisors}</span>
            <span className="text-xs font-semibold text-emerald-700">giảng viên</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Có thể phân công NCS khóa tuyển sinh mới</p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
              Đã đủ trần định mức
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-rose-100 text-rose-800">
              <AlertCircle className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-900">{fullSupervisors}</span>
            <span className="text-xs font-semibold text-rose-700">giảng viên</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Đạt trần 3.0 - 4.0 NCS, tạm dừng nhận thêm</p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#164E9B]">
              Quy chế BR-09
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-[#164E9B]">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-[#0F2744]">Độc lập: 1.0</span>
            <span className="text-xs text-slate-500">• Đồng HD: 0.5</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">Trần: TS (3.0), PGS/GS (4.0 có ĐT Bộ)</p>
        </div>
      </div>

      {/* REGULATION CALLOUT NOTE */}
      <div className="rounded-2xl border border-blue-200 bg-[#EBF3FC] p-4 text-xs text-slate-700 flex items-start gap-3">
        <Info className="size-5 text-[#164E9B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-[#0F2744]">
            Quy định phân công và tính định mức hướng dẫn nghiên cứu sinh:
          </p>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Theo Quy chế Đào tạo Trình độ Tiến sĩ ban hành theo Quy định chương trình và tổ chức đào tạo trình độ tiến sĩ Số 655/QĐ-ĐHAG:
            Mỗi nghiên cứu sinh được hướng dẫn bởi tối đa 02 người (01 GVHD chính và 01 Đồng hướng dẫn).
            Giảng viên có học vị Tiến sĩ hướng dẫn tối đa <strong>3.0 NCS</strong> cùng thời điểm;
            Phó Giáo sư được hướng dẫn tối đa <strong>5.0 NCS</strong>; Giáo sư được hướng dẫn tối đa <strong>7.0 NCS</strong>.
            Hệ thống sẽ tự động khóa tùy chọn phân công khi giảng viên vượt hạn mức cho phép.
          </p>
        </div>
      </div>

      {/* DANH SÁCH GVHD */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Danh sách Giảng viên Hướng dẫn &amp; Tiến độ Hạn ngạch</h2>
            <p className="mt-0.5 text-xs text-slate-500">Hiển thị số lượng NCS độc lập, đồng hướng dẫn và chỉ tiêu khả dụng hiện tại.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Đồng bộ dữ liệu mới nhất từ máy chủ"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-blue-50/50 px-3 py-1.5 text-xs font-semibold text-[#164E9B] transition-colors hover:bg-blue-100/70 disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span>{isFetching ? "Đang đồng bộ..." : "Đồng bộ từ máy chủ"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setDepartmentFilter("all");
                setQuotaStatusFilter("all");
                table.setPageIndex(0);
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
            >
              Đặt lại
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                table.setPageIndex(0);
              }}
              placeholder="Tìm giảng viên, mã CB, khoa..."
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-[#164E9B] focus:bg-white focus:ring-1 focus:ring-[#164E9B]"
            />
          </div>

          <Select
            items={departmentFilterItems}
            value={departmentFilter}
            onValueChange={(value) => {
              setDepartmentFilter(value ?? "all");
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger className="h-9 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-[#164E9B] focus:bg-white">
              <SelectValue placeholder="Tất cả Khoa / Bộ môn">
                {(value) => departmentFilterItems.find((item) => item.value === value)?.label ?? "Tất cả Khoa / Bộ môn"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="max-h-80 w-[380px] rounded-xl border border-slate-200 bg-white text-xs shadow-xl">
              {departmentFilterItems.map((item) => (
                <React.Fragment key={item.value}>
                  {item.hasDividerBefore && <SelectSeparator className="my-1 border-slate-100" />}
                  <SelectItem
                    value={item.value}
                    className={
                      item.isParent
                        ? "font-semibold text-slate-900 bg-slate-50/70 py-1.5 cursor-pointer hover:bg-slate-100"
                        : item.isChild
                          ? "pl-4 text-slate-600 font-normal py-1 cursor-pointer hover:bg-slate-50 hover:text-slate-900"
                          : "font-medium text-slate-800 py-1.5"
                    }
                  >
                    <span className={item.isChild ? "font-mono whitespace-pre text-[11px]" : ""}>
                      {item.dropdownLabel}
                    </span>
                  </SelectItem>
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={quotaFilterItems}
            value={quotaStatusFilter}
            onValueChange={(value) => {
              setQuotaStatusFilter(value ?? "all");
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger className="h-9 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-[#164E9B] focus:bg-white">
              <SelectValue placeholder="Tất cả tình trạng hạn ngạch">
                {(value) => quotaFilterItems.find((item) => item.value === value)?.label ?? "Tất cả tình trạng hạn ngạch"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="max-h-64 rounded-xl border border-slate-200 bg-white text-xs shadow-xl">
              {quotaFilterItems.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <ManagementDataTable
          table={table}
          headerStyles={{
            supervisor: "min-w-[200px] py-3 px-3",
            department: "min-w-[150px] py-3 px-3",
            independentCount: "min-w-[130px] py-3 px-3 whitespace-nowrap",
            coCount: "min-w-[120px] py-3 px-3 whitespace-nowrap",
            quota: "min-w-[150px] py-3 px-3",
            quotaStatus: "min-w-[150px] py-3 px-3",
            actions: "min-w-[80px] py-3 px-3 text-right",
          }}
          cellStyles={{
            supervisor: "py-3 px-3",
            department: "py-3 px-3",
            independentCount: "py-3 px-3",
            coCount: "py-3 px-3",
            quota: "py-3 px-3",
            quotaStatus: "py-3 px-3",
            actions: "py-3 px-3 text-right",
          }}
          itemLabel="giảng viên hướng dẫn"
          minWidth="min-w-[1000px]"
          pageSizeOptions={[8, 16, 32, 64]}
          emptyState={
            <div>
              <p className="font-semibold text-slate-600">{supervisorsList.length === 0 ? "Chưa có giảng viên hướng dẫn." : "Không tìm thấy giảng viên nào phù hợp với bộ lọc."}</p>
              <p className="mt-1 text-[11px] text-slate-400">{supervisorsList.length === 0 ? "Bấm Thêm GVHD để nhập danh sách từ file Excel." : "Thử thay đổi từ khóa hoặc điều kiện lọc."}</p>
            </div>
          }
        />
      </section>

      {/* EXCEL IMPORT MODAL */}
      <ExcelImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        entityType="supervisor"
        onSuccess={handleImportSuccess}
      />

      {/* SUPERVISOR ASSIGNMENT MODAL */}
      <SupervisorAssignmentModal
        key={`assign-${assignModalOpen}-${assignSupervisor?.id ?? "none"}`}
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setAssignSupervisor(null);
        }}
        selectedSupervisor={assignSupervisor}
        students={studentsList}
        supervisors={supervisorsList}
        onSuccess={(msg: string) => {
          toast.success(msg);
        }}
      />

      <SupervisorUpdateModal
        key={supervisorToUpdate?.id ?? "supervisor-update"}
        isOpen={Boolean(supervisorToUpdate)}
        onClose={() => setSupervisorToUpdate(null)}
        supervisor={supervisorToUpdate}
        onSuccess={toast.success}
      />

      {/* MODAL POP-UP: HỒ SƠ CHI TIẾT GIẢNG VIÊN HƯỚNG DẪN */}
      <SupervisorDetailModal
        isOpen={Boolean(selectedSupervisorId)}
        onClose={() => setSelectedSupervisorId(null)}
        supervisorId={selectedSupervisorId}
        fallbackSupervisor={selectedSupervisor}
        studentsList={studentsList}
      />
    </div>
  );
}
