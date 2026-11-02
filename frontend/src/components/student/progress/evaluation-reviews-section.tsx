"use client";

import React, { useState } from "react";
import {
  Award,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  X,
  Loader2,
  UserCheck,
} from "lucide-react";
import { PhieuNhanXetItem } from "@/src/types/progress";

interface EvaluationReviewsSectionProps {
  yeuCauDiem: boolean;
  thuTuMoc: number;
  diemTrungBinh?: string | number;
  phieuNhanXets?: PhieuNhanXetItem[];
}

export function EvaluationReviewsSection({
  yeuCauDiem,
  thuTuMoc,
  diemTrungBinh,
  phieuNhanXets = [],
}: EvaluationReviewsSectionProps) {
  const [selectedPhieu, setSelectedPhieu] = useState<PhieuNhanXetItem | null>(
    null
  );
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Chỉ hiển thị cho các mốc có cờ yeuCauDiem = true (Mốc 2, 4, 5...)
  if (!yeuCauDiem) {
    return null;
  }

  const numericScore = diemTrungBinh ? Number(diemTrungBinh) : null;
  const isPassedScore = numericScore !== null && numericScore >= 7.0;

  const handleOpenPdf = (phieu: PhieuNhanXetItem) => {
    setSelectedPhieu(phieu);
    setIsLoadingFile(true);
    setPreviewOpen(true);
    setTimeout(() => {
      setIsLoadingFile(false);
    }, 300);
  };

  return (
    <div className="mt-3.5 pt-3.5 border-t border-slate-200/80 space-y-3">
      {/* 1. Header Section Kết quả đánh giá */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
            <Award className="size-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              Kết quả đánh giá / Phiếu nhận xét (Mốc {thuTuMoc})
            </h4>
            <p className="text-[11px] text-slate-500 font-normal">
              Biên bản và phiếu đánh giá chính thức của Hội đồng chuyên môn
            </p>
          </div>
        </div>

        {/* 2. Badge nổi bật Điểm trung bình: X/10 */}
        {numericScore !== null ? (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-2xs font-mono transition-all ${
              isPassedScore
                ? "bg-emerald-50 text-emerald-950 border-emerald-300 ring-1 ring-emerald-500/20"
                : "bg-rose-50 text-rose-950 border-rose-300 ring-1 ring-rose-500/20"
            }`}
          >
            <div className="flex items-center gap-1.5">
              {isPassedScore ? (
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="size-4 text-rose-600 shrink-0" />
              )}
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Điểm trung bình:
              </span>
            </div>
            <span
              className={`text-sm sm:text-base font-black ${
                isPassedScore ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {numericScore.toFixed(1)} / 10.0
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                isPassedScore
                  ? "bg-emerald-200/70 text-emerald-900"
                  : "bg-rose-200/70 text-rose-900"
              }`}
            >
              {isPassedScore ? "ĐẠT (≥ 7.0)" : "CHƯA ĐẠT (< 7.0)"}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            <span>Chờ Hội đồng chấm điểm</span>
          </div>
        )}
      </div>

      {/* 3. Danh sách Phiếu nhận xét của Hội đồng (Tối thiểu 3 phiếu) */}
      {phieuNhanXets.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th scope="col" className="py-2.5 px-3 sm:px-4">
                    Thành viên Hội đồng / Người chấm
                  </th>
                  <th scope="col" className="py-2.5 px-3 text-center">
                    Điểm số
                  </th>
                  <th scope="col" className="py-2.5 px-3 hidden sm:table-cell">
                    Thời gian chấm
                  </th>
                  <th scope="col" className="py-2.5 px-3 sm:px-4 text-right">
                    Tệp đính kèm
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {phieuNhanXets.map((phieu, idx) => (
                  <tr
                    key={phieu.id || idx}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Cột 1: Tên & Chức danh người chấm */}
                    <td className="py-2.5 px-3 sm:px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {phieu.tenNguoiCham}
                          </p>
                          <p className="text-[11px] font-medium text-slate-500">
                            {phieu.chucDanh}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Điểm số */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-mono font-black text-xs sm:text-sm px-2 py-0.5 rounded-md bg-slate-100 text-slate-900 border border-slate-200">
                        {phieu.diem.toFixed(1)}
                      </span>
                    </td>

                    {/* Cột 3: Thời gian */}
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] hidden sm:table-cell">
                      {phieu.ngayDanhGia || "Đã nghiệm thu"}
                    </td>

                    {/* Cột 4: Nút Xem phiếu (PDF) */}
                    <td className="py-2.5 px-3 sm:px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenPdf(phieu)}
                        title={`Xem ${phieu.fileName || "Phiếu nhận xét"}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#164E9B] font-semibold text-xs transition-colors border border-indigo-200/60 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#164E9B]"
                      >
                        <FileText className="size-3.5 text-[#164E9B]" />
                        <span>Xem phiếu (PDF)</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>Chế độ xem tài liệu lưu trữ chính thức (Read-only)</span>
            </span>
            <span className="font-mono">
              Tổng số: {phieuNhanXets.length} phiếu đánh giá
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 flex items-center gap-2">
          <UserCheck className="size-4 text-slate-400 shrink-0" />
          <span>
            Hội đồng chấm điểm mốc này đang trong quá trình tổng hợp và số hóa phiếu nhận xét.
          </span>
        </div>
      )}

      {/* Modal Preview PDF cho Phiếu nhận xét */}
      {previewOpen && selectedPhieu && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedPhieu.fileName || "Phiếu nhận xét đánh giá"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Người chấm: <strong>{selectedPhieu.tenNguoiCham}</strong> ({selectedPhieu.chucDanh}) • Điểm: <strong>{selectedPhieu.diem.toFixed(1)}/10.0</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                aria-label="Đóng xem trước"
              >
                <X className="size-4.5" />
              </button>
            </div>

            {/* Nội dung xem trước mô phỏng chuẩn Form đánh giá học thuật */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-100/60 flex flex-col items-center justify-center min-h-[340px]">
              {isLoadingFile ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="size-8 animate-spin text-[#164E9B]" />
                  <p className="text-xs text-slate-500">Đang chuẩn bị bản xem trước...</p>
                </div>
              ) : (
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
                  <div className="text-center border-b border-slate-100 pb-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      ĐẠI HỌC QUỐC GIA TP. HỒ CHÍ MINH
                    </p>
                    <p className="text-xs font-black text-slate-900 uppercase">
                      TRƯỜNG ĐẠI HỌC AN GIANG • PHÒNG ĐÀO TẠO SĐH
                    </p>
                    <h4 className="text-sm font-bold text-[#164E9B] mt-2">
                      PHIẾU ĐÁNH GIÁ CHUYÊN MÔN TIẾN TIẾN SĨ
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Biểu mẫu số: BM-SDH-04/BR-08
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                    <p>
                      <strong className="text-slate-900">Thành viên chấm:</strong>{" "}
                      {selectedPhieu.tenNguoiCham}
                    </p>
                    <p>
                      <strong className="text-slate-900">Vai trò Hội đồng:</strong>{" "}
                      {selectedPhieu.chucDanh}
                    </p>
                    <p>
                      <strong className="text-slate-900">Điểm đánh giá:</strong>{" "}
                      <span className="font-mono font-black text-sm text-[#164E9B]">
                        {selectedPhieu.diem.toFixed(1)} / 10.0
                      </span>
                    </p>
                    <p>
                      <strong className="text-slate-900">Nhận xét tóm tắt:</strong>{" "}
                      <span className="italic text-slate-600">
                        {selectedPhieu.nhanXet ||
                          "NCS nắm vững phương pháp nghiên cứu, tài liệu tổng quan phong phú và đạt chuẩn theo khung chương trình đào tạo tiến sĩ."}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="size-3.5" />
                      Chữ ký số hợp lệ
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(false)}
                      className="px-4 py-2 bg-[#164E9B] text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors shadow-2xs"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EvaluationReviewsSection;
