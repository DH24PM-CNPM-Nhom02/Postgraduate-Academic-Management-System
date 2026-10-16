"use client";

import React, { useState } from "react";
import { User, AlertCircle, Check, ChevronDown } from "lucide-react";
import { QuotaBar } from "./QuotaBar";

export interface SupervisorOption {
  id: string;
  name: string;
  title: string; // GS.TS, PGS.TS, TS.
  department: string;
  independentCount: number;
  coCount: number;
  maxQuota: number;
}

export const MOCK_SUPERVISORS: SupervisorOption[] = [
  {
    id: "gv-01",
    name: "Bùi Lê Tuấn Anh",
    title: "TS.",
    department: "Khoa Công nghệ Thông tin",
    independentCount: 1,
    coCount: 3,
    maxQuota: 3.0,
  },
  {
    id: "gv-02",
    name: "Nguyễn Văn Hùng",
    title: "PGS.TS.",
    department: "Khoa Nông nghiệp - TNTN",
    independentCount: 2,
    coCount: 2,
    maxQuota: 4.0,
  },
  {
    id: "gv-03",
    name: "Trần Minh Tâm",
    title: "GS.TS.",
    department: "Khoa Kinh tế - QTKD",
    independentCount: 2,
    coCount: 4,
    maxQuota: 4.0,
  },
  {
    id: "gv-04",
    name: "Phạm Thị Thu Trang",
    title: "TS.",
    department: "Khoa Công nghệ Thông tin",
    independentCount: 2,
    coCount: 2,
    maxQuota: 3.0,
  },
];

export interface SupervisorSelectorProps {
  label?: string;
  selectedId?: string;
  onSelect?: (supervisor: SupervisorOption) => void;
  assignmentType?: "independent" | "co_supervisor";
  disabled?: boolean;
}

export function SupervisorSelector({
  label = "Chọn Giảng viên Hướng dẫn",
  selectedId = "gv-01",
  onSelect,
  assignmentType = "independent",
  disabled = false,
}: SupervisorSelectorProps) {
  const [selected, setSelected] = useState<SupervisorOption>(
    () => MOCK_SUPERVISORS.find((s) => s.id === selectedId) || MOCK_SUPERVISORS[0]
  );
  const [isOpen, setIsOpen] = useState(false);

  const additionalCost = assignmentType === "independent" ? 1.0 : 0.5;
  const currentUsed = selected.independentCount * 1.0 + selected.coCount * 0.5;
  const projectedUsed = currentUsed + additionalCost;
  const wouldExceed = projectedUsed > selected.maxQuota;

  const handleSelect = (sup: SupervisorOption) => {
    setSelected(sup);
    setIsOpen(false);
    onSelect?.(sup);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
      )}

      {/* Select Box */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-left text-sm transition-all hover:border-[#164E9B] focus:outline-hidden focus:ring-2 focus:ring-[#164E9B]/20 ${
            disabled ? "cursor-not-allowed bg-slate-100 opacity-60" : ""
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-full bg-[#164E9B]/10 text-xs font-bold text-[#164E9B]">
              <User className="size-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-900">
                {selected.title} {selected.name}
              </span>
              <span className="ml-2 text-xs text-slate-500">({selected.department})</span>
            </div>
          </div>
          <ChevronDown className={`size-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            {MOCK_SUPERVISORS.map((sup) => {
              const used = sup.independentCount * 1.0 + sup.coCount * 0.5;
              const willExceed = used + additionalCost > sup.maxQuota;

              return (
                <button
                  key={sup.id}
                  type="button"
                  onClick={() => handleSelect(sup)}
                  className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 ${
                    sup.id === selected.id ? "bg-[#164E9B]/5 text-[#164E9B] font-semibold" : "text-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{sup.title} {sup.name}</span>
                      {sup.id === selected.id && <Check className="size-4 text-[#164E9B]" />}
                    </div>
                    <span className="text-xs text-slate-500">{sup.department}</span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        willExceed
                          ? "bg-rose-50 text-rose-600"
                          : used >= sup.maxQuota * 0.8
                          ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {used.toFixed(1)} / {sup.maxQuota.toFixed(1)} NCS
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Real-time Quota preview */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
        <QuotaBar
          used={currentUsed}
          max={selected.maxQuota}
          independentCount={selected.independentCount}
          coCount={selected.coCount}
          showDetails={false}
          compact={true}
        />

        {wouldExceed ? (
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2 text-xs text-rose-700 border border-rose-200">
            <AlertCircle className="size-4 shrink-0 text-rose-600" />
            <span>
              <strong>Cảnh báo BR-09:</strong> Giảng viên đã đạt giới hạn hướng dẫn tối đa ({selected.maxQuota} NCS). Không thể phân công thêm nếu chưa có NCS tốt nghiệp.
            </span>
          </div>
        ) : (
          <p className="text-[11px] text-slate-500">
            Sau khi phân công {assignmentType === "independent" ? "hướng dẫn độc lập (+1.0)" : "đồng hướng dẫn (+0.5)"}:{" "}
            <strong>{projectedUsed.toFixed(1)} / {selected.maxQuota.toFixed(1)} NCS</strong> (Hợp lệ).
          </p>
        )}
      </div>
    </div>
  );
}

export default SupervisorSelector;
