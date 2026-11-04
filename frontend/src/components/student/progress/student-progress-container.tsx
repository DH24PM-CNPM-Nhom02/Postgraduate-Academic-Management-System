"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  User,
  Clock,
  Layers,
  Building2,
} from "lucide-react";

import {
  StudentProgressData,
  MilestoneProgressItem,
} from "@/src/types/progress";
import { MilestoneTimeline } from "./milestone-timeline";
import { MilestoneCard } from "./milestone-card";
import { mockProgressData } from "./mock-data";

export interface StudentProgressContainerProps {
  initialData?: StudentProgressData;
}

/**
 * Container Component cho Màn hình Theo dõi Tiến trình 9 mốc của Nghiên cứu sinh (NCS).
 * Chịu trách nhiệm quản lý state, tính toán tiến độ tổng quan và render các khối giao diện nghiệp vụ.
 */
export function StudentProgressContainer({
  initialData = mockProgressData,
}: StudentProgressContainerProps) {
  const [data] = useState<StudentProgressData>(initialData);
  const { ncs, milestones, soMocHoanThanh, tongSoMoc } = data;
  const progressPercent = Math.round((soMocHoanThanh / tongSoMoc) * 100);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-7xl mx-auto">
      {/* 1. Header thông tin Nghiên cứu sinh */}
      <section
        aria-label="Thông tin hồ sơ Nghiên cứu sinh"
        className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Thông tin chính */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-sm shadow-emerald-900/10 shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {ncs.hoTen}
                </h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold tracking-wider">
                  {ncs.mshv}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-semibold">
                  NCS Khóa 32
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-2 flex-wrap">
                <span>
                  Lớp: <strong className="text-slate-900">{ncs.lop}</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span>
                  Ngành: <strong className="text-slate-900">{ncs.nganh}</strong>
                </span>
                {ncs.chuyenNganh && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>
                      Chuyên ngành:{" "}
                      <strong className="text-slate-900">
                        {ncs.chuyenNganh}
                      </strong>
                    </span>
                  </>
                )}
              </p>

              <div className="pt-2 flex items-center gap-x-5 gap-y-2 flex-wrap text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    GVHD chính:{" "}
                    <strong className="text-slate-700">{ncs.gvhd}</strong>
                  </span>
                </div>
                {ncs.gvhdDongHuongDan && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Đồng HD:{" "}
                      <strong className="text-slate-700">
                        {ncs.gvhdDongHuongDan}
                      </strong>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ncs.khoaVi}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    Thời hạn đào tạo tối đa: Còn {ncs.soThangConLai} tháng (72
                    tháng)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Thanh tóm tắt tiến độ tổng quan */}
          <div className="lg:w-72 rounded-xl bg-slate-50 border border-slate-200/80 p-4 shrink-0 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Tiến độ đào tạo
              </span>
              <span className="font-bold text-slate-900 font-mono">
                {progressPercent}%
              </span>
            </div>

            {/* Thanh tiến độ trang nhã */}
            <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-600 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>
                Hoàn thành{" "}
                <strong className="text-emerald-700 font-bold">
                  {soMocHoanThanh}/{tongSoMoc} mốc
                </strong>
              </span>
              <span className="text-rose-600 font-medium">
                Mốc 3 đang chờ nộp lại
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Timeline tổng quan 9 mốc (Stepper ngang) */}
      <section aria-label="Lộ trình 9 mốc">
        <MilestoneTimeline
          milestones={milestones}
          activeMilestoneOrder={data.mocHienTai}
        />
      </section>

      {/* 4. Danh sách chi tiết 9 thẻ mốc (MilestoneCard) */}
      <section aria-label="Chi tiết từng mốc đào tạo" className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Chi tiết từng mốc tiến trình</span>
            <span className="text-xs font-normal text-slate-500">
              (Theo Quy chế Đào tạo Tiến sĩ hiện hành - BR-08)
            </span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            9/9 mốc đào tạo
          </span>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {milestones.map((m: MilestoneProgressItem) => (
            <MilestoneCard key={m.id} milestone={m} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default StudentProgressContainer;
