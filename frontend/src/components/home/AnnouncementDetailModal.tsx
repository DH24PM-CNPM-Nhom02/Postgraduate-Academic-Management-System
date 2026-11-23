"use client";

import { useEffect, useId } from "react";
import { Calendar, Download, FileText, UserCheck, X } from "lucide-react";

export interface AnnouncementItem {
  id: string;
  title: string;
  category: "Học vụ" | "Quan trọng" | "Bảo vệ luận án" | "Quy chế" | "Đề cương";
  date: string;
  summary: string;
  author: string;
  department: string;
  content: string[];
  attachments?: Array<{ name: string; size: string; format: "PDF" | "DOCX" | "XLSX" }>;
}

export interface AnnouncementDetailModalProps {
  announcement: AnnouncementItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AnnouncementDetailModal({
  announcement,
  isOpen,
  onClose,
}: AnnouncementDetailModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !announcement) return null;

  const categoryBadgeClasses: Record<string, string> = {
    "Quan trọng": "bg-rose-50 text-rose-700 border-rose-200",
    "Học vụ": "bg-blue-50 text-[#164E9B] border-blue-200",
    "Bảo vệ luận án": "bg-purple-50 text-purple-700 border-purple-200",
    "Quy chế": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Đề cương": "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${
                  categoryBadgeClasses[announcement.category] || "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {announcement.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="size-3.5 text-slate-400" />
                <time>{announcement.date}</time>
              </span>
            </div>
            <h2 id={titleId} className="text-base font-bold text-slate-900 sm:text-lg">
              {announcement.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng thông báo"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {announcement.content.map((paragraph, idx) => (
            <p key={idx} className="text-justify">
              {paragraph}
            </p>
          ))}

          {/* Department Signing Info */}
          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <UserCheck className="size-4 text-[#164E9B]" />
                <span className="font-semibold text-slate-900">{announcement.author}</span>
              </div>
              <span className="italic">{announcement.department}</span>
            </div>
          </div>

          {/* Attachments Section */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Văn bản &amp; Tài liệu đính kèm
              </h3>
              <div className="space-y-2">
                {announcement.attachments.map((file, fIdx) => (
                  <div
                    key={fIdx}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#164E9B] text-xs font-bold">
                        <FileText className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-900">
                          {file.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {file.format} • {file.size}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Tải xuống tài liệu: ${file.name}`)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-[#164E9B] hover:bg-blue-50 transition-colors shrink-0"
                    >
                      <Download className="size-3.5" />
                      <span>Tải về</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/80 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementDetailModal;
