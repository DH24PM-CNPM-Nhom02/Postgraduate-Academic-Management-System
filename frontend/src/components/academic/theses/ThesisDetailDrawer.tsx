"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  X,
  BookOpen,
  FileText,
  Clock,
  History,
  Users,
  ExternalLink,
  Download,
  AlertCircle,
  PlusCircle,
  Ban,
  Calendar,
} from "lucide-react";
import type { AcademicThesisNcsItem } from "@/src/types/api/thesis";
import { useAcademicThesisDetail } from "@/src/hooks/use-theses";
import { formatDate } from "@/src/lib/utils";
import { ThesisStatusBadge } from "./ThesisStatusBadge";

export interface ThesisDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ncsId: string | null;
  ncsSummary?: AcademicThesisNcsItem | null;
  onAssignThesis?: (item: AcademicThesisNcsItem) => void;
  onDeactivateThesis?: (item: AcademicThesisNcsItem) => void;
}

export function ThesisDetailDrawer({
  isOpen,
  onClose,
  ncsId,
  ncsSummary,
  onAssignThesis,
  onDeactivateThesis,
}: ThesisDetailDrawerProps) {
  // Lấy chi tiết đề tài và phân công của NCS từ hook
  const { data: detail, isLoading } = useAcademicThesisDetail(ncsId);

  // Đóng bằng phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentItem = ncsSummary || null;
  const currentThesis =
    detail?.deTaiHienTai || currentItem?.deTaiHienTai || null;
  const allTheses = detail?.deTais || currentItem?.deTais || [];
  const supervisors = detail?.phanCongs || currentItem?.phanCongs || [];

  // Lịch sử đề tài (loại bỏ đề tài hiện tại hoặc sắp xếp theo ngày giảm dần)
  const sortedThesesHistory = [...allTheses].sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  const mshv = detail?.mshv || currentItem?.mshv || "N/A";
  const hoTen = detail?.hoTen || currentItem?.hoTen || "NCS";
  const khoaHoc = detail?.khoaHoc || currentItem?.khoaHoc || "";

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      {/* Backdrop mờ */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel trượt từ bên phải */}
      <div className="fixed inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
        {/* HEADER DRAWER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4.5 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-[#164E9B]">
              <BookOpen className="size-5" />
            </div>
            <div>
              <h2
                id="drawer-title"
                className="text-base font-bold text-slate-900 tracking-tight"
              >
                Chi Tiết &amp; Lịch Sử Đề Tài
              </h2>
              <p className="text-xs text-slate-500">
                {hoTen} • <span className="font-mono font-semibold">{mshv}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
            title="Đóng (Esc)"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-28 bg-slate-100 rounded-2xl" />
              <div className="h-44 bg-slate-100 rounded-2xl" />
              <div className="h-32 bg-slate-100 rounded-2xl" />
            </div>
          ) : (
            <>
              {/* 1. THẺ TÓM TẮT THÔNG TIN NCS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{hoTen}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      MSHV: <span className="font-mono font-bold text-[#164E9B]">{mshv}</span> • {khoaHoc}
                    </p>
                  </div>
                  <ThesisStatusBadge
                    status={currentThesis ? currentThesis.trangThai : "CHUA_GIAO"}
                    size="md"
                  />
                </div>

                {currentItem?.hasPendingChangeRequest && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    <Clock className="size-4 shrink-0 text-amber-600" />
                    <span>
                      NCS này đang có <strong>Đơn xin điều chỉnh đề tài</strong> chờ Hội đồng / Giáo vụ duyệt.
                    </span>
                  </div>
                )}
              </div>

              {/* 2. ĐỀ TÀI HIỆN TẠI ĐANG HIỆU LỰC */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <BookOpen className="size-3.5 text-[#164E9B]" />
                    <span>Đề tài Luận án Hiện tại</span>
                  </h4>

                  {currentThesis && onDeactivateThesis && currentItem && (
                    <button
                      type="button"
                      onClick={() => onDeactivateThesis(currentItem)}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Ban className="size-3" />
                      <span>Hủy đề tài này</span>
                    </button>
                  )}
                </div>

                {currentThesis ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-3 shadow-xs">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900 leading-relaxed">
                        “{currentThesis.tenDeTai}”
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="size-3.5 text-slate-400" />
                        <span>
                          Thời gian bắt đầu:{" "}
                          <strong>{formatDate(currentThesis.createdAt)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Quyết định giao đề tài */}
                    <div className="rounded-xl border border-emerald-200 bg-white p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                          Căn cứ pháp lý
                        </span>
                        <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <FileText className="size-3.5 text-emerald-600" />
                          <span>
                            Số: {currentThesis.quyetDinh?.soQuyetDinh || "Chưa có số QĐ"}
                          </span>
                        </p>
                        {currentThesis.quyetDinh?.ngayQuyetDinh && (
                          <p className="text-[11px] text-slate-500">
                            Ngày ký: {formatDate(currentThesis.quyetDinh.ngayQuyetDinh)}
                          </p>
                        )}
                      </div>

                      {currentThesis.quyetDinh?.fileId && (
                        <a
                          href={`/api/v1/documents/${currentThesis.quyetDinh.fileId}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors self-start sm:self-auto cursor-pointer"
                        >
                          <Download className="size-3.5 text-emerald-600" />
                          <span>Tải file Scan QĐ</span>
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center space-y-3">
                    <Clock className="size-8 mx-auto text-amber-500" />
                    <div>
                      <p className="font-bold text-slate-800 text-xs">
                        Nghiên cứu sinh chưa được giao đề tài chính thức
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Cần ban hành quyết định và thực hiện giao đề tài cho NCS.
                      </p>
                    </div>
                    {onAssignThesis && currentItem && (
                      <button
                        type="button"
                        onClick={() => onAssignThesis(currentItem)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#164E9B] px-4 py-2 text-xs font-bold text-white hover:bg-[#123E7C] transition-colors shadow-xs cursor-pointer"
                      >
                        <PlusCircle className="size-4" />
                        <span>Giao đề tài ngay</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 3. DÒNG THỜI GIAN LỊCH SỬ ĐỀ TÀI (TIMELINE) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <History className="size-3.5 text-purple-600" />
                  <span>Dòng thời gian Lịch sử Đề tài ({sortedThesesHistory.length})</span>
                </h4>

                {sortedThesesHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    Chưa có lịch sử thay đổi đề tài nào được ghi nhận.
                  </p>
                ) : (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {sortedThesesHistory.map((item, index) => {
                      const isCurrent = item.trangThai === "HIEU_LUC";
                      return (
                        <div key={item.id || index} className="relative space-y-1.5 text-xs">
                          {/* Dot trên timeline */}
                          <div
                            className={`absolute -left-6 top-1 size-4 rounded-full border-2 bg-white flex items-center justify-center ${
                              isCurrent
                                ? "border-emerald-500 bg-emerald-50"
                                : item.trangThai === "DA_THAY_THE"
                                ? "border-purple-500 bg-purple-50"
                                : "border-rose-500 bg-rose-50"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                isCurrent
                                  ? "bg-emerald-500"
                                  : item.trangThai === "DA_THAY_THE"
                                  ? "bg-purple-500"
                                  : "bg-rose-500"
                              }`}
                            />
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-slate-900 leading-snug">
                                “{item.tenDeTai}”
                              </span>
                              <ThesisStatusBadge status={item.trangThai} size="sm" />
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                              <span>
                                Tạo ngày: <strong>{formatDate(item.createdAt)}</strong>
                              </span>
                              {item.ngayKetThuc && (
                                <>
                                  <span>•</span>
                                  <span>
                                    Kết thúc: <strong>{formatDate(item.ngayKetThuc)}</strong>
                                  </span>
                                </>
                              )}
                              {item.quyetDinh?.soQuyetDinh && (
                                <>
                                  <span>•</span>
                                  <span>QĐ: {item.quyetDinh.soQuyetDinh}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. ĐỘI NGŨ GIẢNG VIÊN HƯỚNG DẪN */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Users className="size-3.5 text-blue-600" />
                  <span>Cán bộ Hướng dẫn (GVHD)</span>
                </h4>

                {supervisors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {supervisors.map((pc, idx) => (
                      <div
                        key={pc.id || idx}
                        className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {pc.gvhd.hoTen}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                              pc.vaiTro === "HUONG_DAN_CHINH"
                                ? "bg-blue-100 text-[#164E9B]"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {pc.vaiTro === "HUONG_DAN_CHINH"
                              ? "Hướng dẫn chính"
                              : "Đồng hướng dẫn"}
                          </span>
                        </div>
                        {pc.gvhd.email && (
                          <p className="text-[11px] text-slate-500">{pc.gvhd.email}</p>
                        )}
                        {pc.quyetDinh?.soQuyetDinh && (
                          <p className="text-[10px] text-slate-400">
                            Theo QĐ {pc.quyetDinh.soQuyetDinh}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex items-center gap-2">
                    <AlertCircle className="size-4 shrink-0 text-amber-600" />
                    <span>Nghiên cứu sinh chưa được phân công Giảng viên Hướng dẫn.</span>
                  </div>
                )}
              </div>

              {/* 5. LIÊN KẾT NHANH */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Liên kết nghiệp vụ liên quan
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {ncsId && (
                    <Link
                      href={`/academic/students`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:text-[#164E9B] hover:bg-blue-50 transition-colors shadow-2xs"
                    >
                      <span>Xem Hồ sơ NCS</span>
                      <ExternalLink className="size-3 text-slate-400" />
                    </Link>
                  )}
                  <Link
                    href="/academic/topic-changes"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:text-[#164E9B] hover:bg-blue-50 transition-colors shadow-2xs"
                  >
                    <span>Duyệt đề nghị đổi đề tài</span>
                    <ExternalLink className="size-3 text-slate-400" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER DRAWER */}
        <div className="border-t border-slate-200 px-6 py-3.5 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThesisDetailDrawer;
