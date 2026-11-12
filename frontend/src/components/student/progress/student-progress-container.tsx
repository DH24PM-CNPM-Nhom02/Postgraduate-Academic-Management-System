"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Building2,
  Clock,
  GraduationCap,
  Layers,
  RefreshCw,
  User,
} from "lucide-react";
import type {
  MilestoneProgressItem,
  StudentProgressData,
} from "@/src/types/ui/progress";
import { mockProgressData } from "@/src/mocks/progress";
import { MilestoneTimeline } from "./milestone-timeline";
import { MilestoneCard } from "./milestone-card";

export interface StudentProgressContainerProps {
  initialData?: StudentProgressData;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onUpdateMilestone?: (updated: MilestoneProgressItem) => void;
}

function getDynamicStatusSummary(
  milestones: MilestoneProgressItem[],
  completedCount: number,
  totalCount: number
): { text: string; className: string } {
  const rejected = milestones.find((m) => m.trangThai === "REJECTED");
  if (rejected) {
    return {
      text: `Mốc ${rejected.thuTu} cần nộp lại`,
      className: "font-medium text-rose-600",
    };
  }

  const pending = milestones.find((m) => m.trangThai === "PENDING_REVIEW");
  if (pending) {
    return {
      text: `Mốc ${pending.thuTu} đang chờ duyệt`,
      className: "font-medium text-amber-700",
    };
  }

  const unlocked = milestones.find((m) => m.trangThai === "UNLOCKED");
  if (unlocked) {
    return {
      text: `Mốc ${unlocked.thuTu} sẵn sàng nộp`,
      className: "font-medium text-[#164E9B]",
    };
  }

  if (totalCount > 0 && completedCount === totalCount) {
    return {
      text: "Đã hoàn thành toàn bộ",
      className: "font-medium text-emerald-700",
    };
  }

  return {
    text: "Chưa có mốc sẵn sàng",
    className: "font-medium text-muted-foreground",
  };
}

function getActiveMilestoneOrder(
  milestones: MilestoneProgressItem[],
  fallbackOrder?: number
): number | undefined {
  const priorityMilestone =
    milestones.find((m) => m.trangThai === "REJECTED") ||
    milestones.find((m) => m.trangThai === "PENDING_REVIEW") ||
    milestones.find((m) => m.trangThai === "UNLOCKED");

  return priorityMilestone?.thuTu ?? fallbackOrder;
}

/**
 * Container Component cho Màn hình Theo dõi Tiến trình 9 mốc của Nghiên cứu sinh (NCS).
 * Nhận dữ liệu và trạng thái Loading / Error qua props, hỗ trợ cập nhật minh chứng cục bộ.
 */
export function StudentProgressContainer({
  initialData = mockProgressData,
  isLoading = false,
  error = null,
  onRetry,
  onUpdateMilestone,
}: StudentProgressContainerProps) {
  const [localUpdates, setLocalUpdates] = useState<
    Record<string, MilestoneProgressItem>
  >({});

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Đang tải tiến trình 9 mốc đào tạo"
        className="mx-auto max-w-7xl space-y-6 pb-12"
      >
        <div className="animate-pulse motion-reduce:animate-none space-y-6">
          <div className="h-36 rounded-xl border border-border bg-card" />
          <div className="h-44 rounded-xl border border-border bg-card" />
          <div className="h-56 rounded-xl border border-border bg-card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="mx-auto max-w-7xl rounded-xl border border-rose-200 bg-rose-50/70 p-6 text-rose-950"
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-rose-900">
                Không thể tải dữ liệu tiến trình đào tạo
              </h2>
              <p className="text-xs leading-relaxed text-rose-800">{error}</p>
            </div>
          </div>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-[#164E9B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Thử tải lại</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const milestones = initialData.milestones.map((m) => localUpdates[m.id] ?? m);
  const { ncs } = initialData;
  const tongSoMoc = milestones.length;
  const soMocHoanThanh = milestones.filter(
    (m) => m.trangThai === "PASSED"
  ).length;
  const progressPercent =
    tongSoMoc > 0 ? Math.round((soMocHoanThanh / tongSoMoc) * 100) : 0;

  const activeMilestoneOrder = getActiveMilestoneOrder(
    milestones,
    initialData.mocHienTai
  );
  const statusSummary = getDynamicStatusSummary(
    milestones,
    soMocHoanThanh,
    tongSoMoc
  );

  const handleUpdateMilestone = (updated: MilestoneProgressItem) => {
    setLocalUpdates((prev) => ({
      ...prev,
      [updated.id]: updated,
    }));
    onUpdateMilestone?.(updated);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12 sm:space-y-8">
      {/* 1. Header thông tin Nghiên cứu sinh */}
      <section
        aria-label="Thông tin hồ sơ Nghiên cứu sinh"
        className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-2xs sm:p-7"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Thông tin chính */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0F2744] text-white shadow-2xs">
              <GraduationCap className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {ncs.hoTen}
                </h1>
                <span className="rounded-md bg-muted px-2.5 py-0.5 font-mono text-xs font-semibold tracking-wider text-foreground">
                  {ncs.mshv}
                </span>
                {ncs.khoaHoc && (
                  <span className="rounded-full bg-[#164E9B]/10 px-2.5 py-0.5 text-xs font-semibold text-[#164E9B]">
                    NCS {ncs.khoaHoc}
                  </span>
                )}
              </div>

              <p className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                <span>
                  Lớp: <strong className="text-foreground">{ncs.lop}</strong>
                </span>
                <span className="text-border">•</span>
                <span>
                  Ngành:{" "}
                  <strong className="text-foreground">{ncs.nganh}</strong>
                </span>
                {ncs.chuyenNganh && (
                  <>
                    <span className="text-border">•</span>
                    <span>
                      Chuyên ngành:{" "}
                      <strong className="text-foreground">
                        {ncs.chuyenNganh}
                      </strong>
                    </span>
                  </>
                )}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>
                    GVHD chính:{" "}
                    <strong className="text-foreground">{ncs.gvhd}</strong>
                  </span>
                </div>
                {ncs.gvhdDongHuongDan && (
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      Đồng HD:{" "}
                      <strong className="text-foreground">
                        {ncs.gvhdDongHuongDan}
                      </strong>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{ncs.khoaVi}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-amber-700">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <span>
                    {ncs.soThangConLai !== undefined
                      ? `Thời hạn đào tạo tối đa: Còn ${ncs.soThangConLai} tháng (72 tháng)`
                      : "Thời hạn đào tạo tối đa: 72 tháng"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Tóm tắt tiến độ tổng quan (bề mặt tonal không lồng viền kép) */}
          <div className="shrink-0 space-y-2.5 rounded-xl bg-muted/55 p-4 lg:w-72">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <Layers className="h-3.5 w-3.5 text-[#164E9B]" />
                Tiến độ đào tạo
              </span>
              <span className="font-mono font-bold text-[#164E9B]">
                {progressPercent}%
              </span>
            </div>

            <div
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Tiến độ hoàn thành ${progressPercent}%`}
              className="flex h-2.5 w-full overflow-hidden rounded-full bg-border"
            >
              <div
                className="rounded-full bg-[#164E9B] transition-all duration-500 motion-reduce:transition-none"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-0.5 text-[11px] text-muted-foreground">
              <span>
                Hoàn thành{" "}
                <strong className="font-bold text-foreground">
                  {soMocHoanThanh}/{tongSoMoc} mốc
                </strong>
              </span>
              <span className={statusSummary.className}>
                {statusSummary.text}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Timeline tổng quan các mốc (Stepper ngang) */}
      <MilestoneTimeline
        milestones={milestones}
        activeMilestoneOrder={activeMilestoneOrder}
      />

      {/* 4. Danh sách chi tiết thẻ mốc */}
      <section aria-label="Chi tiết từng mốc đào tạo" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <h2 className="flex flex-wrap items-center gap-2 text-base font-bold tracking-tight text-foreground">
            <span>Chi tiết từng mốc tiến trình</span>
            <span className="text-xs font-normal text-muted-foreground">
              (Theo Quy chế Đào tạo Tiến sĩ hiện hành - BR-08)
            </span>
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {soMocHoanThanh}/{tongSoMoc} mốc hoàn thành
          </span>
        </div>

        {milestones.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm font-semibold text-foreground">
              Chưa có danh sách mốc đào tạo
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Hệ thống chưa ghi nhận lộ trình 9 mốc cho hồ sơ nghiên cứu sinh
              này. Vui lòng liên hệ Giáo vụ Sau đại học để kiểm tra.
            </p>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {milestones.map((m: MilestoneProgressItem) => (
              <MilestoneCard
                key={m.id}
                milestone={m}
                onUpdateMilestone={handleUpdateMilestone}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentProgressContainer;
