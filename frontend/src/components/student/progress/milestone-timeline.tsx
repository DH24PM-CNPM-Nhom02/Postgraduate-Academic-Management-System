"use client";

import React, { useRef } from "react";
import {
  Check,
  Lock,
  Unlock,
  Clock,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { MilestoneProgressItem } from "@/src/types/progress";

interface MilestoneTimelineProps {
  milestones: MilestoneProgressItem[];
  activeMilestoneOrder?: number;
}

export function MilestoneTimeline({
  milestones,
  activeMilestoneOrder,
}: MilestoneTimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Cuộn mượt đến thẻ mốc khi click hoặc ấn Enter
  const handleStepClick = (thuTu: number) => {
    const el = document.getElementById(`milestone-card-${thuTu}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, thuTu: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleStepClick(thuTu);
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Icon và style cho từng trạng thái
  const getStepVisuals = (milestone: MilestoneProgressItem) => {
    const status = milestone.trangThai;

    switch (status) {
      case "PASSED":
        return {
          icon: <Check className="w-4 h-4 stroke-[2.5]" />,
          circleClasses:
            "bg-emerald-600 text-white border-emerald-600 shadow-2xs hover:bg-emerald-700",
          textClasses: "text-emerald-950 font-semibold",
          badgeText: "Hoàn thành",
          badgeClasses: "bg-emerald-50 text-emerald-700 border-emerald-200",
          isPulsing: false,
        };
      case "REJECTED":
        return {
          icon: <AlertCircle className="w-4 h-4 stroke-[2.5]" />,
          circleClasses:
            "bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-500/20 hover:bg-rose-700 ring-4 ring-rose-500/20",
          textClasses: "text-rose-950 font-bold",
          badgeText: "Cần nộp lại",
          badgeClasses: "bg-rose-50 text-rose-700 border-rose-200",
          isPulsing: true,
        };
      case "PENDING_REVIEW":
        return {
          icon: <Clock className="w-4 h-4 stroke-[2.5]" />,
          circleClasses:
            "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20 hover:bg-amber-600 ring-4 ring-amber-500/20",
          textClasses: "text-amber-950 font-bold",
          badgeText: "Chờ duyệt",
          badgeClasses: "bg-amber-50 text-amber-700 border-amber-200",
          isPulsing: true,
        };
      case "UNLOCKED":
        return {
          icon: <Unlock className="w-4 h-4 stroke-[2.5]" />,
          circleClasses:
            "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20 hover:bg-blue-700 ring-4 ring-blue-500/20",
          textClasses: "text-blue-950 font-bold",
          badgeText: "Sẵn sàng",
          badgeClasses: "bg-blue-50 text-blue-700 border-blue-200",
          isPulsing: true,
        };
      case "LOCKED":
      default:
        return {
          icon: <Lock className="w-3.5 h-3.5" />,
          circleClasses:
            "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200/80 hover:text-slate-600",
          textClasses: "text-slate-500 font-medium",
          badgeText: "Khóa",
          badgeClasses: "bg-slate-100 text-slate-500 border-slate-200",
          isPulsing: false,
        };
    }
  };

  return (
    <div className="relative rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs">
      {/* Tiêu đề Stepper và nút cuộn nhanh */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Tiến trình 9 mốc đào tạo NCS</span>
            <span className="text-[11px] font-normal text-slate-400">
              (Nhấn hoặc Tab + Enter để cuộn đến mốc tương ứng)
            </span>
          </h2>
        </div>

        {/* Nút điều hướng cuộn ngang trên màn hình nhỏ/trung */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Cuộn stepper sang trái"
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Cuộn stepper sang phải"
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Container cuộn ngang stepper */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-slate-200"
      >
        <div className="min-w-[880px] flex items-start justify-between relative">
          {milestones.map((m, index) => {
            const visual = getStepVisuals(m);
            const isLast = index === milestones.length - 1;
            const isLineActive = m.trangThai === "PASSED";
            const isCurrentActive = activeMilestoneOrder === m.thuTu;

            return (
              <div
                key={m.id || m.thuTu}
                tabIndex={0}
                role="button"
                aria-label={`Mốc ${m.thuTu}: ${m.tenMoc} - ${visual.badgeText}`}
                onKeyDown={(e) => handleKeyDown(e, m.thuTu)}
                onClick={() => handleStepClick(m.thuTu)}
                className="flex-1 flex flex-col items-center text-center relative group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:rounded-xl p-1"
              >
                {/* Đường nối giữa các node */}
                {!isLast && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-[2px] transition-colors duration-300 z-0 ${
                      isLineActive ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  />
                )}

                {/* Node hình tròn icon */}
                <div
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    visual.circleClasses
                  } ${visual.isPulsing ? "animate-pulse" : "group-hover:scale-105"} ${
                    isCurrentActive
                      ? "ring-2 ring-offset-2 ring-slate-400 shadow-xs"
                      : ""
                  }`}
                  title={`Mốc ${m.thuTu}: ${m.tenMoc}${isCurrentActive ? " (Mốc hiện tại)" : ""}`}
                >
                  {visual.icon}
                </div>

                {/* Nhãn mốc & tên rút gọn */}
                <div className="mt-2.5 px-1 max-w-[105px] space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[11px] font-bold text-slate-900 tracking-tight">
                      Mốc {m.thuTu}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] leading-tight line-clamp-2 ${visual.textClasses}`}
                    title={m.tenMoc}
                  >
                    {m.tenMoc.replace(/^Mốc \d+:\s*/, "")}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${visual.badgeClasses}`}
                  >
                    {visual.badgeText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
