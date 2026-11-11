"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  FileText,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { PdfViewer } from "@/src/components/upload/PdfViewer";
import type { PhieuNhanXetItem } from "@/src/types/ui/progress";

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

  if (!yeuCauDiem) {
    return null;
  }

  const numericScore = diemTrungBinh ? Number(diemTrungBinh) : null;
  const isPassedScore = numericScore !== null && numericScore >= 7.0;

  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-[#164E9B]">
            <Award className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight text-[#0F2744] sm:text-sm">
              Kết quả đánh giá / Phiếu nhận xét (Mốc {thuTuMoc})
            </h4>
            <p className="text-xs text-muted-foreground">
              Biên bản và phiếu đánh giá chính thức của Hội đồng chuyên môn
            </p>
          </div>
        </div>

        {numericScore !== null ? (
          <div
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 font-mono ${
              isPassedScore
                ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                : "border-rose-300 bg-rose-50 text-rose-950"
            }`}
          >
            <div className="flex items-center gap-1.5">
              {isPassedScore ? (
                <CheckCircle2
                  className="size-4 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
              ) : (
                <AlertCircle
                  className="size-4 shrink-0 text-rose-600"
                  aria-hidden="true"
                />
              )}
              <span className="text-xs font-semibold text-foreground">
                Điểm trung bình:
              </span>
            </div>
            <span
              className={`text-sm font-bold tabular-nums sm:text-base ${
                isPassedScore ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {numericScore.toFixed(1)} / 10.0
            </span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${
                isPassedScore
                  ? "bg-emerald-200/70 text-emerald-900"
                  : "bg-rose-200/70 text-rose-900"
              }`}
            >
              {isPassedScore ? "ĐẠT (>= 7.0)" : "CHƯA ĐẠT (< 7.0)"}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            <span>Chờ Hội đồng chấm điểm</span>
          </div>
        )}
      </div>

      {phieuNhanXets.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                  <th scope="col" className="px-3 py-2.5 sm:px-4">
                    Thành viên Hội đồng / Người chấm
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-center">
                    Điểm số
                  </th>
                  <th scope="col" className="hidden px-3 py-2.5 sm:table-cell">
                    Thời gian chấm
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right sm:px-4">
                    Tệp đính kèm
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {phieuNhanXets.map((phieu, idx) => (
                  <tr
                    key={phieu.id || idx}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-3 py-2.5 sm:px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 font-mono text-xs font-bold text-[#164E9B]">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">
                            {phieu.tenNguoiCham}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {phieu.chucDanh}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-2.5 text-center">
                      <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-foreground sm:text-sm">
                        {phieu.diem.toFixed(1)}
                      </span>
                    </td>

                    <td className="hidden px-3 py-2.5 font-mono text-xs tabular-nums text-muted-foreground sm:table-cell">
                      {phieu.ngayDanhGia || "Đã nghiệm thu"}
                    </td>

                    <td className="px-3 py-2.5 text-right sm:px-4">
                      <button
                        type="button"
                        onClick={() => setSelectedPhieu(phieu)}
                        title={`Xem ${phieu.fileName || "Phiếu nhận xét"}`}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-1.5 text-xs font-semibold text-[#164E9B] transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
                      >
                        <FileText className="size-3.5" aria-hidden="true" />
                        <span>Xem phiếu (PDF)</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/25 px-3.5 py-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck
                className="size-3.5 text-[#164E9B]"
                aria-hidden="true"
              />
              <span>Chế độ xem tài liệu lưu trữ chính thức (Read-only)</span>
            </span>
            <span className="font-mono tabular-nums">
              Tổng số: {phieuNhanXets.length} phiếu đánh giá
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-3.5 text-xs text-muted-foreground">
          <UserCheck className="size-4 shrink-0" aria-hidden="true" />
          <span>
            Hội đồng chấm điểm mốc này đang trong quá trình tổng hợp và số hóa
            phiếu nhận xét.
          </span>
        </div>
      )}

      <PdfViewer
        isOpen={Boolean(selectedPhieu)}
        onClose={() => setSelectedPhieu(null)}
        fileUrl={
          selectedPhieu
            ? selectedPhieu.fileUrl ||
              `mock://phieu-nhan-xet/${encodeURIComponent(
                selectedPhieu.fileName || "phieu-nhan-xet.pdf"
              )}`
            : null
        }
        fileName={selectedPhieu?.fileName || "phieu-nhan-xet.pdf"}
        title={selectedPhieu?.fileName || "Phiếu nhận xét đánh giá"}
        subtitle={
          selectedPhieu
            ? `Người chấm: ${selectedPhieu.tenNguoiCham} (${selectedPhieu.chucDanh}) • Điểm: ${selectedPhieu.diem.toFixed(
                1
              )}/10.0`
            : undefined
        }
        allowDownload={true}
      />
    </div>
  );
}

export default EvaluationReviewsSection;
