"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  History,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  Award,
  Inbox,
} from "lucide-react";
import { EvidenceItem, EvidenceStatus } from "@/src/types/progress";
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

  // Format ngày theo chuẩn Việt Nam dd/MM/yyyy HH:mm
  const formatDateTimeStr = (isoString?: string): string => {
    if (!isoString) return "--/--/----";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return isoString;
    }
  };

  const renderStatusBadge = (status: EvidenceStatus) => {
    switch (status) {
      case "PASSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Đã duyệt đạt
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
            <XCircle className="w-3 h-3 text-rose-600" />
            Chưa đạt / Yêu cầu chỉnh sửa
          </span>
        );
      case "PENDING_REVIEW":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
            <Clock className="w-3 h-3 text-amber-600" />
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
    <div className="mt-4 border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/60 transition-colors">
      {/* Header Accordion */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-all select-none cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-800">
            Lịch sử nộp minh chứng {hasHistory ? `(${history.length} lần nộp)` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[11px] font-medium text-slate-500">
            {isOpen ? "Thu gọn" : "Xem chi tiết"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Nội dung danh sách các lần nộp hoặc Empty State */}
      {isOpen && (
        <div className="p-4 pt-1 space-y-3.5 border-t border-slate-200/70 animate-in fade-in slide-in-from-top-2 duration-200 ease-out">
          {!hasHistory ? (
            /* Empty State khi chưa có lần nộp nào */
            <div className="py-6 px-4 text-center flex flex-col items-center justify-center gap-2 bg-white rounded-lg border border-dashed border-slate-200 animate-in fade-in duration-200">
              <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                <Inbox className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Chưa có dữ liệu nộp minh chứng
              </p>
              <p className="text-[11px] text-slate-400 max-w-sm">
                Sau khi gửi minh chứng, toàn bộ lịch sử các lần nộp, biên bản và kết quả
                thẩm định của Giáo vụ sẽ được lưu vết tự động tại đây.
              </p>
            </div>
          ) : (
            /* Danh sách các lần nộp */
            <div className="divide-y divide-slate-200/70">
              {sortedHistory.map((item) => (
                <div
                  key={item.id || item.lanNop}
                  className="pt-3.5 first:pt-1 space-y-2.5"
                >
                  {/* Header lần nộp */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs font-mono">
                        Lần nộp #{item.lanNop}
                      </span>
                      {renderStatusBadge(item.trangThai)}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDateTimeStr(item.ngayNop)}</span>
                    </div>
                  </div>

                  {/* Tệp minh chứng & nút xem */}
                  <div className="flex items-center justify-between gap-3 p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-medium text-slate-800 truncate">
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

                  {/* Điểm số nếu có */}
                  {item.diemTrungBinh && (
                    <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 px-3 py-1.5 rounded-lg">
                      <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Điểm đánh giá trung bình:{" "}
                        <strong className="font-semibold text-emerald-950 font-mono">
                          {Number(item.diemTrungBinh).toFixed(1)}
                        </strong>{" "}
                        / 10.0
                      </span>
                    </div>
                  )}

                  {/* Ghi chú của NCS */}
                  {item.ghiChuNcs && (
                    <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-100/70 p-2.5 rounded-lg border border-slate-200/40">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-slate-700">
                          Ghi chú NCS:{" "}
                        </span>
                        <span className="italic text-slate-600">
                          {item.ghiChuNcs}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Lý do từ chối nếu bị REJECTED */}
                  {item.trangThai === "REJECTED" && item.lyDoTuChoi && (
                    <div className="p-3.5 rounded-lg bg-rose-50/80 border border-rose-200/80 text-rose-950 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <p className="font-semibold text-rose-950">
                          Lý do chưa đạt yêu cầu từ Giáo vụ:
                        </p>
                        <p className="text-rose-900 leading-relaxed font-medium italic">
                          &ldquo;{item.lyDoTuChoi}&rdquo;
                        </p>
                        {item.nguoiDuyet && (
                          <p className="text-[11px] text-rose-700/80 pt-0.5">
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
