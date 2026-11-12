"use client";

import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  XCircle,
} from "lucide-react";
import type { GraduationConditionsProps } from "@/src/types/ui/graduation";

/**
 * GraduationConditions
 *
 * Hiển thị lưới 6 thẻ điều kiện xét tốt nghiệp cá nhân của NCS.
 * Mỗi thẻ trình bày trạng thái Đạt / Chưa đạt, giá trị thực tế,
 * ghi chú hướng dẫn và nút xem PDF chứng chỉ/xác nhận (nếu có).
 */
export function GraduationConditions({
  conditions,
  onPreviewDocument,
  className = "",
}: GraduationConditionsProps) {
  return (
    <section
      aria-label="Danh sách 6 điều kiện xét tốt nghiệp"
      className={`space-y-4 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-[#0F2744] sm:text-lg">
          Chi tiết 6 điều kiện xét công nhận trình độ Tiến sĩ
        </h2>
        <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
          {conditions.length} tiêu chí bắt buộc
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {conditions.map((cond) => {
          const isPassed = cond.dat;
          const isWarning = !isPassed && cond.mucDo === "warning";

          const visual = isPassed
            ? {
                cardBorder: "border-border hover:border-emerald-300",
                iconWrap:
                  "border-emerald-200 bg-emerald-50 text-emerald-700",
                badgeClass:
                  "border-emerald-200 bg-emerald-50 text-emerald-800",
                badgeLabel: "Đạt chuẩn",
                valueWrap: "bg-emerald-50/55 text-emerald-950",
                Icon: CheckCircle2,
              }
            : isWarning
            ? {
                cardBorder: "border-amber-300 hover:border-amber-400",
                iconWrap: "border-amber-200 bg-amber-50 text-amber-700",
                badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
                badgeLabel: "Đang chờ xử lý",
                valueWrap: "bg-amber-50/65 text-amber-950",
                Icon: AlertTriangle,
              }
            : {
                cardBorder: "border-rose-300 hover:border-rose-400",
                iconWrap: "border-rose-200 bg-rose-50 text-rose-600",
                badgeClass: "border-rose-200 bg-rose-50 text-rose-800",
                badgeLabel: "Chưa đạt",
                valueWrap: "bg-rose-50/65 text-rose-950",
                Icon: XCircle,
              };

          const StatusIcon = visual.Icon;

          return (
            <article
              key={cond.maDieuKien}
              className={`flex flex-col justify-between rounded-2xl border bg-card p-5 text-card-foreground shadow-2xs transition-colors ${visual.cardBorder}`}
            >
              <div className="space-y-3.5">
                {/* Hàng trạng thái trên cùng */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${visual.iconWrap}`}
                    >
                      <StatusIcon className="size-4.5" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground">
                      Điều kiện 0{cond.thuTu}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${visual.badgeClass}`}
                  >
                    <StatusIcon className="size-3.5" aria-hidden="true" />
                    <span>{visual.badgeLabel}</span>
                  </span>
                </div>

                {/* Tên điều kiện & Yêu cầu quy chế */}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold leading-snug text-[#0F2744] sm:text-base">
                    {cond.tenHienThi}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {cond.moTaYeuCau}
                  </p>
                </div>

                {/* Giá trị thực tế (nền nhẹ, không dùng nested border) */}
                <div className={`rounded-xl px-3.5 py-2.5 space-y-1 ${visual.valueWrap}`}>
                  <p className="text-[11px] font-medium opacity-80">
                    Kết quả ghi nhận hiện tại
                  </p>
                  <p className="text-xs font-bold leading-snug sm:text-sm">
                    {cond.giaTriThucTe}
                  </p>
                </div>

                {/* Ghi chú / Hướng dẫn khắc phục */}
                {cond.ghiChu && (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {cond.ghiChu}
                  </p>
                )}
              </div>

              {/* Thanh tác vụ (nếu có tài liệu PDF hoặc đường dẫn xử lý) */}
              {(cond.taiLieuChungMinh || (cond.actionHref && cond.actionLabel)) && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3.5">
                  {cond.taiLieuChungMinh && onPreviewDocument && (
                    <button
                      type="button"
                      onClick={() =>
                        onPreviewDocument(cond.taiLieuChungMinh!, cond.tenHienThi)
                      }
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-[#164E9B] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
                    >
                      <FileText className="size-3.5" aria-hidden="true" />
                      <span>Xem minh chứng PDF</span>
                    </button>
                  )}

                  {cond.actionHref && cond.actionLabel && (
                    <Link
                      href={cond.actionHref}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#164E9B] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
                    >
                      <span>{cond.actionLabel}</span>
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default GraduationConditions;
