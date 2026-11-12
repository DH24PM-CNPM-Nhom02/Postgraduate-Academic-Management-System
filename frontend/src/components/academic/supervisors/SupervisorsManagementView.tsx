"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import {
  QuotaBar,
  SupervisorSelector,
  ExcelImportModal,
  SupervisorAssignmentModal,
  MOCK_SUPERVISORS,
  MOCK_STUDENTS,
} from "@/src/components/academic";
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

  const selectedSupervisor = useMemo(
    () => supervisorsList.find((sv) => sv.id === selectedSupervisorId) ?? null,
    [supervisorsList, selectedSupervisorId]
  );

  // Hook gọi API GET /gvhd/:id khi người dùng chọn giảng viên trong bảng
  const {
    data: supervisorDetail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    error: detailError,
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm giảng viên, mã CB, khoa..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#164E9B] outline-none"
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
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
              onChange={(e) => setQuotaStatusFilter(e.target.value)}
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
                {filteredSupervisors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Không tìm thấy giảng viên nào phù hợp với bộ lọc tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  filteredSupervisors.map((sv) => {
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

          {/* Sub-panel chi tiết GVHD & danh sách NCS phân công kết nối API GET /gvhd/:id */}
          {selectedSupervisorId && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-3 text-xs animate-in fade-in duration-200">
              {/* Header chung của Sub-panel */}
              <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="size-4 text-[#164E9B]" />
                  <h4 className="font-bold text-[#0F2744]">
                    {supervisorDetail
                      ? `Hồ sơ chi tiết: ${formatSupervisorDisplayName(supervisorDetail.hoTen, supervisorDetail.hocHamHocVi)}`
                      : selectedSupervisor
                      ? `Hồ sơ chi tiết: ${selectedSupervisor.name}`
                      : "Chi tiết Giảng viên Hướng dẫn"}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  {selectedQuotaSupervisor && (
                    <button
                      type="button"
                      onClick={() => {
                        setAssignSupervisor(selectedQuotaSupervisor);
                        setAssignModalOpen(true);
                      }}
                      className="rounded-lg bg-[#164E9B] px-2.5 py-1 text-white hover:bg-[#123E7C] text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <UserCheck className="size-3.5" />
                      <span>Phân công thêm NCS</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedSupervisorId(null)}
                    className="rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-white text-xs font-bold cursor-pointer"
                    aria-label="Đóng bảng chi tiết"
                  >
                    ✕ Đóng
                  </button>
                </div>
              </div>

              {/* 1. Trạng thái Loading */}
              {isLoadingDetail && (
                <div role="status" className="py-6 text-center text-xs text-slate-500 space-y-2">
                  <Loader2 className="size-5 animate-spin mx-auto text-[#164E9B]" />
                  <p>Đang tải thông tin chi tiết giảng viên từ máy chủ (GET /gvhd/{selectedSupervisorId})...</p>
                </div>
              )}

              {/* 2. Trạng thái Error (kèm nút Thử lại) */}
              {!isLoadingDetail && isErrorDetail && (
                <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
                    <div className="space-y-0.5 flex-1">
                      <p className="font-bold text-xs text-rose-900">
                        Không thể tải thông tin chi tiết giảng viên từ API
                      </p>
                      <p className="text-[11px] text-rose-700 leading-relaxed">
                        {detailError instanceof Error ? detailError.message : "Đã xảy ra lỗi khi kết nối máy chủ API."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void refetchDetail()}
                      className="inline-flex items-center gap-1 rounded bg-[#164E9B] px-2.5 py-1 text-white hover:bg-[#123E7C] text-[11px] font-semibold cursor-pointer shrink-0"
                    >
                      <RefreshCw className="size-3" />
                      <span>Thử lại</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Trạng thái Empty (Không tìm thấy bản ghi GVHD) */}
              {!isLoadingDetail && !isErrorDetail && !supervisorDetail && (
                <div className="py-4 text-center text-slate-500 space-y-1">
                  <Info className="size-5 mx-auto text-slate-400" />
                  <p className="text-[11px]">Không tìm thấy thông tin giảng viên hướng dẫn yêu cầu.</p>
                </div>
              )}

              {/* 4. Trạng thái Success */}
              {!isLoadingDetail && !isErrorDetail && supervisorDetail && (
                <div className="space-y-3 pt-1">
                  {/* Thẻ tóm tắt thông tin hồ sơ GVHD từ API */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-white p-3 rounded-lg border border-blue-100 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">Mã giảng viên</span>
                      <span className="font-mono font-bold text-slate-800">{supervisorDetail.maGv || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">Học hàm / Học vị</span>
                      <span className="font-semibold text-slate-800">{formatDegreeLabel(supervisorDetail.hocHamHocVi)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">Đơn vị công tác</span>
                      <span className="font-medium text-slate-800 truncate block" title={supervisorDetail.donVi?.ten || ""}>
                        {supervisorDetail.donVi?.ten || supervisorDetail.donVi?.parent?.ten || supervisorDetail.chuyenNganh || "Chưa cập nhật"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">Email liên hệ</span>
                      <span className="text-slate-700 truncate block font-mono" title={supervisorDetail.email || ""}>
                        {supervisorDetail.email || "Chưa cập nhật"}
                      </span>
                    </div>
                  </div>

                  {/* Danh sách phân công NCS từ phanCongs */}
                  <div>
                    <h5 className="font-bold text-[#0F2744] text-[11px] mb-1.5 flex items-center justify-between">
                      <span>Nghiên cứu sinh đang được phân công:</span>
                      <span className="text-[10px] font-normal text-slate-500">
                        {supervisorDetail.phanCongs?.length ?? 0} phân công
                      </span>
                    </h5>

                    {(!supervisorDetail.phanCongs || supervisorDetail.phanCongs.length === 0) ? (
                      <div className="rounded-lg bg-white/70 p-3 text-center border border-dashed border-blue-200">
                        <p className="text-[11px] italic text-slate-500">
                          Giảng viên hiện chưa được phân công hướng dẫn nghiên cứu sinh nào.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {supervisorDetail.phanCongs.map((assignment, idx) => {
                          const isMain = assignment.vaiTro === "HUONG_DAN_CHINH";
                          const roleLabel = isMain ? "Hướng dẫn chính (1.0)" : "Đồng hướng dẫn (0.5)";
                          const roleBadgeStyle = isMain
                            ? "bg-blue-50 text-[#164E9B] border-blue-200"
                            : "bg-slate-100 text-slate-700 border-slate-200";

                          return (
                            <div
                              key={assignment.id || idx}
                              className="flex items-start gap-2.5 rounded-lg bg-white p-2.5 border border-blue-100 shadow-2xs"
                            >
                              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#164E9B] font-bold text-[10px] mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-slate-900 text-[11px] truncate">
                                    {assignment.ncs?.hoTen || "NCS chưa cập nhật tên"}
                                  </span>
                                  <span className={`inline-flex rounded-full px-1.5 py-0.2 text-[9px] font-bold border ${roleBadgeStyle}`}>
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
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
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
    </div>
  );
}
