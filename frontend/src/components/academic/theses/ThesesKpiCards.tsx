"use client";

import React, { useMemo } from "react";
import { Users, CheckCircle2, AlertTriangle, History } from "lucide-react";
import type { AcademicThesisNcsItem } from "@/src/types/api/thesis";

export interface ThesesKpiCardsProps {
  /**
   * Danh sách NCS để tự động tính toán các chỉ số thống kê
   */
  items?: AcademicThesisNcsItem[];
  /**
   * Số lượng tổng NCS (nếu muốn truyền trực tiếp từ phân trang server)
   */
  totalNcs?: number;
  /**
   * Số lượng đề tài đang hiệu lực
   */
  hieuLucCount?: number;
  /**
   * Số lượng NCS chưa được giao đề tài
   */
  chuaGiaoCount?: number;
  /**
   * Số lượng đề tài trong lịch sử đã thay thế hoặc đã hủy
   */
  historyCount?: number;
  /**
   * Cờ trạng thái đang tải dữ liệu
   */
  isLoading?: boolean;
  className?: string;
}

export function ThesesKpiCards({
  items = [],
  totalNcs,
  hieuLucCount,
  chuaGiaoCount,
  historyCount,
  isLoading = false,
  className = "",
}: ThesesKpiCardsProps) {
  // Tính toán các chỉ số thống kê
  const stats = useMemo(() => {
    const total = totalNcs !== undefined ? totalNcs : items.length;

    const hieuLuc =
      hieuLucCount !== undefined
        ? hieuLucCount
        : items.filter((item) => item.trangThaiDeTai === "HIEU_LUC").length;

    const chuaGiao =
      chuaGiaoCount !== undefined
        ? chuaGiaoCount
        : items.filter((item) => item.trangThaiDeTai === "CHUA_GIAO").length;

    const history =
      historyCount !== undefined
        ? historyCount
        : items.reduce((acc, item) => {
            const hist =
              item.deTais?.filter(
                (t) => t.trangThai === "DA_THAY_THE" || t.trangThai === "DA_HUY"
              ).length ?? 0;
            return acc + hist;
          }, 0);

    const completionRate =
      total > 0 ? Math.round((hieuLuc / total) * 100) : 0;

    return {
      total,
      hieuLuc,
      chuaGiao,
      history,
      completionRate,
    };
  }, [items, totalNcs, hieuLucCount, chuaGiaoCount, historyCount]);

  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
      >
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs animate-pulse space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-slate-200 rounded" />
              <div className="size-8 bg-slate-200 rounded-lg" />
            </div>
            <div className="h-7 w-20 bg-slate-200 rounded" />
            <div className="h-3 w-36 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      {/* 1. TỔNG SỐ NCS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Tổng số NCS
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-[#164E9B]">
            <Users className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#0F2744]">
            {stats.total}
          </span>
          <span className="text-xs font-medium text-slate-500">
            nghiên cứu sinh
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Theo danh sách điều kiện hiện tại
        </p>
      </div>

      {/* 2. ĐÃ CÓ ĐỀ TÀI CHÍNH THỨC */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4.5 shadow-xs hover:border-emerald-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Đã có đề tài chính thức
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-700">
            {stats.hieuLuc}
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
            {stats.completionRate}% hoàn thành
          </span>
        </div>
        <p className="text-[11px] text-emerald-700/80 mt-1">
          Đề tài có quyết định hiệu lực pháp lý
        </p>
      </div>

      {/* 3. CHƯA ĐƯỢC GIAO ĐỀ TÀI */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4.5 shadow-xs hover:border-amber-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Chưa được giao đề tài
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <AlertTriangle className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-700">
            {stats.chuaGiao}
          </span>
          {stats.chuaGiao > 0 ? (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 animate-pulse">
              Cần xử lý giao đề tài
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              Đã giao toàn bộ
            </span>
          )}
        </div>
        <p className="text-[11px] text-amber-700/80 mt-1">
          Chưa được ban hành quyết định đề tài
        </p>
      </div>

      {/* 4. LỊCH SỬ ĐIỀU CHỈNH ĐỀ TÀI */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-4.5 shadow-xs hover:border-indigo-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">
            Lịch sử điều chỉnh đề tài
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <History className="size-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-indigo-700">
            {stats.history}
          </span>
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
            Đã thay thế / Hủy
          </span>
        </div>
        <p className="text-[11px] text-indigo-700/80 mt-1">
          Lịch sử các phiên bản đề tài cũ
        </p>
      </div>
    </div>
  );
}

export default ThesesKpiCards;
