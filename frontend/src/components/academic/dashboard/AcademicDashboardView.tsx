"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  FileCheck2,
  FileEdit,
  Gauge,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/src/hooks/use-auth";
import { useAcademicStudents, useAcademicSupervisors, useAcademicEvidences } from "@/src/hooks/use-academic";
import { useChangeRequests } from "@/src/hooks/use-change-requests";
import { HoverLogo } from "@/src/components/academic";

export function AcademicDashboardView() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { data: students = [], isLoading: loadingStudents, isError: studentsError } = useAcademicStudents();
  const { data: supervisors = [], isLoading: loadingSupervisors, isError: supervisorsError } = useAcademicSupervisors();
  const { data: evidences = [] } = useAcademicEvidences();
  const { data: pendingRequests } = useChangeRequests({ trangThai: "CHO_DUYET", page: 1, limit: 1 });
  const usedQuota = supervisors.reduce((total, item) => total + item.usedQuota, 0);
  const maxQuota = supervisors.reduce((total, item) => total + item.maxQuota, 0);

  // Xác định prefix route (/admin hoặc /academic) để chuyển hướng đúng phân hệ
  const prefix = pathname?.startsWith("/admin") ? "/admin" : "/academic";

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* DASHBOARD HERO SECTION */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 size-60 rounded-full bg-[#164E9B]/5 blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#164E9B] border border-blue-200">
                <HoverLogo sizeClass="size-4" />
                Cổng Sau Đại Học AGU
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
                Cổng quản lý học vụ
              </span>
              <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold">
                [Hệ thống học vụ trực tuyến]
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F2744] tracking-tight">
              Quản trị Học vụ Sau Đại học
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Theo dõi tiến độ 9 mốc tiến sĩ, thẩm định minh chứng học vụ trực tuyến, quản lý định mức hướng dẫn và xét duyệt hồ sơ đề tài theo quy chế Đào tạo Sau Đại học AGU &amp; ĐHQG-HCM.
            </p>

            {/* Quick Action Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">Chuyển nhanh:</span>
              <Link
                href={`${prefix}/students`}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-[#164E9B]/10 hover:text-[#164E9B] transition-colors cursor-pointer"
              >
                Quản lý NCS toàn trường
              </Link>
              <Link
                href={`${prefix}/theses`}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-[#164E9B]/10 hover:text-[#164E9B] transition-colors cursor-pointer"
              >
                Quản lý đề tài luận án
              </Link>
              <Link
                href={`${prefix}/supervisors`}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-[#164E9B]/10 hover:text-[#164E9B] transition-colors cursor-pointer"
              >
                Hạn ngạch GVHD (BR-09)
              </Link>
              <Link
                href={`${prefix}/milestone-review`}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-[#164E9B]/10 hover:text-[#164E9B] transition-colors cursor-pointer"
              >
                Hàng chờ duyệt 9 mốc
              </Link>
              <Link
                href={`${prefix}/evidence`}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-[#164E9B]/10 hover:text-[#164E9B] transition-colors cursor-pointer"
              >
                Thẩm định bài báo WoS/Scopus
              </Link>
              <Link
                href={`${prefix}/topic-changes`}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-[#164E9B]/10 hover:text-[#164E9B] transition-colors cursor-pointer"
              >
                Duyệt đề nghị điều chỉnh
              </Link>
            </div>
          </div>

          {/* Academic Staff Profile Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3 min-w-[280px]">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#164E9B] text-white font-black text-sm shadow-xs">
                {user?.fullName?.trim().charAt(0) || "—"}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{user?.fullName || "Chưa cập nhật"}</h3>
                <p className="text-xs text-slate-500">Tài khoản giáo vụ</p>
                <span className="inline-block rounded-sm bg-blue-100 px-1.5 py-0.2 text-[10px] font-semibold text-[#164E9B] mt-0.5">
                  Cán bộ Quản lý &amp; Giáo vụ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <Link
          href={`${prefix}/students`}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#164E9B]/60 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#164E9B]">
                NCS ĐANG QUẢN LÝ
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-[#164E9B] group-hover:bg-[#164E9B] group-hover:text-white transition-colors">
                <Users className="size-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F2744]">{loadingStudents || studentsError ? "—" : students.length}</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              Danh sách nghiên cứu sinh đang được quản lý trong hệ thống.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#164E9B]">
            <span>Mở Bảng Nghiên cứu sinh</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Evidences */}
        <Link
          href={`${prefix}/evidence`}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-amber-800">
                CHỜ DUYỆT MINH CHỨNG
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <FileCheck2 className="size-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F2744]">{evidences.length}</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              Báo cáo chuyên đề 1, 2 và chứng chỉ ngoại ngữ quốc tế cần phê duyệt.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-amber-800">
            <span>Mở Bảng Minh chứng</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: Topic Changes */}
        <Link
          href={`${prefix}/topic-changes`}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-rose-700">
                ĐỀ NGHỊ ĐIỀU CHỈNH CHỜ DUYỆT
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <FileEdit className="size-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F2744]">{pendingRequests?.total ?? "—"}</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              Đề nghị đổi đề tài, đổi GVHD và gia hạn học tập.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-rose-700">
            <span>Mở danh sách đề nghị</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 4: Quota */}
        <Link
          href={`${prefix}/supervisors`}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-800">
                HẠN NGẠCH GVHD (BR-09)
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Gauge className="size-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F2744]">{loadingSupervisors || supervisorsError ? "—" : usedQuota.toFixed(1)}</span>
              <span className="text-xs text-slate-500">/ {loadingSupervisors || supervisorsError ? "—" : maxQuota.toFixed(1)} chỉ tiêu</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              Tổng định mức đã sử dụng và hạn ngạch của các giảng viên trong hệ thống.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-emerald-800">
            <span>Mở Bảng Hạn ngạch GVHD</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AcademicDashboardView;
