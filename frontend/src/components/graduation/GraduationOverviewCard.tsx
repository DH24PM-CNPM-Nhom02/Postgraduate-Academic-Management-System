"use client";

import React from "react";
import { AlertTriangle, Award, CalendarCheck2, CheckCircle2 } from "lucide-react";
import type { GraduationOverviewCardProps } from "@/src/types/ui/graduation";

function formatDateTimeVi(iso?: string): string {
  if (!iso) return "--/--/----";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${hh}:${mm} ${day}/${month}/${year}`;
}

/**
 * GraduationOverviewCard
 *
 * Banner tổng quan tình trạng đạt 6 điều kiện xét tốt nghiệp cá nhân của NCS,
 * kèm thanh tiến độ và nhận xét tổng hợp từ Phòng ĐT-SĐH.
 */
export function GraduationOverviewCard({
  overview,
  className = "",
}: GraduationOverviewCardProps) {
  const total = Math.max(overview.tongDieuKien, 1);
  const ratio = Math.min(100, Math.round((overview.daDatCount / total) * 100));
  const isEligible = overview.duDieuKien && overview.daDatCount >= overview.tongDieuKien;

  return (
    <section
      aria-label="Tổng quan điều kiện xét tốt nghiệp"
      className={`rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs ${className}`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-xl border ${
              isEligible
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {isEligible ? (
              <Award className="size-6" aria-hidden="true" />
            ) : (
              <AlertTriangle className="size-6" aria-hidden="true" />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-lg font-bold tracking-tight text-[#0F2744] sm:text-xl">
                {isEligible
                  ? "Đủ điều kiện trình xét tốt nghiệp Tiến sĩ"
                  : "Chưa đủ điều kiện xét tốt nghiệp"}
              </h2>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-semibold ${
                  isEligible
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                {isEligible ? (
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="size-3.5" aria-hidden="true" />
                )}
                <span>
                  {isEligible ? "Sẵn sàng xét duyệt" : "Cần hoàn thiện điều kiện"}
                </span>
              </span>
            </div>

            <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {overview.ghiChuHoiDong}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarCheck2
                  className="size-3.5 text-[#164E9B]"
                  aria-hidden="true"
                />
                <span>
                  Kiểm tra lần cuối:{" "}
                  <strong className="font-mono tabular-nums text-foreground">
                    {formatDateTimeVi(overview.ngayKiemTraGanNhat)}
                  </strong>
                </span>
              </span>
              <span>
                Chuyên ngành:{" "}
                <strong className="text-foreground">{overview.chuyenNganh}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Khối tiến độ 6 điều kiện (flat tonal fill, không nested card) */}
        <div className="w-full shrink-0 rounded-xl bg-muted/45 p-4 lg:w-72 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              Tỷ lệ đáp ứng điều kiện
            </span>
            <span className="font-mono text-sm font-bold tabular-nums text-[#0F2744]">
              {overview.daDatCount}/{overview.tongDieuKien} ({ratio}%)
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={ratio}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Tiến độ hoàn thành 6 điều kiện xét tốt nghiệp"
            className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isEligible ? "bg-emerald-600" : "bg-[#164E9B]"
              }`}
              style={{ width: `${ratio}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {isEligible
              ? "Đã hoàn tất 6/6 tiêu chí theo Quy chế Đào tạo Tiến sĩ."
              : `Còn ${Math.max(
                  0,
                  overview.tongDieuKien - overview.daDatCount
                )} điều kiện cần xử lý bổ sung.`}
          </p>
        </div>
      </div>
    </section>
  );
}

export default GraduationOverviewCard;
