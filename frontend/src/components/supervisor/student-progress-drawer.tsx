"use client";

import React, { useEffect } from "react";
import {
  X,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  FileText,
  Lock,
  Unlock,
  AlertTriangle,
  Info,
} from "lucide-react";
import { SupervisorStudentItem } from "@/src/lib/mockData";
import { MilestoneProgressItem } from "@/src/types/progress";
import { DocumentViewButton } from "@/src/components/student/progress/document-view-button";
import { EvaluationReviewsSection } from "@/src/components/student/progress/evaluation-reviews-section";

interface StudentProgressDrawerProps {
  student: SupervisorStudentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentProgressDrawer({
  student,
  isOpen,
  onClose,
}: StudentProgressDrawerProps) {
  // Lắng nghe phím ESC để đóng Drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Khóa cuộn trang nền khi mở Drawer
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !student) return null;

  // Format ngày dd/MM/yyyy
  const formatDateStr = (isoString?: string): string => {
    if (!isoString) return "--/--/----";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop mờ nền */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Slide-over Container trượt từ bên phải */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-3xl lg:max-w-4xl bg-[#F0F5FA] shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300 ease-out">
          {/* 1. Header cố định của Drawer */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-gradient-to-br from-[#164E9B] to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                <GraduationCap className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {student.hoTen}
                  </h2>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                    {student.mshv}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      student.vaiTroHuongDan === "CHINH"
                        ? "bg-blue-50 text-[#164E9B] border border-blue-200"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    }`}
                  >
                    {student.vaiTroHuongDan === "CHINH"
                      ? "GVHD Chính"
                      : "Đồng Hướng dẫn"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Lớp: <strong className="text-slate-800">{student.lop}</strong> • {student.khoaDaoTao} • Chuyên ngành: <strong className="text-slate-800">{student.chuyenNganh}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#164E9B]"
              aria-label="Đóng bảng chi tiết"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* 2. Nội dung cuộn chính bên trong Drawer */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
            {/* Box Đề tài Luận án & Cảnh báo mốc */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Đề tài Luận án Tiến sĩ
                </span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                  <Clock className="size-3.5 text-amber-600" />
                  <span>Thời hạn đào tạo còn {student.soThangConLai} tháng</span>
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {student.tenDeTai}
              </h3>

              {/* Banner cảnh báo mốc bị lỗi nếu có */}
              {student.hasRejectedMilestone && student.rejectedMilestoneInfo && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 space-y-2 text-rose-950">
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-800">
                    <AlertTriangle className="size-4 text-rose-600 shrink-0" />
                    <span>
                      CẢNH BÁO: MỐC {student.rejectedMilestoneInfo.mocSo} CHƯA ĐẠT YÊU CẦU
                    </span>
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed pl-6 font-medium italic">
                    &ldquo;{student.rejectedMilestoneInfo.lyDoTuChoi}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pl-6 text-[11px] text-rose-700 font-medium">
                    <span>Người duyệt: <strong>{student.rejectedMilestoneInfo.nguoiDuyet}</strong></span>
                    <span>•</span>
                    <span>Ngày: {formatDateStr(student.rejectedMilestoneInfo.ngayDuyet)}</span>
                  </div>
                </div>
              )}

              {/* Progress Summary bar */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">
                      Tiến độ tổng thể:{" "}
                      <strong className="text-[#164E9B] font-bold">
                        {student.soMocHoanThanh} / {student.tongSoMoc} mốc ({student.tienDoPhanTram}%)
                      </strong>
                    </span>
                    <span className="font-bold text-slate-900">
                      Đang ở Mốc {student.mocHienTai}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                    <div
                      className={`rounded-full transition-all duration-500 ${
                        student.hasRejectedMilestone
                          ? "bg-rose-500"
                          : "bg-[#164E9B]"
                      }`}
                      style={{ width: `${student.tienDoPhanTram}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Stepper ngang 9 mốc (Read-only Timeline) */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Lộ trình 9 mốc đào tạo (Chế độ Xem GVHD)
                </h4>
                <span className="text-[11px] font-semibold text-[#164E9B] bg-blue-50 px-2.5 py-0.5 rounded-full">
                  NCS đang ở Mốc {student.mocHienTai}
                </span>
              </div>

              {/* Horizontal Stepper nodes */}
              <div className="overflow-x-auto pb-3 pt-1">
                <div className="min-w-[720px] flex items-start justify-between relative">
                  {student.milestones.map((m, index) => {
                    const isPassed = m.trangThai === "PASSED";
                    const isRejected = m.trangThai === "REJECTED";
                    const isPending = m.trangThai === "PENDING_REVIEW";
                    const isUnlocked = m.trangThai === "UNLOCKED";
                    const isCurrent = m.thuTu === student.mocHienTai;
                    const isLast = index === student.milestones.length - 1;

                    return (
                      <div
                        key={m.id || m.thuTu}
                        className="flex-1 flex flex-col items-center text-center relative p-1"
                      >
                        {/* Line connector */}
                        {!isLast && (
                          <div
                            className={`absolute top-4 left-1/2 w-full h-[2px] z-0 ${
                              isPassed ? "bg-emerald-600" : "bg-slate-200"
                            }`}
                          />
                        )}

                        {/* Node circle */}
                        <div
                          className={`relative z-10 size-8 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-2xs transition-all ${
                            isPassed
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : isRejected
                              ? "bg-rose-600 text-white border-rose-600 ring-4 ring-rose-400/25 animate-pulse"
                              : isPending
                              ? "bg-amber-500 text-white border-amber-500 ring-4 ring-amber-400/25"
                              : isUnlocked
                              ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400/20"
                              : "bg-slate-100 text-slate-400 border-slate-200"
                          } ${
                            isCurrent
                              ? "ring-2 ring-offset-2 ring-[#164E9B] scale-105"
                              : ""
                          }`}
                          title={`Mốc ${m.thuTu}: ${m.tenMoc}`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="size-4" />
                          ) : isRejected ? (
                            <AlertCircle className="size-4" />
                          ) : isPending ? (
                            <Clock className="size-4" />
                          ) : isUnlocked ? (
                            <Unlock className="size-3.5" />
                          ) : (
                            <Lock className="size-3.5" />
                          )}
                        </div>

                        {/* Labels */}
                        <div className="mt-2 space-y-0.5 max-w-[85px]">
                          <p
                            className={`text-[11px] font-bold leading-tight ${
                              isCurrent
                                ? "text-[#164E9B]"
                                : isRejected
                                ? "text-rose-700"
                                : isPassed
                                ? "text-emerald-700"
                                : "text-slate-600"
                            }`}
                          >
                            Mốc {m.thuTu}
                          </p>
                          <span
                            className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                              isPassed
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isRejected
                                ? "bg-rose-50 text-rose-700 border-rose-200 font-extrabold"
                                : isPending
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-50 text-slate-500 border-slate-200"
                            }`}
                          >
                            {isPassed
                              ? "Đạt"
                              : isRejected
                              ? "Lỗi mốc"
                              : isPending
                              ? "Chờ duyệt"
                              : isUnlocked
                              ? "Mở"
                              : "Khóa"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Danh sách chi tiết 9 mốc (Read-only Cards) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Chi tiết hồ sơ 9 mốc đào tạo</span>
                  <span className="text-xs font-normal text-slate-500">
                    (Chế độ Thẩm định & Giám sát GVHD)
                  </span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  9/9 mốc BR-08
                </span>
              </div>

              {student.milestones.map((m: MilestoneProgressItem) => {
                const isPassed = m.trangThai === "PASSED";
                const isRejected = m.trangThai === "REJECTED";
                const isPending = m.trangThai === "PENDING_REVIEW";
                const isUnlocked = m.trangThai === "UNLOCKED";
                const isLocked = m.trangThai === "LOCKED";
                const isCurrent = m.thuTu === student.mocHienTai;

                return (
                  <article
                    key={m.id || m.thuTu}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isRejected
                        ? "bg-white border-rose-300 ring-2 ring-rose-500/10 shadow-xs"
                        : isPending
                        ? "bg-white border-amber-300 shadow-xs"
                        : isPassed
                        ? "bg-white border-emerald-200/90 shadow-2xs"
                        : isCurrent
                        ? "bg-white border-blue-300 shadow-xs ring-1 ring-blue-500/10"
                        : "bg-slate-50/70 border-slate-200/80 shadow-2xs"
                    }`}
                  >
                    {/* Top strip màu theo trạng thái */}
                    <div
                      className={`h-1 w-full ${
                        isRejected
                          ? "bg-rose-500"
                          : isPending
                          ? "bg-amber-500"
                          : isPassed
                          ? "bg-emerald-600"
                          : isUnlocked
                          ? "bg-blue-600"
                          : "bg-slate-200"
                      }`}
                    />

                    <div className="p-4 sm:p-5 space-y-3">
                      {/* Header mốc */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-2xs ${
                              isPassed
                                ? "bg-emerald-600 text-white"
                                : isRejected
                                ? "bg-rose-600 text-white ring-2 ring-rose-400/20"
                                : isPending
                                ? "bg-amber-500 text-white"
                                : isUnlocked
                                ? "bg-blue-600 text-white"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            0{m.thuTu}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Mốc {m.thuTu} / 9
                              </span>
                              {m.thoiGianDuKien && (
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                  {m.thoiGianDuKien}
                                </span>
                              )}
                              {m.yeuCauDiem && (
                                <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                                  <Award className="size-3" />
                                  Có chấm điểm
                                </span>
                              )}
                              {isCurrent && (
                                <span className="text-[10px] font-bold text-[#164E9B] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                                  Mốc hiện tại
                                </span>
                              )}
                            </div>

                            <h5 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                              {m.tenMoc}
                            </h5>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isPassed && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="size-3.5" />
                              Đã hoàn thành
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <AlertCircle className="size-3.5" />
                              Yêu cầu hoàn thiện lại
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="size-3.5" />
                              Đang chờ duyệt
                            </span>
                          )}
                          {isUnlocked && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <Unlock className="size-3.5" />
                              NCS đang thực hiện
                            </span>
                          )}
                          {isLocked && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                              <Lock className="size-3.5" />
                              Đang khóa
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mô tả mốc */}
                      {m.moTa && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {m.moTa}
                        </p>
                      )}

                      {/* Lưu ý đặc thù Mốc 8: Gộp tất cả bài báo thành 1 file PDF */}
                      {m.thuTu === 8 && (
                        <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-2.5 text-blue-950 shadow-2xs">
                          <Info className="size-4 text-[#164E9B] shrink-0 mt-0.5" />
                          <div className="text-xs space-y-0.5">
                            <span className="font-bold text-[#164E9B]">
                              Lưu ý quan trọng cho Mốc 8:{" "}
                            </span>
                            <p className="text-blue-900 leading-relaxed font-medium">
                              Bạn cần gộp tất cả các bài báo khoa học thành 1 file PDF duy nhất trước khi nộp.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* KHỐI NỔI BẬT: MỐC BỊ TỪ CHỐI / LỖI (REJECTED) */}
                      {isRejected && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 space-y-2 text-rose-950">
                          <div className="flex items-center gap-2 font-bold text-xs text-rose-800">
                            <AlertCircle className="size-4 text-rose-600 shrink-0" />
                            <span>
                              Nhận xét &amp; Lý do chưa đạt từ Hội đồng / Giáo vụ:
                            </span>
                          </div>
                          <p className="text-xs text-rose-900 leading-relaxed pl-6 font-medium italic">
                            &ldquo;{m.lyDoTuChoi || "Hồ sơ chưa đạt yêu cầu theo quy chế."}&rdquo;
                          </p>

                          {m.minhChungHienTai && (
                            <div className="mt-2.5 pl-6 pt-2 border-t border-rose-200/60 flex items-center justify-between flex-wrap gap-2 text-xs">
                              <div className="flex items-center gap-2 text-slate-700">
                                <FileText className="size-3.5 text-rose-600" />
                                <span className="font-medium text-slate-900 truncate max-w-[240px]">
                                  {m.minhChungHienTai.fileName}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  (Lần nộp {m.minhChungHienTai.lanNop})
                                </span>
                              </div>

                              <DocumentViewButton
                                fileId={m.minhChungHienTai.fileId}
                                fileName={m.minhChungHienTai.fileName}
                                fileUrl={m.minhChungHienTai.fileUrl}
                                size="sm"
                                variant="outline"
                                showLabel={true}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* KHỐI MỐC ĐÃ HOÀN THÀNH (PASSED) */}
                      {isPassed && m.thuTu !== 1 && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-950 space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="size-3.5 text-emerald-600" />
                              <span>
                                Đã nghiệm thu &amp; xác nhận ngày{" "}
                                <strong>{formatDateStr(m.ngayHoanThanh)}</strong>
                              </span>
                            </div>

                            {/* Điểm số nếu có */}
                            {m.yeuCauDiem && m.diemTrungBinh && (
                              <span className="font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                                Điểm TB: {Number(m.diemTrungBinh).toFixed(1)} / 10.0
                              </span>
                            )}
                          </div>

                          {m.minhChungHienTai && (
                            <div className="flex items-center justify-between gap-2 p-2 bg-white/90 rounded-lg border border-emerald-200/70 text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="size-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate font-medium text-slate-800">
                                  {m.minhChungHienTai.fileName}
                                </span>
                              </div>
                              <DocumentViewButton
                                fileId={m.minhChungHienTai.fileId}
                                fileName={m.minhChungHienTai.fileName}
                                fileUrl={m.minhChungHienTai.fileUrl}
                                size="sm"
                                variant="outline"
                                showLabel={true}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* KHỐI MỐC ĐANG CHỜ DUYỆT (PENDING_REVIEW) */}
                      {isPending && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-950 space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="size-3.5 text-amber-600" />
                            <span>
                              NCS đã nộp hồ sơ ngày{" "}
                              <strong>{formatDateStr(m.minhChungHienTai?.ngayNop)}</strong>. Đang chờ Hội đồng &amp; Giáo vụ thẩm định.
                            </span>
                          </div>

                          {m.minhChungHienTai && (
                            <div className="flex items-center justify-between gap-2 p-2 bg-white/90 rounded-lg border border-amber-200/70 text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="size-3.5 text-amber-600 shrink-0" />
                                <span className="truncate font-medium text-slate-800">
                                  {m.minhChungHienTai.fileName}
                                </span>
                              </div>
                              <DocumentViewButton
                                fileId={m.minhChungHienTai.fileId}
                                fileName={m.minhChungHienTai.fileName}
                                fileUrl={m.minhChungHienTai.fileUrl}
                                size="sm"
                                variant="outline"
                                showLabel={true}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Section Phiếu nhận xét / Kết quả đánh giá của Hội đồng (Mốc có yeuCauDiem = true: Mốc 2, 4, 5) */}
                      {m.yeuCauDiem && (
                        <EvaluationReviewsSection
                          yeuCauDiem={m.yeuCauDiem}
                          thuTuMoc={m.thuTu}
                          diemTrungBinh={m.diemTrungBinh}
                          phieuNhanXets={m.phieuNhanXets}
                        />
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Footer nút đóng của Drawer */}
          <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white p-4 sm:px-6 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Chế độ giám sát Luồng 9 mốc Nghiên cứu sinh (Read-only)
            </p>
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              Đóng bảng chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProgressDrawer;
