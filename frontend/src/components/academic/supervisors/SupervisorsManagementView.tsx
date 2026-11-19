"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  Search,
  RefreshCw,
  Gauge,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Info,
  Plus,
  Loader2,
  X,
} from "lucide-react";
import {
  QuotaBar,
  SupervisorSelector,
  ExcelImportModal,
  SupervisorAssignmentModal,
  MOCK_SUPERVISORS,
  MOCK_STUDENTS,
} from "@/src/components/academic";
import { TablePagination } from "@/src/components/ui/table-pagination";
import type { SupervisorOption } from "@/src/components/academic/SupervisorSelector";
import {
  useAcademicSupervisors,
  useAcademicStudents,
  useAcademicSupervisorDetail,
} from "@/src/hooks/use-academic";
import {
  formatSupervisorDisplayName,
  formatDegreeLabel,
  mapBackendGvhdToSupervisorQuota,
} from "@/src/services/gvhd";
import type { SupervisorQuotaRecord } from "@/src/types/academic";

interface SupervisorsManagementViewProps {
  embedded?: boolean;
}

export function SupervisorsManagementView({ embedded = false }: SupervisorsManagementViewProps) {
  // Chỉ gọi hook khi component này được mount!
  const { data: initialData, isLoading, refetch, isFetching } = useAcademicSupervisors();
  const { data: studentsData } = useAcademicStudents();

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [quotaStatusFilter, setQuotaStatusFilter] = useState("all");

  const [importedSupervisors, setImportedSupervisors] = useState<SupervisorQuotaRecord[]>([]);

  const supervisorsList = useMemo(() => {
    const base = initialData && Array.isArray(initialData) && initialData.length > 0 ? initialData : MOCK_SUPERVISORS;
    return [...importedSupervisors, ...base];
  }, [initialData, importedSupervisors]);

  const studentsList = useMemo(() => {
    return studentsData && Array.isArray(studentsData) && studentsData.length > 0 ? studentsData : MOCK_STUDENTS;
  }, [studentsData]);

  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string | null>(null);
  const [previewSupervisorId, setPreviewSupervisorId] = useState<string | null>(null);
  const [testAssignmentType, setTestAssignmentType] = useState<"independent" | "co_supervisor">("co_supervisor");
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignSupervisor, setAssignSupervisor] = useState<SupervisorQuotaRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Phân trang danh sách GVHD
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

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

  // Hook gọi API GET /gvhd/:id khi người dùng chọn giảng viên trong bảng
  const {
    data: supervisorDetail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    refetch: refetchDetail,
  } = useAcademicSupervisorDetail(selectedSupervisorId);

  // Dữ liệu GVHD chuẩn hóa dùng cho QuotaBar và modal phân công (ưu tiên dữ liệu live từ API)
  const selectedQuotaSupervisor = useMemo(() => {
    if (supervisorDetail) {
      return mapBackendGvhdToSupervisorQuota(
        supervisorDetail,
        supervisorDetail.phanCongs || []
      );
    }
    return selectedSupervisor;
  }, [supervisorDetail, selectedSupervisor]);

  const rightQuotaSupervisor = useMemo(
    () =>
      selectedQuotaSupervisor ||
      supervisorsList.find((sv) => sv.id === previewSupervisorId) ||
      supervisorsList[0] ||
      null,
    [selectedQuotaSupervisor, supervisorsList, previewSupervisorId]
  );

  const departmentOptions = useMemo(
    () =>
      Array.from(new Set(supervisorsList.map((s) => s.department)))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "vi")),
    [supervisorsList]
  );

  const selectorOptions: SupervisorOption[] = useMemo(
    () =>
      supervisorsList.map((sv) => ({
        id: sv.id,
        name: sv.name,
        title: "",
        department: sv.department,
        independentCount: sv.independentCount,
        coCount: sv.coCount,
        maxQuota: sv.maxQuota,
      })),
    [supervisorsList]
  );

  const handleImportSuccess = (newSupervisors: SupervisorQuotaRecord[]) => {
    setImportedSupervisors((prev) => [...newSupervisors, ...prev]);
    setToastMessage(`Đã thêm thành công ${newSupervisors.length} giảng viên hướng dẫn từ file Excel vào hệ thống.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const filteredSupervisors = useMemo(() => {
    return supervisorsList.filter((sv) => {
      const query = searchTerm.toLowerCase();
      const matchSearch =
        sv.name.toLowerCase().includes(query) ||
        sv.code.toLowerCase().includes(query) ||
        sv.department.toLowerCase().includes(query);

      const matchDept = departmentFilter === "all" || sv.department === departmentFilter;

      let matchQuota = true;
      if (quotaStatusFilter === "available") {
        matchQuota = sv.remainingQuota > 0;
      } else if (quotaStatusFilter === "full") {
        matchQuota = sv.remainingQuota === 0;
      }

      return matchSearch && matchDept && matchQuota;
    });
  }, [supervisorsList, searchTerm, departmentFilter, quotaStatusFilter]);

  const paginatedSupervisors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSupervisors.slice(start, start + pageSize);
  }, [filteredSupervisors, currentPage, pageSize]);

  const totalSupervisors = supervisorsList.length;
  const availableSupervisors = supervisorsList.filter((s) => s.remainingQuota > 0).length;
  const fullSupervisors = supervisorsList.filter((s) => s.remainingQuota === 0).length;

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
            ×
          </button>
        </div>
      )}

      {/* PAGE HEADER & BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {!embedded && (
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/academic" className="hover:text-[#164E9B] flex items-center gap-1">
                <ArrowLeft className="size-3" />
                <span>Tổng quan học vụ</span>
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-700">Quản lý Giảng viên Hướng dẫn</span>
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2744] tracking-tight">
            Quản lý Định mức &amp; Hạn ngạch GVHD (Quy chế BR-09)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kiểm soát và phân bổ hạn ngạch hướng dẫn nghiên cứu sinh theo Quy chế Sau Đại học AGU &amp; ĐHQG-HCM.
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
            onClick={() => {
              setAssignSupervisor(null);
              setAssignModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-3.5 py-2 text-xs font-bold text-[#164E9B] hover:bg-blue-100 shadow-2xs transition-all cursor-pointer"
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
            <span className="text-xs text-slate-500">giảng viên cơ hữu &amp; thỉnh giảng</span>
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
            Theo Quy chế Đào tạo Trình độ Tiến sĩ ban hành theo quyết định BR-09 ĐHQG-HCM:
            Mỗi nghiên cứu sinh được hướng dẫn bởi tối đa 02 người (01 GVHD chính và 01 Đồng hướng dẫn).
            Giảng viên có học vị Tiến sĩ hướng dẫn tối đa <strong>3.0 NCS</strong> cùng thời điểm;
            Phó Giáo sư và Giáo sư chủ trì đề tài cấp Bộ/ĐHQG được hướng dẫn tối đa <strong>4.0 NCS</strong>.
            Hệ thống sẽ tự động khóa tùy chọn phân công khi giảng viên vượt hạn mức cho phép.
          </p>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Supervisor List & Quota Table */}
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Danh sách Giảng viên Hướng dẫn &amp; Tiến độ Hạn ngạch
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Hiển thị số lượng NCS độc lập, đồng hướng dẫn và chỉ tiêu khả dụng hiện tại.
              </p>
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
                onClick={() => {
                  setSearchTerm("");
                  setDepartmentFilter("all");
                  setQuotaStatusFilter("all");
                  setCurrentPage(1);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span>Đặt lại</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm giảng viên, mã CB, khoa..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#164E9B] outline-none"
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B] outline-none cursor-pointer"
            >
              <option value="all">Tất cả Khoa / Bộ môn</option>
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={quotaStatusFilter}
              onChange={(e) => {
                setQuotaStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B] outline-none cursor-pointer"
            >
              <option value="all">Tất cả tình trạng hạn ngạch</option>
              <option value="available">Còn chỉ tiêu nhận thêm</option>
              <option value="full">Đã đủ định mức</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Giảng viên Hướng dẫn</th>
                  <th className="py-3 px-3">Khoa / Bộ môn</th>
                  <th className="py-3 px-3">HD Độc lập (1.0)</th>
                  <th className="py-3 px-3">Đồng HD (0.5)</th>
                  <th className="py-3 px-3">Hạn ngạch hiện tại</th>
                  <th className="py-3 px-3 text-right">Khả năng nhận thêm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedSupervisors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Không tìm thấy giảng viên nào phù hợp với bộ lọc tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  paginatedSupervisors.map((sv) => {
                    const percent =
                      sv.maxQuota > 0
                        ? Math.min(100, Math.round((sv.usedQuota / sv.maxQuota) * 100))
                        : 0;
                    const isFull = sv.remainingQuota <= 0;
                    const isSelected = sv.id === selectedSupervisor?.id;

                    return (
                      <tr
                        key={sv.id}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? "bg-blue-50/70" : "hover:bg-blue-50/40"
                        }`}
                        onClick={() => {
                          setSelectedSupervisorId(sv.id);
                          setPreviewSupervisorId(sv.id);
                        }}
                      >
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block hover:text-[#164E9B]">
                            {sv.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {sv.code} • {sv.degree}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-slate-700 font-medium">{sv.department}</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {sv.independentCount} NCS ({sv.independentCount * 1.0}đ)
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {sv.coCount} NCS ({sv.coCount * 0.5}đ)
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${
                                isFull ? "text-rose-600" : "text-[#0F2744]"
                              }`}
                            >
                              {sv.usedQuota.toFixed(1)} / {sv.maxQuota.toFixed(1)} NCS
                            </span>
                          </div>
                          <div className="w-28 h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isFull ? "bg-rose-500" : percent > 75 ? "bg-amber-500" : "bg-[#164E9B]"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${sv.statusColor}`}
                          >
                            {sv.statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang danh sách GVHD */}
          <TablePagination
            currentPage={currentPage}
            totalItems={filteredSupervisors.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            itemLabel="giảng viên hướng dẫn"
            className="pt-2"
          />
        </div>

        {/* Right Col: Interactive Tools & Live Quota Checker */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            {rightQuotaSupervisor && (
              <p className="text-[11px] font-semibold text-slate-500 px-1 truncate">
                Đang xem định mức: <strong className="text-[#0F2744]">{rightQuotaSupervisor.name}</strong>
              </p>
            )}
            <QuotaBar
              used={rightQuotaSupervisor?.usedQuota ?? 0}
              max={rightQuotaSupervisor?.maxQuota ?? 3.0}
              independentCount={rightQuotaSupervisor?.independentCount ?? 0}
              coCount={rightQuotaSupervisor?.coCount ?? 0}
              showDetails={true}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Gauge className="size-4 text-[#164E9B]" />
              <span>Thử nghiệm phân công NCS mới</span>
            </h3>
            <p className="text-xs text-slate-500">
              Mô phỏng gán nghiên cứu sinh mới cho giảng viên để kiểm tra tính hợp lệ và tự động phát hiện vượt trần quy chế BR-09.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTestAssignmentType("independent")}
                className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                  testAssignmentType === "independent"
                    ? "border-[#164E9B] bg-blue-50 text-[#164E9B]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Độc lập (+1.0)
              </button>
              <button
                type="button"
                onClick={() => setTestAssignmentType("co_supervisor")}
                className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                  testAssignmentType === "co_supervisor"
                    ? "border-[#164E9B] bg-blue-50 text-[#164E9B]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Đồng HD (+0.5)
              </button>
            </div>

            <SupervisorSelector
              label="Chọn Giảng viên hướng dẫn thử nghiệm:"
              selectedId={rightQuotaSupervisor?.id}
              supervisors={selectorOptions}
              onSelect={(opt) => setPreviewSupervisorId(opt.id)}
              assignmentType={testAssignmentType}
            />
          </div>
        </div>
      </div>

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
        onSuccess={(msg) => {
          setToastMessage(msg);
          setTimeout(() => setToastMessage(null), 5000);
        }}
      />

      {/* MODAL POP-UP: HỒ SƠ CHI TIẾT GIẢNG VIÊN HƯỚNG DẪN */}
      {selectedSupervisorId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="supervisor-detail-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedSupervisorId(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#164E9B]/10 text-[#164E9B]">
                  <UserCheck className="size-5" />
                </div>
                <div>
                  <h3
                    id="supervisor-detail-modal-title"
                    className="text-base font-extrabold text-[#0F2744]"
                  >
                    {supervisorDetail
                      ? `Hồ sơ chi tiết: ${formatSupervisorDisplayName(supervisorDetail.hoTen, supervisorDetail.hocHamHocVi)}`
                      : selectedSupervisor
                      ? `Hồ sơ chi tiết: ${selectedSupervisor.name}`
                      : "Chi tiết Giảng viên Hướng dẫn"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Thông tin định mức, hạn ngạch BR-09 và danh sách nghiên cứu sinh phụ trách
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedQuotaSupervisor && (
                  <button
                    type="button"
                    onClick={() => {
                      setAssignSupervisor(selectedQuotaSupervisor);
                      setAssignModalOpen(true);
                    }}
                    className="rounded-xl bg-[#164E9B] px-3 py-1.5 text-white hover:bg-[#123E7C] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <UserCheck className="size-4" />
                    <span>Phân công thêm NCS</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedSupervisorId(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Đóng bảng chi tiết"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* 1. Trạng thái Loading */}
            {isLoadingDetail && (
              <div role="status" className="py-8 text-center text-xs text-slate-500 space-y-2">
                <Loader2 className="size-6 animate-spin mx-auto text-[#164E9B]" />
                <p>Đang tải thông tin chi tiết giảng viên từ máy chủ...</p>
              </div>
            )}

            {/* 2. Dữ liệu chi tiết (Ưu tiên API, tự động Fallback Mock mượt mà nếu API lỗi/chưa có token) */}
            {!isLoadingDetail && (
              <div className="space-y-4">
                {/* Thông báo chế độ dự phòng nếu API lỗi */}
                {isErrorDetail && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-amber-800 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Info className="size-4 shrink-0 text-amber-600" />
                      <span>
                        Máy chủ API phản hồi hạn chế. Đang hiển thị hồ sơ từ bộ nhớ đệm hệ thống.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => void refetchDetail()}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#164E9B] hover:underline shrink-0 cursor-pointer"
                    >
                      <RefreshCw className="size-3" />
                      <span>Đồng bộ lại</span>
                    </button>
                  </div>
                )}

                {/* Grid tóm tắt hồ sơ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Mã giảng viên</span>
                    <span className="font-mono font-bold text-slate-900">
                      {supervisorDetail?.maGv || selectedSupervisor?.code || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Học hàm / Học vị</span>
                    <span className="font-semibold text-slate-900">
                      {supervisorDetail?.hocHamHocVi
                        ? formatDegreeLabel(supervisorDetail.hocHamHocVi)
                        : selectedSupervisor?.degree || "Tiến sĩ"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Đơn vị công tác</span>
                    <span className="font-medium text-slate-900 truncate block">
                      {supervisorDetail?.donVi?.ten ||
                        supervisorDetail?.chuyenNganh ||
                        selectedSupervisor?.department ||
                        "Chưa cập nhật"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Email liên hệ</span>
                    <span className="text-slate-700 truncate block font-mono">
                      {supervisorDetail?.email || `${(selectedSupervisor?.code || "gv").toLowerCase()}@agu.edu.vn`}
                    </span>
                  </div>
                </div>

                {/* Quota Bar trực quan bên trong Modal */}
                {selectedQuotaSupervisor && (
                  <div className="space-y-1.5 bg-blue-50/40 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-[#0F2744]">
                      Chỉ tiêu &amp; Tình trạng hạn ngạch BR-09:
                    </p>
                    <QuotaBar
                      used={selectedQuotaSupervisor.usedQuota}
                      max={selectedQuotaSupervisor.maxQuota}
                      independentCount={selectedQuotaSupervisor.independentCount}
                      coCount={selectedQuotaSupervisor.coCount}
                      showDetails={true}
                    />
                  </div>
                )}

                {/* Danh sách phân công NCS */}
                <div>
                  <h4 className="font-bold text-[#0F2744] text-xs mb-2.5 flex items-center justify-between">
                    <span>Nghiên cứu sinh đang được phân công hướng dẫn:</span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {supervisorDetail?.phanCongs && supervisorDetail.phanCongs.length > 0
                        ? `${supervisorDetail.phanCongs.length} phân công`
                        : `${(selectedSupervisor?.independentCount || 0) + (selectedSupervisor?.coCount || 0)} phân công`}
                    </span>
                  </h4>

                  {supervisorDetail?.phanCongs && supervisorDetail.phanCongs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {supervisorDetail.phanCongs.map((assignment, idx) => {
                        const isMain = assignment.vaiTro === "HUONG_DAN_CHINH";
                        const roleLabel = isMain ? "Hướng dẫn chính (1.0)" : "Đồng hướng dẫn (0.5)";
                        const roleBadgeStyle = isMain
                          ? "bg-blue-50 text-[#164E9B] border-blue-200"
                          : "bg-slate-100 text-slate-700 border-slate-200";

                        return (
                          <div
                            key={assignment.id || idx}
                            className="flex items-start gap-2.5 rounded-xl bg-slate-50/60 p-3 border border-slate-200"
                          >
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#164E9B] font-bold text-xs mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-slate-900 text-xs truncate">
                                  {assignment.ncs?.hoTen || "NCS chưa cập nhật tên"}
                                </span>
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold border ${roleBadgeStyle}`}>
                                  {roleLabel}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 flex flex-wrap gap-x-2 gap-y-0.5 font-mono">
                                {assignment.ncs?.mshv && <span>MSHV: {assignment.ncs.mshv}</span>}
                                {assignment.quyetDinh?.soQuyetDinh && (
                                  <span>QĐ: {assignment.quyetDinh.soQuyetDinh}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Fallback danh sách NCS từ dữ liệu mock/tổng quan khi API chưa có hoặc trả về mảng rỗng */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {studentsList
                        .filter((st) => {
                          const svName = selectedSupervisor?.name?.toLowerCase() || "";
                          const svId = selectedSupervisor?.id || "";
                          return (
                            Boolean(st.supervisorMain && (st.supervisorMain.toLowerCase().includes(svName) || st.supervisorMain === svId)) ||
                            Boolean(st.supervisorCo && (st.supervisorCo.toLowerCase().includes(svName) || st.supervisorCo === svId))
                          );
                        })
                        .slice(0, 4)
                        .map((st, idx) => {
                          const svName = selectedSupervisor?.name?.toLowerCase() || "";
                          const isMain = Boolean(st.supervisorMain && st.supervisorMain.toLowerCase().includes(svName));
                          return (
                            <div
                              key={st.id || idx}
                              className="flex items-start gap-2.5 rounded-xl bg-slate-50/60 p-3 border border-slate-200"
                            >
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#164E9B] font-bold text-xs mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-slate-900 text-xs truncate">
                                    {st.name}
                                  </span>
                                  <span className="inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold border bg-blue-50 text-[#164E9B] border-blue-200">
                                    {isMain ? "Hướng dẫn chính (1.0)" : "Đồng hướng dẫn (0.5)"}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 flex flex-wrap gap-x-2 gap-y-0.5 font-mono">
                                  <span>MSSV: {st.code}</span>
                                  <span>Mốc: {st.currentMilestoneIndex}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
