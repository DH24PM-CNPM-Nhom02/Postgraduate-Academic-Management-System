"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  FileText,
  History,
  Inbox,
  RefreshCw,
  ScrollText,
  XCircle,
} from "lucide-react";
import type { ThesisItem, ThesisStatus } from "@/src/types/ui/thesis";
import { PdfViewer } from "@/src/components/upload/PdfViewer";

export interface ThesisHistoryProps {
  /** Danh sách các phiên bản đề tài trước đây (DA_THAY_THE, DA_HUY) */
  items: ThesisItem[];
  /** Trạng thái đang tải */
  isLoading?: boolean;
  /** Thông báo lỗi */
  error?: string | null;
  /** Callback thử lại khi lỗi */
  onRetry?: () => void;
  /** Class CSS bổ sung */
  className?: string;
}

function formatDateVi(iso?: string): string {
  if (!iso) return "--/--/----";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function getHistoryBadge(status: ThesisStatus) {
  switch (status) {
    case "HIEU_LUC":
      return {
        label: "Đang hiệu lực",
        classes: "border-emerald-200 bg-emerald-50 text-emerald-800",
        Icon: CheckCircle2,
      };
    case "DA_THAY_THE":
      return {
        label: "Đã thay thế",
        classes: "border-amber-200 bg-amber-50 text-amber-800",
        Icon: RefreshCw,
      };
    case "DA_HUY":
    default:
      return {
        label: "Đã hủy",
        classes: "border-rose-200 bg-rose-50 text-rose-800",
        Icon: XCircle,
      };
  }
}

/**
 * ThesisHistory
 *
 * Hiển thị lịch sử điều chỉnh / thay thế đề tài luận án của Nghiên cứu sinh.
 * Có đầy đủ trạng thái `isLoading`, `error` và Empty state khi chưa từng đổi đề tài.
 */
export function ThesisHistory({
  items,
  isLoading = false,
  error = null,
  onRetry,
  className = "",
}: ThesisHistoryProps) {
  const [selectedDecision, setSelectedDecision] = useState<ThesisItem | null>(
    null
  );

  return (
    <>
      <section
        aria-label="Lịch sử thay đổi đề tài"
        className={`rounded-2xl border border-border bg-card text-card-foreground shadow-xs ${className}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted/50 text-[#164E9B]">
              <History className="size-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F2744] sm:text-base">
                Lịch sử điều chỉnh đề tài
              </h2>
              <p className="text-xs text-muted-foreground">
                Theo dõi các quyết định giao đề tài và điều chỉnh tên đề tài qua từng giai đoạn
              </p>
            </div>
          </div>

          {!isLoading && !error && items.length > 0 && (
            <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums text-muted-foreground">
              {items.length} bản ghi
            </span>
          )}
        </div>

        <div className="p-6">
          {isLoading ? (
            <div
              aria-busy="true"
              aria-label="Đang tải lịch sử đề tài"
              className="space-y-4 animate-pulse motion-reduce:animate-none"
            >
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className="space-y-2.5 border-b border-border pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between gap-2">
                    <div className="h-4 w-40 rounded bg-muted" />
                    <div className="h-5 w-24 rounded-full bg-muted" />
                  </div>
                  <div className="h-5 w-5/6 rounded bg-muted" />
                  <div className="h-3.5 w-2/3 rounded bg-muted/70" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div
              role="alert"
              className="flex flex-col items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle
                  className="mt-0.5 size-4 shrink-0 text-rose-600"
                  aria-hidden="true"
                />
                <div className="space-y-0.5 text-xs">
                  <p className="font-bold text-rose-950">
                    Không thể tải lịch sử điều chỉnh đề tài
                  </p>
                  <p className="text-rose-800">{error}</p>
                </div>
              </div>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-rose-200 bg-card px-3 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" />
                  <span>Thử lại</span>
                </button>
              )}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/25 px-6 py-8 text-center">
              <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Inbox className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">
                Chưa có lịch sử thay đổi đề tài
              </h3>
              <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
                Đề tài luận án hiện tại vẫn giữ nguyên kể từ quyết định phê duyệt ban đầu.
                Khi có quyết định điều chỉnh hoặc thay thế đề tài mới, các phiên bản cũ sẽ được lưu vết tại đây.
              </p>
            </div>
          ) : (
            <ol className="divide-y divide-border">
              {items.map((item) => {
                const badge = getHistoryBadge(item.trangThai);
                const BadgeIcon = badge.Icon;

                return (
                  <li
                    key={item.id}
                    className="space-y-2.5 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 font-mono font-semibold text-foreground">
                          <ScrollText
                            className="size-3.5 text-[#164E9B]"
                            aria-hidden="true"
                          />
                          {item.quyetDinh.soQuyetDinh}
                        </span>
                        <span aria-hidden="true">•</span>
                        <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                          <Calendar className="size-3.5" aria-hidden="true" />
                          {formatDateVi(item.ngayBatDau)}
                          {item.ngayKetThuc
                            ? ` → ${formatDateVi(item.ngayKetThuc)}`
                            : ""}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.classes}`}
                      >
                        <BadgeIcon className="size-3" aria-hidden="true" />
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold leading-snug text-foreground">
                        {item.tenDeTaiTiengViet}
                      </h3>
                      {item.tenDeTaiTiengAnh && (
                        <p className="mt-0.5 text-xs italic text-muted-foreground">
                          {item.tenDeTaiTiengAnh}
                        </p>
                      )}
                    </div>

                    {item.lyDoThayDoi && (
                      <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                        <strong className="font-semibold text-foreground">
                          Lý do điều chỉnh:
                        </strong>{" "}
                        {item.lyDoThayDoi}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                      <span className="text-xs text-muted-foreground">
                        Ngày ký QĐ:{" "}
                        <span className="font-mono font-medium text-foreground">
                          {formatDateVi(item.quyetDinh.ngayKy)}
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedDecision(item)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-[#164E9B] transition-colors hover:border-blue-200 hover:bg-blue-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
                      >
                        <FileText className="size-3.5" aria-hidden="true" />
                        <span>Xem PDF QĐ</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>

      <PdfViewer
        isOpen={Boolean(selectedDecision)}
        onClose={() => setSelectedDecision(null)}
        fileUrl={selectedDecision?.quyetDinh.fileUrl}
        fileName={selectedDecision?.quyetDinh.fileName}
        title={
          selectedDecision
            ? `Quyết định ${selectedDecision.quyetDinh.soQuyetDinh}`
            : undefined
        }
        subtitle={
          selectedDecision
            ? `Ngày ký ${formatDateVi(selectedDecision.quyetDinh.ngayKy)} • ${
                selectedDecision.maDeTai || "Đề tài trước đây"
              }`
            : undefined
        }
        allowDownload={true}
      />
    </>
  );
}

export default ThesisHistory;
