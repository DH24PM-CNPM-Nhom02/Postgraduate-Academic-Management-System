"use client";

import React, { useMemo } from "react";
import {
  X,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Globe,
  GraduationCap,
  Building2,
  BookOpen,
  RefreshCw,
  Info,
  Loader2,
  Award,
  User,
  ShieldCheck,
  ShieldAlert,
  FileText,
} from "lucide-react";
import {
  formatSupervisorDisplayName,
  formatDegreeLabel,
  mapBackendGvhdToSupervisorQuota,
} from "@/src/services/gvhd";
import { useAcademicSupervisorDetail } from "@/src/hooks/use-academic";
import type { SupervisorQuotaRecord, StudentDossier } from "@/src/types/academic";
import { QuotaBar } from "../QuotaBar";

export interface SupervisorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  supervisorId: string | null;
  fallbackSupervisor?: SupervisorQuotaRecord | null;
  studentsList?: StudentDossier[];
}

function formatDate(value?: string | Date | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatGender(gender?: string | null): string {
  if (!gender) return "—";
  const g = gender.toUpperCase();
  if (g === "NAM") return "Nam";
  if (g === "NU" || g === "NỮ") return "Nữ";
  return gender;
}

export function SupervisorDetailModal({
  isOpen,
  onClose,
  supervisorId,
  fallbackSupervisor,
  studentsList = [],
}: SupervisorDetailModalProps) {
  // Chỉ gọi API khi modal đang mở và có ID hợp lệ
  const {
    data: supervisorDetail,
    isLoading,
    isError,
    refetch,
  } = useAcademicSupervisorDetail(supervisorId, isOpen);

  // Chuẩn hóa dữ liệu định mức hạn ngạch BR-09
  const quotaSupervisor = useMemo<SupervisorQuotaRecord | null>(() => {
    if (supervisorDetail) {
      return mapBackendGvhdToSupervisorQuota(
        supervisorDetail,
        supervisorDetail.phanCongs || []
      );
    }
    return fallbackSupervisor || null;
  }, [supervisorDetail, fallbackSupervisor]);

  if (!isOpen) return null;

  // Trích xuất các trường thông tin chi tiết
  const hoTen = supervisorDetail?.hoTen || fallbackSupervisor?.name || "Giảng viên";
  const maGv = supervisorDetail?.maGv || fallbackSupervisor?.code || "—";
  const hocHamHocVi = supervisorDetail?.hocHamHocVi
    ? formatDegreeLabel(supervisorDetail.hocHamHocVi)
    : fallbackSupervisor?.degree || "Tiến sĩ";
  const displayName = formatSupervisorDisplayName(hoTen, supervisorDetail?.hocHamHocVi);
  
  const email = supervisorDetail?.email || "Chưa cập nhật";
  const soDienThoai = "Chưa cập nhật";
  const ngaySinh = supervisorDetail?.ngaySinh;
  const gioiTinh = supervisorDetail?.gioiTinh;
  const chuyenNganh = supervisorDetail?.chuyenNganh || "Chưa cập nhật";
  const quocGiaTotNghiep = supervisorDetail?.quocGiaTotNghiep || "Việt Nam";

  // Phân cấp Đơn vị (Khoa / Bộ môn)
  const donVi = supervisorDetail?.donVi;
  const tenDonVi = donVi?.ten || fallbackSupervisor?.department || "Chưa cập nhật";
  const tenDonViCha = donVi?.parent?.ten;
  const loaiDonVi = donVi?.loai;

  // Trạng thái hoạt động
  const isActive = supervisorDetail?.trangThai !== false;

  // Danh sách phân công NCS
  const phanCongs = supervisorDetail?.phanCongs || [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="supervisor-detail-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================================================================= */}
        {/* 1. HEADER CỐ ĐỊNH (shrink-0): Không bao giờ bị cuộn theo nội dung */}
        {/* ================================================================= */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-[#164E9B] px-6 py-4 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white shadow-xs">
              <UserCheck className="size-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="supervisor-detail-modal-title"
                  className="text-base font-bold text-white truncate"
                >
                  Hồ sơ Chi tiết Giảng viên Hướng dẫn
                </h2>
                {maGv && maGv !== "—" && (
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white tracking-wide font-mono">
                    {maGv}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-100 border border-emerald-400/30"
                      : "bg-rose-500/20 text-rose-100 border border-rose-400/30"
                  }`}
                >
                  {isActive ? (
                    <>
                      <ShieldCheck className="size-3" />
                      <span>Đang công tác</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="size-3" />
                      <span>Tạm khóa</span>
                    </>
                  )}
                </span>
                {isLoading && (
                  <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full text-white/90 animate-pulse">
                    Đang đồng bộ dữ liệu...
                  </span>
                )}
              </div>
              <p className="text-xs text-white/80 truncate mt-0.5">
                {displayName} • {tenDonViCha ? `${tenDonVi} (${tenDonViCha})` : tenDonVi}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer shrink-0 ml-3"
            aria-label="Đóng bảng chi tiết"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* 2. BODY NỘI DUNG (flex-1 overflow-y-auto): Scrollbar độc lập tại đây */}
        {/* ================================================================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Trạng thái đang tải */}
          {isLoading && !supervisorDetail && (
            <div className="py-12 text-center text-xs text-slate-500 space-y-2.5">
              <Loader2 className="size-7 animate-spin mx-auto text-[#164E9B]" />
              <p className="font-medium">Đang tải toàn bộ thông tin chi tiết giảng viên từ máy chủ...</p>
            </div>
          )}

          {/* Cảnh báo chế độ dự phòng nếu API lỗi */}
          {isError && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-amber-800 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="size-4 shrink-0 text-amber-600" />
                <span>
                  Không thể kết nối trực tiếp đến máy chủ. Đang hiển thị hồ sơ từ bộ nhớ đệm hệ thống.
                </span>
              </div>
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#164E9B] hover:underline shrink-0 cursor-pointer"
              >
                <RefreshCw className="size-3" />
                <span>Đồng bộ lại</span>
              </button>
            </div>
          )}

          {/* KHỐI 1: THÔNG TIN LÝ LỊCH & HỌC THUẬT */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <User className="size-4 text-[#164E9B]" />
              <span>Thông tin Lý lịch &amp; Chuyên môn Giảng viên</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-medium mb-0.5">Họ và tên</span>
                <span className="font-bold text-slate-900 text-sm">
                  {hoTen}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-medium mb-0.5">Mã giảng viên / SHCC</span>
                <span className="font-mono font-bold text-slate-800">
                  {maGv}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-medium mb-0.5">Học hàm / Học vị</span>
                <span className="font-bold text-[#164E9B]">
                  {hocHamHocVi}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-medium mb-0.5">Giới tính</span>
                <span className="font-semibold text-slate-800">
                  {formatGender(gioiTinh)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-medium mb-0.5">Ngày sinh</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-slate-400" />
                  {formatDate(ngaySinh)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-medium mb-0.5">Số điện thoại liên hệ</span>
                <span className="font-mono font-semibold text-slate-800 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-slate-400" />
                  {soDienThoai}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-medium mb-0.5">Email</span>
                <span className="font-mono text-slate-700 flex items-center gap-1.5 truncate">
                  <Mail className="size-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:underline hover:text-[#164E9B] truncate">
                    {email}
                  </a>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-medium mb-0.5">Chuyên ngành đào tạo</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{chuyenNganh}</span>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-medium mb-0.5">Nước tốt nghiệp / Đào tạo</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Globe className="size-3.5 text-slate-400 shrink-0" />
                  <span>{quocGiaTotNghiep}</span>
                </span>
              </div>

              {/* Đơn vị công tác */}
              <div className="sm:col-span-2 md:col-span-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-slate-400 shrink-0" />
                  <span className="text-[11px] text-slate-500 font-medium">Đơn vị chủ quản:</span>
                  <span className="font-bold text-slate-800">
                    {tenDonViCha ? tenDonViCha : tenDonVi}
                  </span>
                </div>

                {tenDonViCha && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-500 font-medium">Bộ môn trực thuộc:</span>
                    <span className="font-semibold text-slate-700">
                      {tenDonVi}
                    </span>
                  </div>
                )}

                {loaiDonVi && (
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {loaiDonVi === "KHOA" ? "Khoa / Viện" : loaiDonVi === "BO_MON" ? "Bộ môn" : "Phòng ban"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* KHỐI 2: HẠN NGẠCH & ĐỊNH MỨC THEO QUY ĐỊNH BR-09 */}
          {quotaSupervisor && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#164E9B] flex items-center gap-2">
                  <Award className="size-4 text-[#164E9B]" />
                  <span>Chỉ tiêu &amp; Tình trạng Hạn ngạch Đào tạo BR-09</span>
                </h3>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-600">
                    Định mức tối đa: <strong className="text-slate-900">{quotaSupervisor.maxQuota} NCS</strong>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-600">
                    Đã sử dụng: <strong className="text-[#164E9B]">{quotaSupervisor.usedQuota}</strong>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-600">
                    Còn lại:{" "}
                    <strong
                      className={
                        quotaSupervisor.usedQuota >= quotaSupervisor.maxQuota
                          ? "text-rose-600"
                          : "text-emerald-700 font-bold"
                      }
                    >
                      {Math.max(0, Number((quotaSupervisor.maxQuota - quotaSupervisor.usedQuota).toFixed(1)))}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Quota Bar trực quan */}
              <QuotaBar
                used={quotaSupervisor.usedQuota}
                max={quotaSupervisor.maxQuota}
                independentCount={quotaSupervisor.independentCount}
                coCount={quotaSupervisor.coCount}
                showDetails={true}
              />
            </div>
          )}

          {/* KHỐI 3: DANH SÁCH NGHIÊN CỨU SINH ĐANG HƯỚNG DẪN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <GraduationCap className="size-4 text-[#164E9B]" />
                <span>Nghiên cứu sinh đang được phân công hướng dẫn</span>
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                {phanCongs.length > 0
                  ? `${phanCongs.length} phân công hiệu lực`
                  : `${(quotaSupervisor?.independentCount || 0) + (quotaSupervisor?.coCount || 0)} phân công`}
              </span>
            </div>

            {phanCongs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {phanCongs.map((assignment, idx) => {
                  const isMain = assignment.vaiTro === "HUONG_DAN_CHINH";
                  const roleLabel = isMain ? "Hướng dẫn chính (1.0)" : "Đồng hướng dẫn (0.5)";
                  const roleBadgeStyle = isMain
                    ? "bg-blue-50 text-[#164E9B] border-blue-200"
                    : "bg-amber-50 text-amber-800 border-amber-200";

                  return (
                    <div
                      key={assignment.id || idx}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 hover:border-slate-300 hover:bg-slate-50 transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#164E9B] font-bold text-xs">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs truncate">
                              {assignment.ncs?.hoTen || "NCS chưa cập nhật tên"}
                            </h4>
                            <p className="text-[11px] font-mono text-slate-500">
                              MSHV: {assignment.ncs?.mshv || "—"}
                              {assignment.ncs?.khoaHoc && ` • ${assignment.ncs.khoaHoc}`}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${roleBadgeStyle}`}
                        >
                          {roleLabel}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Quyết định phân công</span>
                          <span className="font-mono font-semibold text-slate-800 flex items-center gap-1">
                            <FileText className="size-3 text-slate-400" />
                            {assignment.quyetDinh?.soQuyetDinh || "QĐ đang cập nhật"}
                          </span>
                          {assignment.quyetDinh?.ngayQuyetDinh && (
                            <span className="text-[10px] text-slate-400 block">
                              Ngày: {formatDate(assignment.quyetDinh.ngayQuyetDinh)}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px]">Thời gian bắt đầu</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1">
                            <Calendar className="size-3 text-slate-400" />
                            {formatDate(assignment.ngayBatDau)}
                          </span>
                          {assignment.ncs?.trangThai && (
                            <span className="text-[10px] text-emerald-600 font-medium block">
                              {assignment.ncs.trangThai === "DANG_HOC" ? "Đang học tập" : assignment.ncs.trangThai}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Thông tin liên hệ nếu có */}
                      {(assignment.ncs?.email || assignment.ncs?.soDienThoai) && (
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-1">
                          {assignment.ncs?.email && (
                            <span className="truncate">Email: {assignment.ncs.email}</span>
                          )}
                          {assignment.ncs?.soDienThoai && (
                            <span>ĐT: {assignment.ncs.soDienThoai}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : studentsList.length > 0 ? (
              /* Fallback dữ liệu từ danh sách NCS đã nạp ở component cha */
              (() => {
                const svName = hoTen.toLowerCase();
                const svId = supervisorId || "";
                const matchedStudents = studentsList.filter((st) => {
                  return (
                    Boolean(
                      st.supervisorMain &&
                        (st.supervisorMain.toLowerCase().includes(svName) || st.supervisorMain === svId)
                    ) ||
                    Boolean(
                      st.supervisorCo &&
                        (st.supervisorCo.toLowerCase().includes(svName) || st.supervisorCo === svId)
                    )
                  );
                });

                if (matchedStudents.length === 0) {
                  return (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-slate-50/50">
                      <GraduationCap className="size-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-xs font-semibold text-slate-600">
                        Hiện tại giảng viên chưa có phân công hướng dẫn nghiên cứu sinh nào.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Bạn có thể sử dụng nút &quot;Phân công thêm NCS&quot; bên dưới để gán nghiên cứu sinh mới.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {matchedStudents.slice(0, 6).map((st, idx) => {
                      const isMain = Boolean(
                        st.supervisorMain && st.supervisorMain.toLowerCase().includes(svName)
                      );
                      return (
                        <div
                          key={st.id || idx}
                          className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#164E9B] font-bold text-xs">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-900 text-xs truncate">
                                  {st.name}
                                </h4>
                                <p className="text-[11px] font-mono text-slate-500">
                                  MSSV: {st.code} • Khóa {st.cohort}
                                </p>
                              </div>
                            </div>
                            <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border bg-blue-50 text-[#164E9B] border-blue-200">
                              {isMain ? "Hướng dẫn chính (1.0)" : "Đồng hướng dẫn (0.5)"}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex justify-between items-center pt-1 border-t border-slate-200/80">
                            <span>Mốc đào tạo hiện tại: Mốc {st.currentMilestoneIndex}/9</span>
                            <span className="font-semibold text-slate-700">{st.department}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-slate-50/50">
                <GraduationCap className="size-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">
                  Hiện tại giảng viên chưa có phân công hướng dẫn nghiên cứu sinh nào.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Bạn có thể sử dụng nút &quot;Phân công thêm NCS&quot; bên dưới để gán nghiên cứu sinh mới.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. FOOTER CỐ ĐỊNH (shrink-0): Không bao giờ bị cuộn theo nội dung */}
        {/* ================================================================= */}
        <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <div className="text-xs text-slate-500">
            {quotaSupervisor && (
              <span>
                Hạn ngạch đào tạo khả dụng:{" "}
                <strong
                  className={
                    quotaSupervisor.usedQuota >= quotaSupervisor.maxQuota
                      ? "text-rose-600"
                      : "text-[#164E9B]"
                  }
                >
                  {Math.max(0, Number((quotaSupervisor.maxQuota - quotaSupervisor.usedQuota).toFixed(1)))}
                </strong>{" "}
                chỉ tiêu
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Đóng hồ sơ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupervisorDetailModal;
