"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  Filter,
  AlertTriangle,
  Clock,
  Award,
  ArrowLeft,
  Download,
  Plus,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  StudentDetailModal,
  ExcelImportModal,
  MOCK_STUDENTS,
} from "@/src/components/academic";
import { useAcademicStudents } from "@/src/hooks/use-academic";
import type { StudentDossier } from "@/src/types/academic";

interface StudentsManagementViewProps {
  /** Khi được nhúng trong dashboard tab, có thể ẩn breadcrumb quay lại */
  embedded?: boolean;
}

export function StudentsManagementView({ embedded = false }: StudentsManagementViewProps) {
  // Chỉ gọi API NCS khi component này được mount!
  const { data: initialData, isLoading } = useAcademicStudents();

  // Search & Filter States
  const [studentSearchText, setStudentSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [milestoneFilter, setMilestoneFilter] = useState("all");

  // Danh sách NCS mới được import qua Excel
  const [importedStudents, setImportedStudents] = useState<StudentDossier[]>([]);

  // Dữ liệu hợp nhất từ API (hoặc MOCK_STUDENTS) kết hợp các bản ghi import thêm
  const studentsList = useMemo(() => {
    const base = initialData && Array.isArray(initialData) && initialData.length > 0 ? initialData : MOCK_STUDENTS;
    return [...importedStudents, ...base];
  }, [initialData, importedStudents]);

  // Modal State
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDossier | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Handle Excel Import Success
  const handleImportSuccess = (newStudents: StudentDossier[]) => {
    setImportedStudents((prev) => [...newStudents, ...prev]);
    setToastMessage(
      `Đã thêm thành công ${newStudents.length} nghiên cứu sinh từ file Excel vào hệ thống.`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    return studentsList.filter((s) => {
      const query = studentSearchText.toLowerCase();
      const matchSearch =
        s.name.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query) ||
        s.thesisTopic.toLowerCase().includes(query) ||
        s.supervisorMain.toLowerCase().includes(query) ||
        (s.supervisorCo && s.supervisorCo.toLowerCase().includes(query));

      const matchDept =
        departmentFilter === "all" || s.department === departmentFilter;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchMilestone =
        milestoneFilter === "all" ||
        s.currentMilestoneIndex.toString() === milestoneFilter;

      return matchSearch && matchDept && matchStatus && matchMilestone;
    });
  }, [
    studentsList,
    studentSearchText,
    departmentFilter,
    statusFilter,
    milestoneFilter,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const activeCount = studentsList.filter((s) => s.status === "active").length;
  const warningCount = studentsList.filter(
    (s) => s.status === "warning" || s.status === "overdue"
  ).length;
  const paperPassCount = studentsList.filter(
    (s) => s.publicationPoints >= 2.0
  ).length;

  const handleResetFilters = () => {
    setStudentSearchText("");
    setDepartmentFilter("all");
    setStatusFilter("all");
    setMilestoneFilter("all");
    setCurrentPage(1);
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
            ×
          </button>
        </div>
      )}

      {/* PAGE HEADER & BREADCRUMBS (Ẩn link quay lại nếu ở chế độ embedded tab) */}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            Thuộc 4 Khoa chuyên ngành trọng điểm
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

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">
              Đạt chuẩn bài báo (≥2.0đ)
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-800">
              <Award className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-950">
              {paperPassCount}
            </span>
            <span className="text-xs font-semibold text-indigo-700">
              / {studentsList.length} NCS
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            Đủ điều kiện xuất bản WoS/Scopus Q1-Q3
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

          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 self-start sm:self-auto transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            <span>Đặt lại bộ lọc</span>
          </button>
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
                setCurrentPage(1);
              }}
              placeholder="Tìm theo họ tên, MSSV, đề tài, GVHD..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#164E9B] focus:ring-1 focus:ring-[#164E9B] outline-none"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B] outline-none cursor-pointer"
          >
            <option value="all">Tất cả chuyên ngành</option>
            <option value="Khoa học Máy tính">Khoa học Máy tính</option>
            <option value="Công nghệ Sinh học">Công nghệ Sinh học</option>
            <option value="Khoa học Cây trồng">Khoa học Cây trồng</option>
            <option value="Quản trị Kinh doanh">Quản trị Kinh doanh</option>
          </select>

          {/* Milestone Filter */}
          <select
            value={milestoneFilter}
            onChange={(e) => {
              setMilestoneFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B] outline-none cursor-pointer"
          >
            <option value="all">Tất cả các mốc đào tạo</option>
            <option value="1">Mốc 1: Quyết định công nhận NCS</option>
            <option value="2">Mốc 2: Học phần tiến sĩ bổ sung</option>
            <option value="3">Mốc 3: Báo cáo chuyên đề 01</option>
            <option value="4">Mốc 4: Báo cáo chuyên đề 02</option>
            <option value="5">Mốc 5: Bảo vệ đề cương chi tiết</option>
            <option value="6">Mốc 6: Báo cáo chuyên đề 03</option>
            <option value="7">Mốc 7: Báo cáo tiến độ 6 tháng</option>
            <option value="8">Mốc 8: Thẩm định bài báo WoS/Scopus</option>
            <option value="9">Mốc 9: Bảo vệ luận án cấp Trường</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-[#164E9B] outline-none cursor-pointer"
          >
            <option value="all">Tất cả trạng thái tiến độ</option>
            <option value="active">Đúng tiến độ (&gt;12 tháng)</option>
            <option value="warning">Cảnh báo (&lt;12 tháng)</option>
            <option value="overdue">Cảnh báo khẩn (&lt;3 tháng)</option>
          </select>
        </div>

        {/* RESULTS TABLE */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Họ tên &amp; MSSV</th>
                <th className="py-3 px-3">Chuyên ngành &amp; Khóa</th>
                <th className="py-3 px-3 max-w-sm">Đề tài luận án &amp; GVHD</th>
                <th className="py-3 px-3">Mốc hiện tại</th>
                <th className="py-3 px-3">Thời gian còn lại</th>
                <th className="py-3 px-3">Bài báo WoS/Scopus</th>
                <th className="py-3 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="size-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">
                      Không tìm thấy nghiên cứu sinh nào phù hợp với điều kiện tìm kiếm.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Thử điều chỉnh từ khóa tìm kiếm hoặc bấm &ldquo;Đặt lại bộ lọc&rdquo;.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((std) => (
                  <tr
                    key={std.id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="py-3.5 px-3.5">
                      <span className="font-bold text-slate-900 block text-xs">
                        {std.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 font-medium">
                        {std.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-800 block">
                        {std.department}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {std.cohort}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 max-w-sm">
                      <p className="line-clamp-2 text-slate-700 italic">
                        “{std.thesisTopic}”
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                        <span>
                          GVHD chính: <strong>{std.supervisorMain}</strong>
                        </span>
                        {std.supervisorCo && (
                          <span>
                            • Đồng HD: <strong>{std.supervisorCo}</strong>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-[#164E9B] px-2.5 py-0.5 text-[11px] font-bold">
                        Mốc {std.currentMilestoneIndex} / 9
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      {std.remainingMonths > 12 ? (
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                          {std.remainingMonths} tháng
                        </span>
                      ) : std.remainingMonths > 3 ? (
                        <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                          {std.remainingMonths} tháng (Cảnh báo)
                        </span>
                      ) : (
                        <span className="rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold animate-pulse">
                          {std.remainingMonths} tháng (Khẩn)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#0F2744]">
                          {std.publicationPoints?.toFixed(1)} / 2.0đ
                        </span>
                        {std.publicationPoints >= 2.0 ? (
                          <span className="text-emerald-600 font-bold text-[10px]">
                            ✓ Đạt
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Thiếu</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedStudent(std);
                          setStudentModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#164E9B] hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Eye className="size-3.5" />
                        <span>Hồ sơ chi tiết</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE PAGINATION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-2 gap-2">
          <span>
            Hiển thị {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredStudents.length)} của{" "}
            {filteredStudents.length} nghiên cứu sinh
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
              className="rounded-lg border px-3 py-1 text-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
            >
              Trang trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`rounded-lg border px-3 py-1 font-bold cursor-pointer ${
                  p === currentPage
                    ? "bg-[#164E9B] text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="rounded-lg border px-3 py-1 text-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
            >
              Trang sau
            </button>
          </div>
        </div>
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

      {/* EXCEL IMPORT MODAL */}
      <ExcelImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        entityType="student"
        onSuccess={handleImportSuccess}
      />
    </div>
  );
}
