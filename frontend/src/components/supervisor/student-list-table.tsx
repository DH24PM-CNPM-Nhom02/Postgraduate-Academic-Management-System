"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  BookOpen,
  Layers,
} from "lucide-react";
import { SupervisorStudentItem } from "@/src/lib/mockData";

interface StudentListTableProps {
  students: SupervisorStudentItem[];
  selectedStudentId?: string | null;
  onSelectStudent: (student: SupervisorStudentItem) => void;
}

export function StudentListTable({
  students,
  selectedStudentId,
  onSelectStudent,
}: StudentListTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Lọc dữ liệu theo search và filter status
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.hoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.mshv.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tenDeTai.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.chuyenNganh.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (statusFilter === "ERROR") return s.hasRejectedMilestone;
      if (statusFilter === "WARNING") return s.trangThaiChung === "WARNING";
      if (statusFilter === "GOOD") return s.trangThaiChung === "GOOD";
      if (statusFilter === "CHINH") return s.vaiTroHuongDan === "CHINH";
      if (statusFilter === "DONG_HUONG_DAN")
        return s.vaiTroHuongDan === "DONG_HUONG_DAN";

      return true;
    });
  }, [students, searchQuery, statusFilter]);

  // Render badge trạng thái
  const renderStatusBadge = (student: SupervisorStudentItem) => {
    if (student.hasRejectedMilestone) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
          <AlertCircle className="size-3.5 text-rose-600 shrink-0" />
          <span>Mốc {student.mocHienTai}: Cần nộp lại</span>
        </span>
      );
    }
    if (student.trangThaiChung === "WARNING") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
          <Clock className="size-3.5 text-amber-600 shrink-0" />
          <span>Mốc {student.mocHienTai}: Chờ duyệt</span>
        </span>
      );
    }
    if (student.trangThaiChung === "GOOD") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
          <span>Mốc {student.mocHienTai}: Tiến độ tốt</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
        <Layers className="size-3.5 text-blue-600 shrink-0" />
        <span>Mốc {student.mocHienTai}: Đang thực hiện</span>
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
      {/* Header thanh công cụ (Tìm kiếm & Bộ lọc) */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Danh sách Nghiên cứu sinh</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#164E9B]">
              {filteredStudents.length} / {students.length} NCS
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click vào dòng hoặc nút chi tiết để xem chi tiết luồng 9 mốc đào tạo của NCS.
          </p>
        </div>

        {/* Toolbar: Search + Filter */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Ô tìm kiếm */}
          <div className="relative min-w-[220px] sm:min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, MSHV, đề tài..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#164E9B] focus:ring-2 focus:ring-[#164E9B]/15 transition-all shadow-2xs"
            />
          </div>

          {/* Bộ lọc dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs text-xs text-slate-700">
            <Filter className="size-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ERROR">Mốc cần hoàn thiện (Lỗi)</option>
              <option value="WARNING">Đang chờ duyệt</option>
              <option value="GOOD">Tiến độ xuất sắc</option>
              <option value="CHINH">Hướng dẫn chính</option>
              <option value="DONG_HUONG_DAN">Đồng hướng dẫn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu NCS (Table) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4 sm:px-5">
                Nghiên cứu sinh
              </th>
              <th scope="col" className="py-3.5 px-4 hidden md:table-cell">
                Đề tài Luận án & Chuyên ngành
              </th>
              <th scope="col" className="py-3.5 px-4 text-center">
                Mốc hiện tại
              </th>
              <th scope="col" className="py-3.5 px-4">
                Tiến độ đào tạo
              </th>
              <th scope="col" className="py-3.5 px-4">
                Tình trạng mốc
              </th>
              <th scope="col" className="py-3.5 px-4 sm:px-5 text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <BookOpen className="size-8 text-slate-300" />
                    <p className="text-sm font-medium">Không tìm thấy Nghiên cứu sinh phù hợp</p>
                    <p className="text-xs text-slate-400">
                      Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt bộ lọc.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const isSelected = selectedStudentId === student.id;

                return (
                  <tr
                    key={student.id}
                    onClick={() => onSelectStudent(student)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected
                        ? "bg-blue-50/70 hover:bg-blue-50"
                        : student.hasRejectedMilestone
                        ? "bg-rose-50/25 hover:bg-rose-50/50"
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Cột 1: Thông tin NCS */}
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                            student.hasRejectedMilestone
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : isSelected
                              ? "bg-[#164E9B] text-white"
                              : "bg-blue-100 text-[#164E9B]"
                          }`}
                        >
                          {student.hoTen.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm group-hover:text-[#164E9B] transition-colors">
                            {student.hoTen}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                              {student.mshv}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {student.lop}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                student.vaiTroHuongDan === "CHINH"
                                  ? "bg-blue-50 text-[#164E9B]"
                                  : "bg-indigo-50 text-indigo-700"
                              }`}
                            >
                              {student.vaiTroHuongDan === "CHINH"
                                ? "HD Chính"
                                : "Đồng HD"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Đề tài Luận án */}
                    <td className="py-3.5 px-4 hidden md:table-cell max-w-[280px]">
                      <p
                        className="font-medium text-slate-800 line-clamp-2 leading-relaxed"
                        title={student.tenDeTai}
                      >
                        {student.tenDeTai}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        Chuyên ngành: <strong>{student.chuyenNganh}</strong>
                      </p>
                    </td>

                    {/* Cột 3: Mốc hiện tại */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="inline-flex items-center justify-center font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                          Mốc {student.mocHienTai} / {student.tongSoMoc}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {student.tenMocHienTai.replace(/^Báo cáo\s*/, "")}
                        </span>
                      </div>
                    </td>

                    {/* Cột 4: Tiến độ đào tạo */}
                    <td className="py-3.5 px-4 min-w-[130px]">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold text-slate-700">
                            {student.tienDoPhanTram}%
                          </span>
                          <span className="text-slate-500">
                            {student.soMocHoanThanh}/{student.tongSoMoc} mốc
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/60">
                          <div
                            className={`rounded-full transition-all duration-300 ${
                              student.hasRejectedMilestone
                                ? "bg-rose-500"
                                : student.tienDoPhanTram >= 70
                                ? "bg-emerald-600"
                                : "bg-[#164E9B]"
                            }`}
                            style={{ width: `${student.tienDoPhanTram}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Cột 5: Tình trạng mốc */}
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(student)}
                    </td>

                    {/* Cột 6: Nút xem chi tiết */}
                    <td className="py-3.5 px-4 sm:px-5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          isSelected
                            ? "bg-[#164E9B] text-white shadow-xs"
                            : "bg-slate-100 text-[#164E9B] hover:bg-[#164E9B] hover:text-white"
                        }`}
                      >
                        <span>Chi tiết 9 mốc</span>
                        <ChevronRight className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentListTable;
