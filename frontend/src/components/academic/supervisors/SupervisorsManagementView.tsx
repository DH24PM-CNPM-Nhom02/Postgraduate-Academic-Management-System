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
  MOCK_SUPERVISORS,
} from "@/src/components/academic";
import { useAcademicSupervisors } from "@/src/hooks/use-academic";
import type { SupervisorQuotaRecord } from "@/src/types/academic";

interface SupervisorsManagementViewProps {
  embedded?: boolean;
}

export function SupervisorsManagementView({ embedded = false }: SupervisorsManagementViewProps) {
  // Chỉ gọi hook khi component này được mount!
  const { data: initialData, isLoading } = useAcademicSupervisors();

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [quotaStatusFilter, setQuotaStatusFilter] = useState("all");

  const [importedSupervisors, setImportedSupervisors] = useState<SupervisorQuotaRecord[]>([]);

  const supervisorsList = useMemo(() => {
    const base = initialData && Array.isArray(initialData) && initialData.length > 0 ? initialData : MOCK_SUPERVISORS;
    return [...importedSupervisors, ...base];
  }, [initialData, importedSupervisors]);

  const [selectedSupervisor, setSelectedSupervisor] = useState<SupervisorQuotaRecord | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

            <button
              onClick={() => {
                setSearchTerm("");
                setDepartmentFilter("all");
                setQuotaStatusFilter("all");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 self-start sm:self-auto transition-colors cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>Đặt lại</span>
            </button>
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
              <option value="Khoa Công nghệ Thông tin">Khoa CNTT</option>
              <option value="Khoa Nông nghiệp - TNTN">Khoa Nông nghiệp - TNTN</option>
              <option value="Khoa Kinh tế - QTKD">Khoa Kinh tế - QTKD</option>
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
                    const percent = Math.min(100, Math.round((sv.usedQuota / sv.maxQuota) * 100));
                    const isFull = sv.remainingQuota <= 0;

                    return (
                      <tr
                        key={sv.id}
                        className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                        onClick={() => setSelectedSupervisor(sv)}
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

          {/* Modal / Dialog showing detailed assigned students */}
          {selectedSupervisor && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-2.5 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                <div>
                  <h4 className="font-bold text-[#0F2744]">
                    NCS đang được hướng dẫn bởi {selectedSupervisor.name}:
                  </h4>
                  <span className="text-[11px] text-slate-500">{selectedSupervisor.department}</span>
                </div>
                <button
                  onClick={() => setSelectedSupervisor(null)}
                  className="rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-white text-xs font-bold cursor-pointer"
                >
                  ✕ Đóng
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {selectedSupervisor.assignedStudents.map((std, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg bg-white p-2 border border-blue-100 shadow-2xs"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#164E9B] font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800 text-[11px] truncate">{std}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Interactive Tools & Live Quota Checker */}
        <div className="space-y-6">
          <QuotaBar
            used={2.5}
            max={3.0}
            independentCount={1}
            coCount={3}
            showDetails={true}
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Gauge className="size-4 text-[#164E9B]" />
              <span>Thử nghiệm phân công NCS mới</span>
            </h3>
            <p className="text-xs text-slate-500">
              Mô phỏng gán nghiên cứu sinh mới cho giảng viên để kiểm tra tính hợp lệ và tự động phát hiện vượt trần quy chế BR-09.
            </p>

            <SupervisorSelector
              label="Chọn Giảng viên hướng dẫn thử nghiệm:"
              selectedId="gv-01"
              assignmentType="co_supervisor"
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
    </div>
  );
}
