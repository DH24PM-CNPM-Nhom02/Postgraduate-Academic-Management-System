"use client";

import React from "react";
import { X, FileText } from "lucide-react";

export interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  studentName?: string;
  studentCode?: string;
  milestoneName?: string;
  submissionDate?: string;
  fileSize?: string;
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  documentTitle = "Tài liệu minh chứng",
  studentName,
  studentCode,
  milestoneName,
  submissionDate,
  fileSize,
}: DocumentPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label={documentTitle}>
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 bg-[#164E9B] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <FileText className="size-5 shrink-0" />
            <div>
              <h3 className="text-sm font-bold">{documentTitle}</h3>
              {(studentName || studentCode) && <p className="text-xs text-white/80">{studentName} {studentCode && `(${studentCode})`}</p>}
              {milestoneName && <p className="text-xs text-white/80">{milestoneName}</p>}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng xem trước" className="rounded-lg p-1.5 hover:bg-white/20">
            <X className="size-5" />
          </button>
        </div>
        {(submissionDate || fileSize) && (
          <div className="flex gap-4 border-b border-slate-200 px-5 py-3 text-xs text-slate-500">
            {submissionDate && <span>Nộp ngày: {submissionDate}</span>}
            {fileSize && <span>Dung lượng: {fileSize}</span>}
          </div>
        )}
        <p className="px-5 py-16 text-center text-sm text-slate-500">Chưa có tài liệu để xem trước.</p>
      </div>
    </div>
  );
}

export default DocumentPreviewModal;
