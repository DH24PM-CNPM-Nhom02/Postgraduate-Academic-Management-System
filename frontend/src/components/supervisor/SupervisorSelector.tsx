"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AlertCircle, Check, ChevronDown, User } from "lucide-react";
import type { QuotaWarningLevel, SupervisorQuota } from "@/src/types/ui/supervisor";
import { QuotaBar } from "./QuotaBar";

export interface SupervisorSelectorItem {
  id: string;
  hoTen: string;
  hocHamHocVi: string;
  donVi: string;
  soLuongHuongDanChinh: number;
  soLuongDongHuongDan: number;
  hanMucToiDa: number;
}

export interface SupervisorSelectorProps {
  label?: string;
  options: SupervisorSelectorItem[];
  selectedId?: string;
  onSelect?: (supervisor: SupervisorSelectorItem) => void;
  vaiTroDuKien?: "HUONG_DAN_CHINH" | "DONG_HUONG_DAN";
  disabled?: boolean;
}

function buildProjectedQuota(
  item: SupervisorSelectorItem
): SupervisorQuota {
  const trongSoChinh = Number((item.soLuongHuongDanChinh * 1.0).toFixed(1));
  const trongSoPhu = Number((item.soLuongDongHuongDan * 0.5).toFixed(1));
  const tongTrongSo = Number((trongSoChinh + trongSoPhu).toFixed(1));
  const hanMucToiDa = item.hanMucToiDa > 0 ? item.hanMucToiDa : 5.0;
  const trongSoConLai = Number(Math.max(0, hanMucToiDa - tongTrongSo).toFixed(1));
  const tyLeSuDungPhanTram = Math.round((tongTrongSo / hanMucToiDa) * 100);

  let mucCanhBao: QuotaWarningLevel = "SAFE";
  if (tongTrongSo > hanMucToiDa) mucCanhBao = "EXCEEDED";
  else if (tongTrongSo >= hanMucToiDa) mucCanhBao = "FULL";
  else if (tyLeSuDungPhanTram >= 80) mucCanhBao = "WARNING";

  return {
    hanMucToiDa,
    soLuongHuongDanChinh: item.soLuongHuongDanChinh,
    soLuongDongHuongDan: item.soLuongDongHuongDan,
    trongSoChinh,
    trongSoPhu,
    tongTrongSo,
    trongSoConLai,
    tyLeSuDungPhanTram,
    mucCanhBao,
  };
}

/**
 * SupervisorSelector
 *
 * Component chọn giảng viên theo danh sách props và xem trước định mức BR-09 (1.0 / 0.5).
 * Tách biệt hoàn toàn khỏi luồng phân công của cổng Giáo vụ.
 */
export function SupervisorSelector({
  label = "Chọn Giảng viên Hướng dẫn",
  options,
  selectedId,
  onSelect,
  vaiTroDuKien = "HUONG_DAN_CHINH",
  disabled = false,
}: SupervisorSelectorProps) {
  const labelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalId, setInternalId] = useState<string>(options[0]?.id || "");
  const [isOpen, setIsOpen] = useState(false);

  const activeId = selectedId || internalId || options[0]?.id;
  const selected = options.find((s) => s.id === activeId) || options[0];

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!selected) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-4 text-xs text-muted-foreground">
        Chưa có danh sách giảng viên khả dụng.
      </div>
    );
  }

  const currentQuota = buildProjectedQuota(selected);
  const deltaWeight = vaiTroDuKien === "HUONG_DAN_CHINH" ? 1.0 : 0.5;
  const projectedTotal = Number((currentQuota.tongTrongSo + deltaWeight).toFixed(1));
  const wouldExceed = projectedTotal > currentQuota.hanMucToiDa;

  return (
    <div ref={containerRef} className="space-y-3">
      {label && (
        <span id={labelId} className="block text-xs font-semibold text-foreground">
          {label}
        </span>
      )}

      <div className="relative">
        <button
          type="button"
          aria-labelledby={label ? labelId : undefined}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex min-h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-left text-sm transition-colors hover:border-[#164E9B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#164E9B]/10 text-[#164E9B]">
              <User className="size-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 truncate">
              <span className="font-semibold text-foreground">
                {selected.hocHamHocVi} {selected.hoTen}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                ({selected.donVi})
              </span>
            </div>
          </div>
          <ChevronDown
            className={`size-4 shrink-0 text-muted-foreground transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div
            role="listbox"
            className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-lg"
          >
            {options.map((sup) => {
              const q = buildProjectedQuota(sup);
              const willExceed = q.tongTrongSo + deltaWeight > q.hanMucToiDa;

              return (
                <button
                  key={sup.id}
                  type="button"
                  role="option"
                  aria-selected={sup.id === selected.id}
                  onClick={() => {
                    setInternalId(sup.id);
                    setIsOpen(false);
                    onSelect?.(sup);
                  }}
                  className={`flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-muted/60 ${
                    sup.id === selected.id
                      ? "bg-[#164E9B]/8 font-semibold text-[#164E9B]"
                      : "text-foreground"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span>
                        {sup.hocHamHocVi} {sup.hoTen}
                      </span>
                      {sup.id === selected.id && (
                        <Check className="size-3.5 text-[#164E9B]" aria-hidden="true" />
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {sup.donVi}
                    </span>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums ${
                      willExceed
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : q.mucCanhBao === "WARNING"
                          ? "border-amber-200 bg-amber-50 text-amber-800"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {q.tongTrongSo.toFixed(1)} / {q.hanMucToiDa.toFixed(1)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-2.5 rounded-xl bg-muted/45 p-3.5">
        <QuotaBar quota={currentQuota} compact showDetails={false} />

        {wouldExceed ? (
          <div className="flex items-start gap-2 rounded-lg bg-rose-50/90 p-2.5 text-xs text-rose-800">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden="true" />
            <span>
              <strong>Vượt trần BR-09:</strong> Sau khi cộng thêm {deltaWeight.toFixed(1)} sẽ đạt{" "}
              {projectedTotal.toFixed(1)} / {currentQuota.hanMucToiDa.toFixed(1)} điểm định mức.
            </span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Dự kiến sau đề xuất (+{deltaWeight.toFixed(1)}):{" "}
            <strong className="font-mono text-foreground">
              {projectedTotal.toFixed(1)} / {currentQuota.hanMucToiDa.toFixed(1)}
            </strong>{" "}
            (Hợp lệ).
          </p>
        )}
      </div>
    </div>
  );
}

export default SupervisorSelector;
