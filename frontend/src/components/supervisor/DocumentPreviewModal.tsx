"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  Printer,
  ExternalLink,
} from "lucide-react";

export interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  studentName?: string;
  studentCode?: string;
  milestoneName?: string;
  submissionDate?: string;
  fileSize?: string;
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  documentTitle = "Báo cáo chuyên đề 1 - Tổng quan lý thuyết nghiên cứu",
  studentName = "Nguyễn Văn An",
  studentCode = "NCS230104",
  milestoneName = "Mốc 3: Báo cáo chuyên đề tiến sĩ đợt 1",
  submissionDate = "14/10/2026 14:32",
  fileSize = "3.8 MB",
}: DocumentPreviewModalProps) {
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const totalPages = 16;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative flex h-[92vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#164E9B] px-5 py-3.5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white">
              <FileText className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight text-white line-clamp-1">
                  {documentTitle}
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 border border-emerald-400/30">
                  <ShieldCheck className="size-3" />
                  Mã SHA-256 Hợp lệ
                </span>
              </div>
              <p className="text-xs text-white/80">
                NCS: <strong className="text-white">{studentName}</strong> ({studentCode}) • {milestoneName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`Đang tải xuống tài liệu gốc: ${documentTitle}.pdf (Bản có chữ ký số xác thực).`);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25 transition-colors"
            >
              <Download className="size-3.5" />
              <span>Tải PDF gốc ({fileSize})</span>
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Đóng xem trước"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-2 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">Trang:</span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md p-1 hover:bg-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="px-2 font-mono font-bold text-[#164E9B]">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-md p-1 hover:bg-slate-200 disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Nộp ngày: {submissionDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom((z) => Math.max(60, z - 15))}
              className="rounded-md p-1 hover:bg-slate-200"
              title="Thu nhỏ"
            >
              <ZoomOut className="size-4" />
            </button>
            <span className="w-12 text-center font-mono font-bold">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 15))}
              className="rounded-md p-1 hover:bg-slate-200"
              title="Phóng to"
            >
              <ZoomIn className="size-4" />
            </button>
          </div>
        </div>

        {/* PDF Document Canvas Viewport */}
        <div className="relative flex-1 overflow-auto bg-slate-200/80 p-6 flex justify-center items-start">
          {/* Watermark overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-7">
            <div className="rotate-[-25deg] text-center font-black uppercase text-slate-900 tracking-widest text-4xl select-none">
              TRƯỜNG ĐẠI HỌC AN GIANG • HỆ THỐNG QUẢN LÝ ĐÀO TẠO SĐH • XEM TRƯỚC AN TOÀN
            </div>
          </div>

          {/* Academic Paper Page Sheet */}
          <div
            className="w-full max-w-3xl rounded-sm bg-white p-12 shadow-md border border-slate-300 transition-transform origin-top text-slate-800"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {/* Header of paper */}
            <div className="text-center pb-6 border-b border-slate-200 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                ĐẠI HỌC QUỐC GIA TP. HỒ CHÍ MINH
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#164E9B]">
                TRƯỜNG ĐẠI HỌC AN GIANG - PHÒNG ĐÀO TẠO SAU ĐẠI HỌC
              </p>
              <div className="my-2 h-0.5 w-16 mx-auto bg-[#164E9B]" />
              <p className="text-xs italic text-slate-500">
                Chuyên ngành: Khoa học Máy tính • Mã số chuyên ngành: 9480101
              </p>
            </div>

            {/* Document Title */}
            <div className="my-8 text-center space-y-3">
              <h1 className="text-lg font-black uppercase text-slate-900 leading-snug">
                BÁO CÁO TIẾN ĐỘ & NỘI DUNG CHUYÊN ĐỀ TIẾN SĨ 01
              </h1>
              <p className="text-sm font-semibold text-slate-700 italic">
                “Nghiên cứu ứng dụng IoT và Trí tuệ nhân tạo trong quan trắc, dự báo chất lượng môi trường nước nông nghiệp thâm canh”
              </p>
            </div>

            {/* Meta Table */}
            <div className="my-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">Họ và tên NCS:</span>{" "}
                  <strong className="text-slate-900">{studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Mã số NCS:</span>{" "}
                  <strong className="text-slate-900">{studentCode}</strong>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">Khóa đào tạo:</span>{" "}
                  <strong className="text-slate-900">Khóa 2023 (Thời gian: 2023 - 2026)</strong>
                </div>
                <div>
                  <span className="text-slate-500">Người hướng dẫn chính:</span>{" "}
                  <strong className="text-slate-900">TS. Bùi Lê Tuấn Anh</strong>
                </div>
              </div>
            </div>

            {/* Section 1: Abstract / Content */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-800 text-justify">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#164E9B] border-b border-slate-100 pb-1">
                1. TỔNG QUAN TÌNH HÌNH NGHIÊN CỨU TRONG VÀ NGOÀI NƯỚC
              </h2>
              <p>
                Trong giai đoạn 06 tháng đầu năm học 2026, Nghiên cứu sinh đã hoàn thành việc khảo sát, thu thập trên 120 bài báo khoa học quốc tế thuộc danh mục ISI/Scopus (Q1, Q2) liên quan trực tiếp đến kiến trúc mạng cảm biến không dây IoT kết hợp thuật toán học sâu (Deep Neural Networks).
              </p>
              <p>
                Các kết quả nghiên cứu bước đầu cho thấy mô hình dự báo nồng độ oxy hòa tan (DO) và độ mặn dựa trên mạng hồi quy GRU (Gated Recurrent Unit) cho sai số MSE giảm 14.2% so với các phương pháp hồi quy truyền thống trên tập dữ liệu thử nghiệm tại vùng đồng bằng sông Cửu Long.
              </p>

              <h2 className="text-xs font-bold uppercase tracking-wider text-[#164E9B] border-b border-slate-100 pb-1 pt-2">
                2. SẢN PHẨM KHOA HỌC DỰ KIẾN VÀ KẾ HOẠCH TRIỂN KHAI MỐC TIẾP THEO
              </h2>
              <p>
                - Bản thảo bài báo khoa học số 01 đã hoàn thành 85% nội dung và đang gửi xin ý kiến phản biện nội bộ từ GVHD TS. Bùi Lê Tuấn Anh.
                <br />
                - Dự kiến nộp bài báo cho tạp chí chuyên ngành IEEE Access trước ngày 30/11/2026 để kịp mốc tiến độ thẩm định bài báo quốc tế (Mốc 8).
              </p>
            </div>

            {/* Signature Block */}
            <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <p className="font-bold text-slate-800">Ý KIẾN CỦA GIẢNG VIÊN HƯỚNG DẪN</p>
                <p className="italic text-[11px] text-slate-500 mt-0.5">Xác nhận ngày 15/10/2026</p>
                <div className="my-4 h-12 flex items-center justify-center">
                  <span className="rounded-md border border-emerald-500 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    ✓ ĐÃ XÁC NHẬN CHUYÊN MÔN
                  </span>
                </div>
                <p className="font-bold text-slate-900">TS. Bùi Lê Tuấn Anh</p>
              </div>

              <div>
                <p className="font-bold text-slate-800">NGHIÊN CỨU SINH BÁO CÁO</p>
                <p className="italic text-[11px] text-slate-500 mt-0.5">Ký điện tử ngày 14/10/2026</p>
                <div className="my-4 h-12 flex items-center justify-center">
                  <span className="rounded-md border border-blue-500 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                    ✓ ĐÃ KÝ SỐ CA (AGU-TOKEN)
                  </span>
                </div>
                <p className="font-bold text-slate-900">{studentName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tài liệu đã được lưu trữ an toàn tại máy chủ Văn bằng & Đào tạo Sau Đại học AGU.</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentPreviewModal;
