"use client";

import React from "react";
import {
  UserCheck,
  Award,
  Users,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Phone,
  Building2,
  Sparkles,
} from "lucide-react";
import { SupervisorProfile, SupervisorStudentItem } from "@/src/lib/mockData";

interface SupervisorStatsBannerProps {
  profile: SupervisorProfile;
  students: SupervisorStudentItem[];
}

export function SupervisorStatsBanner({
  profile,
  students,
}: SupervisorStatsBannerProps) {
  const { quota } = profile;

  // Thống kê nhanh
  const totalStudents = students.length;
  const errorCount = students.filter((s) => s.hasRejectedMilestone).length;
  const goodCount = students.filter(
    (s) => s.trangThaiChung === "GOOD" || s.trangThaiChung === "NORMAL"
  ).length;

  return (
    <section
      aria-label="Thông tin Giảng viên Hướng dẫn & Hạn ngạch"
      className="relative rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden"
    >
      {/* Accent gradient strip top */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#164E9B] via-indigo-600 to-emerald-500" />

      <div className="p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Cột 1: Thông tin Profile Giảng viên Hướng dẫn */}
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-[#164E9B] to-indigo-700 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-900/15 shrink-0">
              <UserCheck className="size-8" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {profile.hoTen}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                  <Award className="size-3 text-indigo-600" />
                  {profile.hocHamHocVi}
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                  {profile.maCanBo}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-slate-400" />
                  <span>{profile.donVi}</span>
                </span>
              </p>

              <div className="flex items-center gap-x-4 gap-y-1.5 flex-wrap text-xs text-slate-500 pt-1">
                <span className="font-medium text-slate-700">
                  Lĩnh vực: <strong>{profile.chuyenMon}</strong>
                </span>
                <span className="text-slate-300">•</span>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1 hover:text-[#164E9B] transition-colors"
                >
                  <Mail className="size-3.5 text-slate-400" />
                  <span>{profile.email}</span>
                </a>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <Phone className="size-3.5 text-slate-400" />
                  <span>{profile.soDienThoai}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Cột 2: Bảng Quota Hướng dẫn (Định mức & Slot) */}
          <div className="lg:w-80 rounded-xl bg-slate-50 border border-slate-200/90 p-4 shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="size-3.5 text-[#164E9B]" />
                Hạn ngạch hướng dẫn
              </span>
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Còn trống {quota.slotConLaiChinh} slot
              </span>
            </div>

            {/* Quota Chính: Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">
                  HD chính:{" "}
                  <strong className="text-slate-900 font-bold">
                    {quota.dangHuongDanChinh} / {quota.toiDaChinh} NCS
                  </strong>
                </span>
                <span className="font-mono font-bold text-[#164E9B]">
                  {quota.tyLeSuDungChinh}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#164E9B] rounded-full transition-all duration-500"
                  style={{ width: `${quota.tyLeSuDungChinh}%` }}
                />
              </div>
            </div>

            {/* Quota Đồng HD & Quick note */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
              <span>
                Đồng hướng dẫn:{" "}
                <strong className="text-slate-700">
                  {quota.dangHuongDanPhu} / {quota.toiDaPhu} NCS
                </strong>
              </span>
              <span className="text-[10px] text-slate-400">
                Quy chế ĐHQG-HCM
              </span>
            </div>
          </div>
        </div>

        {/* Dòng 3 chỉ số tóm tắt nhanh (Quick Metric Pills) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="size-9 rounded-lg bg-blue-100 text-[#164E9B] flex items-center justify-center shrink-0">
              <Users className="size-4.5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Tổng số NCS phụ trách
              </p>
              <p className="text-lg font-bold text-slate-900 leading-tight">
                {totalStudents} Nghiên cứu sinh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50/70 border border-rose-100">
            <div className="size-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="size-4.5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
                Mốc tiến độ cần xử lý
              </p>
              <p className="text-lg font-bold text-rose-900 leading-tight">
                {errorCount} NCS có mốc cần hoàn thiện
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <div className="size-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-4.5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                Đúng tiến độ đào tạo
              </p>
              <p className="text-lg font-bold text-emerald-900 leading-tight">
                {goodCount} NCS hoàn thành tốt
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SupervisorStatsBanner;
