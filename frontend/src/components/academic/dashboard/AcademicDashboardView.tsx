"use client";

import React, { useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Users,
  FileCheck2,
  FileEdit,
  Gauge,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";
import { HoverLogo } from "@/src/components/academic";
import { StudentsManagementView } from "@/src/components/academic/students/StudentsManagementView";
import { SupervisorsManagementView } from "@/src/components/academic/supervisors/SupervisorsManagementView";
import { EvidenceManagementView } from "@/src/components/academic/evidence/EvidenceManagementView";
import { TopicChangesManagementView } from "@/src/components/academic/topic-changes/TopicChangesManagementView";
import type { AcademicTabKey } from "@/src/types/academic";

interface TabItemDef {
  key: AcademicTabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

const DASHBOARD_TABS: TabItemDef[] = [
  {
    key: "dashboard",
    label: "Tổng quan",
    icon: LayoutDashboard,
  },
  {
    key: "students",
    label: "Bảng Nghiên cứu sinh",
    icon: Users,
    badge: 18,
    badgeColor: "bg-blue-100 text-[#164E9B]",
  },
  {
    key: "supervisors",
    label: "Bảng GVHD & Hạn ngạch",
    icon: Gauge,
    badge: "2.5/3",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    key: "evidence",
    label: "Bảng Thẩm định minh chứng",
    icon: FileCheck2,
    badge: 5,
    badgeColor: "bg-amber-100 text-amber-800",
  },
  {
    key: "topic-changes",
    label: "Bảng Duyệt đổi đề tài",
    icon: FileEdit,
    badge: 2,
    badgeColor: "bg-rose-500 text-white",
  },
];

/** Component Overview tĩnh chỉ render khi ở Tab Dashboard */
function DashboardOverviewSection({
  onSelectTab,
}: {
  onSelectTab: (tab: AcademicTabKey) => void;
}) {
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
                Học kỳ I / 2026 - 2027 • Tuần 08
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
              <button
                onClick={() => onSelectTab("students")}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-[#164E9B]/10 hover:text-[#164E9B] transition-colors cursor-pointer"
              >
                Quản lý NCS toàn trường
              </button>
              <button
                onClick={() => onSelectTab("supervisors")}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-[#164E9B]/10 hover:text-[#164E9B] transition-colors cursor-pointer"
              >
                Hạn ngạch GVHD (BR-09)
              </button>
              <button
                onClick={() => onSelectTab("evidence")}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-[#164E9B]/10 hover:text-[#164E9B] transition-colors cursor-pointer"
              >
                Thẩm định bài báo WoS/Scopus
              </button>
              <button
                onClick={() => onSelectTab("topic-changes")}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-[#164E9B]/10 hover:text-[#164E9B] transition-colors cursor-pointer"
              >
                Duyệt đổi đề tài
              </button>
            </div>
          </div>

          {/* Academic Staff Profile Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3 min-w-[280px]">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#164E9B] text-white font-black text-sm shadow-xs">
                TA
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">TS. Bùi Lê Tuấn Anh</h3>
                <p className="text-xs text-slate-500">Khoa Công nghệ Thông tin</p>
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
        <div
          onClick={() => onSelectTab("students")}
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
              <span className="text-3xl font-black text-[#0F2744]">18</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                88.9% đúng hạn
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              4 NCS hướng dẫn trực tiếp và 14 NCS thuộc chuyên ngành phụ trách học vụ.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#164E9B]">
            <span>Mở Bảng Nghiên cứu sinh</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Evidences */}
        <div
          onClick={() => onSelectTab("evidence")}
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
              <span className="text-3xl font-black text-[#0F2744]">5</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                3 hồ sơ mới
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              Báo cáo chuyên đề 1, 2 và chứng chỉ ngoại ngữ quốc tế cần phê duyệt.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-amber-800">
            <span>Mở Bảng Minh chứng</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Topic Changes */}
        <div
          onClick={() => onSelectTab("topic-changes")}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-rose-700">
                ĐỀ NGHỊ ĐỔI ĐỀ TÀI
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <FileEdit className="size-4.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F2744]">2</span>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                Đã có ý kiến GVHD
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              Hồ sơ đề nghị điều chỉnh tên đề tài luận án tiến sĩ từ NCS Khóa 2023.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-rose-700">
            <span>Mở Bảng Đổi đề tài</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Quota */}
        <div
          onClick={() => onSelectTab("supervisors")}
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
              <span className="text-3xl font-black text-[#0F2744]">2.5</span>
              <span className="text-xs text-slate-500">/ 3.0 chỉ tiêu</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">
              1 NCS hướng dẫn độc lập và 3 NCS đồng hướng dẫn (còn 0.5 chỉ tiêu).
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-emerald-800">
            <span>Mở Bảng Hạn ngạch GVHD</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AcademicDashboardView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  // Single Source of Truth: Tab lấy trực tiếp từ URL query `tab` (fallback "dashboard")
  const activeTab = (searchParams.get("tab") as AcademicTabKey) || "dashboard";

  // Chuyển tab động: Cập nhật URL mà không cần cascading state
  const handleTabChange = (newTab: AcademicTabKey) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (newTab === "dashboard") {
        params.delete("tab");
      } else {
        params.set("tab", newTab);
      }
      const newQuery = params.toString();
      router.push(newQuery ? `${pathname}?${newQuery}` : pathname);
    });
  };

  return (
    <div className="space-y-6">
      {/* DYNAMIC TAB BAR: Cho phép chuyển đổi linh hoạt giữa các bảng */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {DASHBOARD_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#164E9B] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              <Icon className={`size-4 ${isActive ? "text-white" : "text-slate-500"}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.2 text-[10px] font-black ${
                    isActive ? "bg-white/20 text-white" : tab.badgeColor || "bg-slate-100 text-slate-700"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CONDITIONAL DYNAMIC RENDERING:
          Chỉ render bảng tương ứng, UNMOUNT toàn bộ các bảng khác để giải phóng DOM, RAM và tránh gọi API ngầm */}
      <div className="transition-all duration-150">
        {activeTab === "dashboard" && (
          <DashboardOverviewSection onSelectTab={handleTabChange} />
        )}

        {activeTab === "students" && (
          <StudentsManagementView embedded />
        )}

        {activeTab === "supervisors" && (
          <SupervisorsManagementView embedded />
        )}

        {activeTab === "evidence" && (
          <EvidenceManagementView embedded />
        )}

        {activeTab === "topic-changes" && (
          <TopicChangesManagementView embedded />
        )}
      </div>
    </div>
  );
}
