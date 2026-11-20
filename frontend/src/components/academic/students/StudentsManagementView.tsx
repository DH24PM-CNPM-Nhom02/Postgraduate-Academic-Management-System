"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RefreshCw,
  Filter,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Download,
  Plus,
  CheckCircle2,
  Loader2,
  UserCheck,
  Scale,
} from "lucide-react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
} from "@tanstack/react-table";
import { ManagementDataTable, useManagementDataTable } from "@/src/components/ui/management-data-table";
import {
  StudentDetailModal,
  StudentUpdateModal,
  ExcelImportModal,
  DecisionIssueModal,
  MOCK_STUDENTS,
  MOCK_SUPERVISORS,
} from "@/src/components/academic";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import { StudentCellAction } from "./StudentCellAction";
import { useAcademicStudents, useAcademicSupervisors } from "@/src/hooks/use-academic";
import type { StudentDossier } from "@/src/types/academic";
import SupervisorAssignmentModal from "../SupervisorAssignmentModal";

interface StudentsManagementViewProps {
  /** Khi được nhúng trong dashboard tab, có thể ẩn breadcrumb quay lại */
  embedded?: boolean;
}

const headerStyles: Record<string, string> = {
  name: "py-3 px-3.5 whitespace-nowrap min-w-[140px]",
  department: "py-3 px-3 min-w-[160px]",
  thesisTopic: "py-3 px-3 min-w-[280px] lg:min-w-[340px]",
  currentMilestoneIndex: "py-3 px-3 whitespace-nowrap min-w-[125px]",
  status: "py-3 px-3 whitespace-nowrap min-w-[125px]",
  actions: "py-3 px-3 text-right whitespace-nowrap min-w-[80px]",
};

const cellStyles: Record<string, string> = {
  name: "py-3.5 px-3.5 whitespace-nowrap min-w-[140px]",
  department: "py-3.5 px-3 min-w-[160px]",
  thesisTopic: "py-3.5 px-3 whitespace-normal min-w-[280px] lg:min-w-[340px]",
  currentMilestoneIndex: "py-3.5 px-3 whitespace-nowrap min-w-[125px]",
  status: "py-3.5 px-3 whitespace-nowrap min-w-[125px]",
  actions: "py-3.5 px-3 text-right whitespace-nowrap min-w-[80px]",
};

export function StudentsManagementView({ embedded = false }: StudentsManagementViewProps) {
  // Kết nối API NCS từ Backend qua React Query Hook (chỉ fetch 1 lần)
  const { data: initialData, isLoading, refetch, isFetching } = useAcademicStudents();
  const { data: supervisorsData } = useAcademicSupervisors();

  // Search & Filter States
  const [studentSearchText, setStudentSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [milestoneFilter, setMilestoneFilter] = useState("all");

  // Danh sách NCS mới được import qua Excel
  const [importedStudents, setImportedStudents] = useState<StudentDossier[]>([]);

  // Lưu vết cập nhật GVHD cục bộ để hiển thị ngay tức thì lên giao diện
  const [localSupervisorUpdates, setLocalSupervisorUpdates] = useState<
    Record<string, { supervisorMain?: string; supervisorCo?: string }>
  >({});

  // Dữ liệu hợp nhất từ API (hoặc MOCK_STUDENTS) kết hợp các bản ghi import thêm và cập nhật GVHD tức thì
  // Luôn sắp xếp giảm dần: NCS mới tạo hiển thị trước NCS tạo lâu rồi
  const studentsList = useMemo(() => {
    const base = initialData && Array.isArray(initialData) && initialData.length > 0 ? initialData : MOCK_STUDENTS;
    const merged = [...importedStudents, ...base];
    const withUpdates = merged.map((std) => {
      const update = localSupervisorUpdates[std.id];
      if (!update) return std;
      return {
        ...std,
        supervisorMain: update.supervisorMain ?? std.supervisorMain,
        supervisorCo: update.supervisorCo ?? std.supervisorCo,
      };
    });

    return [...withUpdates].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return (b.code || "").localeCompare(a.code || "");
    });
  }, [initialData, importedStudents, localSupervisorUpdates]);

  const supervisorsList = useMemo(() => {
    return supervisorsData && Array.isArray(supervisorsData) && supervisorsData.length > 0
      ? supervisorsData
      : MOCK_SUPERVISORS;
  }, [supervisorsData]);

  // Modal State
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDossier | null>(null);
  const [studentToUpdate, setStudentToUpdate] = useState<StudentDossier | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [actionStudent, setActionStudent] = useState<StudentDossier | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle Excel Import Success
  const handleImportSuccess = (newStudents: StudentDossier[]) => {
    setImportedStudents((prev) => [...newStudents, ...prev]);
    setToastMessage(
      `Đã thêm thành công ${newStudents.length} nghiên cứu sinh từ file Excel vào hệ thống.`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Danh sách các chuyên ngành xuất hiện trong dữ liệu để lọc linh hoạt
  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    studentsList.forEach((s) => {
      if (s.department) set.add(s.department);
    });
    return Array.from(set).sort();
  }, [studentsList]);

  const departmentItems = useMemo(() => [
    { value: "all", label: "Tất cả chuyên ngành" },
    ...departmentOptions.map((dept) => ({ value: dept, label: dept })),
  ], [departmentOptions]);

  const milestoneItems = useMemo(() => [
    { value: "all", label: "Tất cả các mốc đào tạo" },
    { value: "1", label: "Mốc 1: Nhận QĐ công nhận NCS & Đề tài" },
    { value: "2", label: "Mốc 2: Tiểu luận tổng quan" },
    { value: "3", label: "Mốc 3: Đề cương nghiên cứu" },
    { value: "4", label: "Mốc 4: Chuyên đề 1" },
    { value: "5", label: "Mốc 5: Chuyên đề 2" },
    { value: "6", label: "Mốc 6: Báo cáo định kỳ" },
    { value: "7", label: "Mốc 7: Seminar cuối khóa" },
    { value: "8", label: "Mốc 8: Bảo vệ cấp ĐVCM" },
    { value: "9", label: "Mốc 9: Bảo vệ cấp cơ sở đào tạo" },
  ], []);

  const statusItems = useMemo(() => [
    { value: "all", label: "Tất cả trạng thái tiến độ" },
    { value: "active", label: "Đúng tiến độ (>12 tháng)" },
    { value: "warning", label: "Cảnh báo (<12 tháng)" },
    { value: "overdue", label: "Cảnh báo khẩn (<3 tháng)" },
  ], []);

  // Bộ lọc cột dành cho TanStack Table
  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    if (departmentFilter !== "all") {
      filters.push({ id: "department", value: departmentFilter });
    }
    if (statusFilter !== "all") {
      filters.push({ id: "status", value: statusFilter });
    }
    if (milestoneFilter !== "all") {
      filters.push({ id: "currentMilestoneIndex", value: Number(milestoneFilter) });
    }
    return filters;
  }, [departmentFilter, statusFilter, milestoneFilter]);

  // Hàm tìm kiếm toàn cục đa trường (client-side)
  const globalFilterFn: FilterFn<StudentDossier> = (row, _columnId, filterValue) => {
    const query = String(filterValue || "").trim().toLowerCase();
    if (!query) return true;
    const s = row.original;
    return (
      s.name.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query) ||
      s.thesisTopic.toLowerCase().includes(query) ||
      s.supervisorMain.toLowerCase().includes(query) ||
      Boolean(s.supervisorCo && s.supervisorCo.toLowerCase().includes(query))
    );
  };

  // Định nghĩa các cột cho TanStack Table
  const columns = useMemo<ColumnDef<StudentDossier>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: () => <span>Họ tên &amp; MSSV</span>,
        cell: ({ row }) => (
          <div>
            <span className="font-bold text-slate-900 block text-xs">
              {row.original.name}
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-medium">
              {row.original.code}
            </span>
          </div>
        ),
      },
      {
        id: "department",
        accessorKey: "department",
        header: () => <span>Ngành &amp; Năm tuyển sinh</span>,
        cell: ({ row }) => (
          <div>
            <span className="font-semibold text-slate-800 block text-xs">
              {row.original.department}
            </span>
            <span className="text-[11px] text-slate-500 block">
              {row.original.admissionYear
                ? `Năm tuyển sinh: ${row.original.admissionYear}`
                : row.original.cohort}
            </span>
          </div>
        ),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue === "all") return true;
          return row.getValue(columnId) === filterValue;
        },
      },
      {
        id: "thesisTopic",
        accessorKey: "thesisTopic",
        header: () => <span>Đề tài luận án &amp; GVHD</span>,
        cell: ({ row }) => (
          <div>
            <p className="line-clamp-2 text-slate-700 italic">
              “{row.original.thesisTopic}”
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 mt-1">
              <span>
                GVHD chính: <strong>{row.original.supervisorMain}</strong>
              </span>
              {row.original.supervisorCo && (
                <span>
                  Đồng HD: <strong>{row.original.supervisorCo}</strong>
                </span>
              )}
            </div>
          </div>
        ),
      },
      {
        id: "currentMilestoneIndex",
        accessorKey: "currentMilestoneIndex",
        header: () => <span>Mốc hiện tại</span>,
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-[#164E9B] px-3 py-1 text-[11px] font-bold whitespace-nowrap">
            Mốc {row.original.currentMilestoneIndex} / 9
          </span>
        ),
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue === "all") return true;
          return Number(row.getValue(columnId)) === Number(filterValue);
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: () => <span>Thời gian còn lại</span>,
        cell: ({ row }) => {
          const { remainingMonths } = row.original;
          return remainingMonths > 12 ? (
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap">
              {remainingMonths} tháng
            </span>
          ) : remainingMonths > 3 ? (
            <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap">
              {remainingMonths} tháng (Cảnh báo)
            </span>
          ) : (
            <span className="rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap animate-pulse">
              {remainingMonths} tháng (Khẩn)
            </span>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue === "all") return true;
          return row.getValue(columnId) === filterValue;
        },
      },
      {
        id: "actions",
        header: () => <span className="text-right block pr-1">Thao tác</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end pr-1">
            <StudentCellAction
              student={row.original}
              onAssignSupervisor={(std) => {
                setActionStudent(std);
                setAssignModalOpen(true);
              }}
              onIssueDecision={(std) => {
                setActionStudent(std);
                setDecisionModalOpen(true);
              }}
              onViewDetail={(std) => {
                setSelectedStudent(std);
                setStudentModalOpen(true);
              }}
              onUpdateInfo={setStudentToUpdate}
            />
          </div>
        ),
      },
    ],
    []
  );

  const table = useManagementDataTable({
    data: studentsList,
    columns,
    globalFilter: studentSearchText,
    onGlobalFilterChange: setStudentSearchText,
    columnFilters,
    globalFilterFn,
    initialPageSize: 8,
  });

  const activeCount = useMemo(
    () => studentsList.filter((s) => s.status === "active").length,
    [studentsList]
  );
  const warningCount = useMemo(
    () => studentsList.filter((s) => s.status === "warning" || s.status === "overdue").length,
    [studentsList]
  );

  const handleResetFilters = () => {
    setStudentSearchText("");
    setDepartmentFilter("all");
    setStatusFilter("all");
    setMilestoneFilter("all");
    table.setPageIndex(0);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-xl text-xs font-semibold text-emerald-900 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="rounded p-1 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
          >
          </button>
        </div>
      )}

      {/* PAGE HEADER & BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {!embedded && (
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link
                href="/academic"
                className="hover:text-[#164E9B] flex items-center gap-1"
              >
                <ArrowLeft className="size-3" />
                <span>Tổng quan học vụ</span>
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-700">
                Quản lý Nghiên cứu sinh
              </span>
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
            Quản lý Nghiên cứu sinh Toàn trường
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Theo dõi tiến độ 9 mốc đào tạo, hồ sơ đề tài, phân công GVHD và
            chuẩn đầu ra nghiên cứu sinh.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
              <Loader2 className="size-3.5 animate-spin text-[#164E9B]" />
              <span>Đang tải dữ liệu...</span>
            </div>
          )}

          {/* NÚT PHÂN CÔNG GVHD */}
          <button
            onClick={() => {
              setActionStudent(null);
              setAssignModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-2 text-xs font-bold text-[#164E9B] hover:bg-blue-100 shadow-2xs transition-all cursor-pointer"
            title="Phân công hoặc thay đổi Giảng viên Hướng dẫn"
          >
            <UserCheck className="size-4" />
            <span className="hidden sm:inline">Phân công GVHD</span>
          </button>

          {/* NÚT BAN HÀNH QUYẾT ĐỊNH HỌC VỤ */}
          <button
            onClick={() => {
              setActionStudent(null);
              setDecisionModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 shadow-2xs transition-all cursor-pointer"
            title="Ban hành quyết định thay đổi trạng thái (Bảo lưu, Gia hạn, Buộc thôi học...)"
          >
            <Scale className="size-4 text-amber-700" />
            <span className="hidden sm:inline">Ban hành QĐ</span>
          </button>

          {/* NÚT THÊM NCS (MỞ MODAL IMPORT EXCEL) */}
          <button
            onClick={() => setImportModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#164E9B] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#123E7C] shadow-xs transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Thêm NCS</span>
          </button>

          <button
            onClick={() => {
              alert(
                "Đang chuẩn bị trích xuất dữ liệu danh sách NCS định dạng Excel..."
              );
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
          >
            <Download className="size-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* QUICK STAT METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tổng số NCS quản lý
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-[#164E9B]">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F2744]">
              {studentsList.length}
            </span>
            <span className="text-xs text-slate-500">nghiên cứu sinh</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Thuộc các Khoa chuyên ngành trọng điểm
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Đúng tiến độ đào tạo
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-900">
              {activeCount}
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              {studentsList.length > 0
                ? `${((activeCount / studentsList.length) * 100).toFixed(0)}% tổng số`
                : "0%"}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            Thời gian đào tạo còn trên 12 tháng
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Cảnh báo thời hạn (&lt;12 tháng)
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-900">
              {warningCount}
            </span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-full">
              1 ca khẩn cấp (&lt;3 tháng)
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            Cần đôn đốc nộp hồ sơ bảo vệ cấp ĐVCM
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH PANEL */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-[#164E9B]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Bộ lọc &amp; Tra cứu thông tin NCS
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Đồng bộ dữ liệu mới nhất từ máy chủ"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#164E9B] bg-blue-50/50 hover:bg-blue-100/70 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span>{isFetching ? "Đang đồng bộ..." : "Đồng bộ từ máy chủ"}</span>
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>Đặt lại bộ lọc</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <input
              type="text"
              value={studentSearchText}
              onChange={(e) => {
                setStudentSearchText(e.target.value);
                table.setPageIndex(0);
              }}
              placeholder="Tìm theo họ tên, MSSV, đề tài, GVHD..."
              className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none"
            />
          </div>

          {/* Department Filter */}
          <Select
            items={departmentItems}
            value={departmentFilter}
            onValueChange={(val) => {
              setDepartmentFilter(val ?? "all");
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B] cursor-pointer">
              <SelectValue placeholder="Tất cả chuyên ngành">
                {(val) => departmentItems.find((it) => it.value === val)?.label || "Tất cả chuyên ngành"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60 rounded-xl border border-slate-200 bg-white shadow-xl text-xs z-50"  alignItemWithTrigger={false}>
              {departmentItems.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Milestone Filter */}
          <Select
            items={milestoneItems}
            value={milestoneFilter}
            onValueChange={(val) => {
              setMilestoneFilter(val ?? "all");
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B] cursor-pointer">
              <SelectValue placeholder="Tất cả các mốc đào tạo">
                {(val) => milestoneItems.find((it) => it.value === val)?.label || "Tất cả các mốc đào tạo"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60 rounded-xl border border-slate-200 bg-white shadow-xl text-xs z-50"  alignItemWithTrigger={false}>
              {milestoneItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            items={statusItems}
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val ?? "all");
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B] cursor-pointer">
              <SelectValue placeholder="Tất cả trạng thái tiến độ">
                {(val) => statusItems.find((it) => it.value === val)?.label || "Tất cả trạng thái tiến độ"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60 rounded-xl border border-slate-200 bg-white shadow-xl text-xs z-50"  alignItemWithTrigger={false}>
              {statusItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* RESULTS TABLE */}
        <ManagementDataTable
          table={table}
          headerStyles={headerStyles}
          cellStyles={cellStyles}
          itemLabel="nghiên cứu sinh"
          emptyState={
            <>
              <Users className="size-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">
                Không tìm thấy nghiên cứu sinh nào phù hợp với điều kiện tìm kiếm.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Thử điều chỉnh từ khóa tìm kiếm hoặc bấm &ldquo;Đặt lại bộ lọc&rdquo;.
              </p>
            </>
          }
        />
      </div>

      {/* STUDENT DETAIL MODAL */}
      <StudentDetailModal
        isOpen={studentModalOpen}
        onClose={() => {
          setStudentModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />

      <StudentUpdateModal
        key={studentToUpdate?.id ?? "student-update"}
        isOpen={Boolean(studentToUpdate)}
        onClose={() => setStudentToUpdate(null)}
        student={studentToUpdate}
        onSuccess={(msg) => {
          setToastMessage(msg);
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />

      {/* EXCEL IMPORT MODAL */}
      <ExcelImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        entityType="student"
        onSuccess={handleImportSuccess}
      />

      {/* SUPERVISOR ASSIGNMENT MODAL */}
      <SupervisorAssignmentModal
        key={`assign-${assignModalOpen}-${actionStudent?.id ?? "none"}`}
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setActionStudent(null);
        }}
        selectedStudent={actionStudent}
        students={studentsList}
        supervisors={supervisorsList}
        onSuccess={(msg, studentId, supervisorName, role) => {
          if (studentId && supervisorName && role) {
            setLocalSupervisorUpdates((prev) => ({
              ...prev,
              [studentId]: {
                ...prev[studentId],
                ...(role === "HUONG_DAN_CHINH"
                  ? { supervisorMain: supervisorName }
                  : { supervisorCo: supervisorName }),
              },
            }));
          }
          setToastMessage(msg);
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />

      {/* DECISION ISSUE MODAL */}
      <DecisionIssueModal
        key={`decision-${decisionModalOpen}-${actionStudent?.id ?? "none"}`}
        isOpen={decisionModalOpen}
        onClose={() => {
          setDecisionModalOpen(false);
          setActionStudent(null);
        }}
        selectedStudent={actionStudent}
        students={studentsList}
        onSuccess={(msg) => {
          setToastMessage(msg);
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />
    </div>
  );
}
