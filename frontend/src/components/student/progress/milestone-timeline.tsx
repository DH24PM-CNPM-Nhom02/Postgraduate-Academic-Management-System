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
import type { MilestoneProgressItem } from "@/src/types/ui/progress";

export interface MilestoneTimelineProps {
  milestones: MilestoneProgressItem[];
  activeMilestoneOrder?: number;
}

export function MilestoneTimeline({
  milestones,
  activeMilestoneOrder,
}: MilestoneTimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const getStepVisuals = (milestone: MilestoneProgressItem) => {
    const status = milestone.trangThai;

    switch (status) {
      case "PASSED":
        return {
          icon: <Check className="h-4 w-4 stroke-[2.5]" />,
          circleClasses:
            "bg-emerald-600 text-white border-emerald-600 shadow-2xs hover:bg-emerald-700",
          textClasses: "text-emerald-900 font-semibold",
          badgeText: "Hoàn thành",
          badgeClasses: "bg-emerald-50 text-emerald-700 border-emerald-200",
          isPulsing: false,
        };
      case "REJECTED":
        return {
          icon: <AlertCircle className="h-4 w-4 stroke-[2.5]" />,
          circleClasses:
            "bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-500/20 hover:bg-rose-700 ring-4 ring-rose-500/20",
          textClasses: "text-rose-900 font-bold",
          badgeText: "Cần nộp lại",
          badgeClasses: "bg-rose-50 text-rose-700 border-rose-200",
          isPulsing: true,
        };
      case "PENDING_REVIEW":
        return {
          icon: <Clock className="h-4 w-4 stroke-[2.5]" />,
          circleClasses:
            "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20 hover:bg-amber-600 ring-4 ring-amber-500/20",
          textClasses: "text-amber-900 font-bold",
          badgeText: "Chờ duyệt",
          badgeClasses: "bg-amber-50 text-amber-800 border-amber-200",
          isPulsing: true,
        };
      case "UNLOCKED":
        return {
          icon: <Unlock className="h-4 w-4 stroke-[2.5]" />,
          circleClasses:
            "bg-[#164E9B] text-white border-[#164E9B] shadow-sm shadow-[#164E9B]/20 hover:bg-[#113E7D] ring-4 ring-[#164E9B]/20",
          textClasses: "text-[#0F2744] font-bold",
          badgeText: "Sẵn sàng",
          badgeClasses: "bg-[#164E9B]/10 text-[#164E9B] border-[#164E9B]/25",
          isPulsing: true,
        };
      case "LOCKED":
      default:
        return {
          icon: <Lock className="h-3.5 w-3.5" />,
          circleClasses:
            "bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:text-foreground",
          textClasses: "text-muted-foreground font-medium",
          badgeText: "Khóa",
          badgeClasses: "bg-muted text-muted-foreground border-border",
          isPulsing: false,
        };
    }
  };

  return (
    <section
      aria-label="Sơ đồ các mốc đào tạo"
      className="relative rounded-xl border border-border bg-card p-5 sm:p-6 shadow-2xs"
    >
      {/* Tiêu đề Stepper và nút cuộn nhanh */}
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h2 className="flex flex-wrap items-center gap-2 text-sm font-bold tracking-tight text-foreground">
            <span>
              Tiến trình {milestones.length > 0 ? `${milestones.length} ` : ""}
              mốc đào tạo NCS
            </span>
            <span className="text-[11px] font-normal text-muted-foreground">
              (Nhấn hoặc Tab + Enter để cuộn đến mốc tương ứng)
            </span>
          </h2>
        </div>

        {/* Nút điều hướng cuộn ngang với vùng chạm tối thiểu 40x40px */}
        {milestones.length > 0 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Cuộn stepper sang trái"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Cuộn stepper sang phải"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]/50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {milestones.length === 0 ? (
        <div className="rounded-lg bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
          Chưa có dữ liệu mốc đào tạo để hiển thị trên sơ đồ tiến trình.
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="-mx-2 overflow-x-auto px-2 pb-4 pt-2"
        >
          <div className="relative flex min-w-[880px] items-start justify-between">
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
                  className="group relative flex flex-1 cursor-pointer flex-col items-center rounded-xl p-1.5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
                >
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className={`absolute left-1/2 top-5 z-0 h-[2px] w-full transition-colors duration-300 ${
                        isLineActive ? "bg-[#164E9B]" : "bg-border"
                      }`}
                    />
                  )}

                  <div
                    className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      visual.circleClasses
                    } ${
                      visual.isPulsing
                        ? "animate-pulse motion-reduce:animate-none"
                        : "group-hover:scale-105 motion-reduce:group-hover:scale-100"
                    } ${
                      isCurrentActive
                        ? "ring-2 ring-[#164E9B] ring-offset-2 shadow-xs"
                        : ""
                    }`}
                    title={`Mốc ${m.thuTu}: ${m.tenMoc}${
                      isCurrentActive ? " (Mốc hiện tại)" : ""
                    }`}
                  >
                    {visual.icon}
                  </div>

                  <div className="mt-2.5 max-w-[108px] space-y-1 px-1">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[11px] font-bold tracking-tight text-foreground">
                        Mốc {m.thuTu}
                      </span>
                    </div>
                    <p
                      className={`line-clamp-2 text-[11px] leading-tight ${visual.textClasses}`}
                      title={m.tenMoc}
                    >
                      {m.tenMoc.replace(/^Mốc \d+:\s*/, "")}
                    </p>
                    <span
                      className={`inline-block rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${visual.badgeClasses}`}
                    >
                      {visual.badgeText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
