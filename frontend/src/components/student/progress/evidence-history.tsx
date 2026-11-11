"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  History,
  Inbox,
  MessageSquare,
  XCircle,
} from "lucide-react";
import type { EvidenceItem, EvidenceStatus } from "@/src/types/ui/progress";
import { DocumentViewButton } from "./document-view-button";

interface EvidenceHistoryProps {
  history?: EvidenceItem[];
  defaultOpen?: boolean;
}

export function EvidenceHistory({
  history = [],
  defaultOpen = false,
}: EvidenceHistoryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const formatDateTimeStr = (isoString?: string): string => {
    if (!isoString) return "--/--/----";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return isoString;
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();
    const hours = String(d.getUTCHours()).padStart(2, "0");
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const renderStatusBadge = (status: EvidenceStatus) => {
    switch (status) {
      case "PASSED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="size-3 text-emerald-600" aria-hidden="true" />
            Đã duyệt đạt
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
            <XCircle className="size-3 text-rose-600" aria-hidden="true" />
            Chưa đạt / Yêu cầu chỉnh sửa
          </span>
        );
      case "PENDING_REVIEW":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <Clock className="size-3 text-amber-600" aria-hidden="true" />
            Đang chờ thẩm định
          </span>
        );
    }
  };

  const hasHistory = history.length > 0;
  const sortedHistory = hasHistory
    ? [...history].sort((a, b) => b.lanNop - a.lanNop)
    : [];

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-muted/25">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex min-h-10 w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] select-none"
      >
        <div className="flex items-center gap-2">
          <History className="size-4 text-[#164E9B]" aria-hidden="true" />
          <span className="text-xs font-semibold text-foreground">
            Lịch sử nộp minh chứng{" "}
            {hasHistory ? `(${history.length} lần nộp)` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-xs font-medium">
            {isOpen ? "Thu gọn" : "Xem chi tiết"}
          </span>
          <ChevronDown
            className={`size-4 transition-transform duration-150 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </div>
      </button>

      {isOpen && (
        <div className="space-y-3.5 border-t border-border p-4 pt-3">
          {!hasHistory ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card px-4 py-6 text-center">
              <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground">
                <Inbox className="size-4" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                Chưa có dữ liệu nộp minh chứng
              </p>
              <p className="max-w-sm text-xs text-muted-foreground">
                Sau khi gửi minh chứng, toàn bộ lịch sử các lần nộp và kết quả
                thẩm định của Giáo vụ sẽ được lưu vết tự động tại đây.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sortedHistory.map((item) => (
                <div
                  key={item.id || item.lanNop}
                  className="space-y-2.5 pt-3.5 first:pt-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-[#0F2744]">
                        Lần nộp #{item.lanNop}
                      </span>
                      {renderStatusBadge(item.trangThai)}
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs tabular-nums text-muted-foreground">
                      <Calendar className="size-3.5" aria-hidden="true" />
                      <span>{formatDateTimeStr(item.ngayNop)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-2.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-[#164E9B]">
                        <FileText className="size-3.5" aria-hidden="true" />
                      </div>
                      <span className="truncate text-xs font-medium text-foreground">
                        {item.fileName}
                      </span>
                    </div>

                    <DocumentViewButton
                      fileId={item.fileId}
                      fileName={item.fileName}
                      fileUrl={item.fileUrl}
                      size="sm"
                      variant="outline"
                      showLabel={true}
                    />
                  </div>

                  {item.diemTrungBinh && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs text-emerald-800">
                      <Award
                        className="size-3.5 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                      <span>
                        Điểm đánh giá trung bình:{" "}
                        <strong className="font-mono font-semibold tabular-nums text-emerald-950">
                          {Number(item.diemTrungBinh).toFixed(1)}
                        </strong>{" "}
                        / 10.0
                      </span>
                    </div>
                  )}

                  {item.ghiChuNcs && (
                    <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground">
                      <MessageSquare
                        className="mt-0.5 size-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <span className="font-semibold text-foreground">
                          Ghi chú NCS:{" "}
                        </span>
                        <span>{item.ghiChuNcs}</span>
                      </div>
                    </div>
                  )}

                  {item.trangThai === "REJECTED" && item.lyDoTuChoi && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/80 p-3.5 text-rose-950">
                      <AlertCircle
                        className="mt-0.5 size-4 shrink-0 text-rose-600"
                        aria-hidden="true"
                      />
                      <div className="space-y-1 text-xs">
                        <p className="font-semibold text-rose-950">
                          Lý do chưa đạt yêu cầu từ Giáo vụ:
                        </p>
                        <p className="leading-relaxed text-rose-900">
                          &ldquo;{item.lyDoTuChoi}&rdquo;
                        </p>
                        {item.nguoiDuyet && (
                          <p className="pt-0.5 text-xs text-rose-800/90">
                            Cán bộ thẩm định: {item.nguoiDuyet} • Ngày phản hồi:{" "}
                            {formatDateTimeStr(item.ngayDuyet)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EvidenceHistory;
