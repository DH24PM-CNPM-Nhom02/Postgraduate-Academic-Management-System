"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { PdfUploader } from "@/src/components/upload/PdfUploader";
import { UploadProgress } from "@/src/components/upload/UploadProgress";
import type { MilestoneProgressItem } from "@/src/types/ui/progress";

export interface SubmitEvidenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: MilestoneProgressItem;
  lanNopTiepTheo?: number;
  onSubmitSuccess?: (submission: {
    fileName: string;
    fileSize: number;
    ghiChuNcs: string;
    lanNop: number;
    fileId?: string;
  }) => void;
}

const MAX_NOTE_LENGTH = 500;

function SubmitEvidenceDialogInner({
  onClose,
  milestone,
  lanNopTiepTheo,
  onSubmitSuccess,
}: Omit<SubmitEvidenceDialogProps, "isOpen">) {
  const titleId = useId();
  const descId = useId();
  const fileUploadId = useId();
  const noteId = useId();

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"uploading" | "success" | "error">("uploading");

  const nextLanNop =
    lanNopTiepTheo ||
    (milestone.lichSuMinhChung && milestone.lichSuMinhChung.length > 0
      ? milestone.lichSuMinhChung.length + 1
      : 1);

  const clearTimers = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      clearTimers();
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isUploading) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUploading, onClose]);

  const handleCancelUpload = () => {
    clearTimers();
    setIsUploading(false);
    setUploadProgress(0);
    setUploadStatus("uploading");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || isUploading || note.length > MAX_NOTE_LENGTH) {
      if (!selectedFile) {
        setFileError("Vui lòng chọn tệp minh chứng định dạng .PDF trước khi gửi.");
      }
      return;
    }

    clearTimers();
    setIsUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(20);

    let current = 20;
    intervalRef.current = window.setInterval(() => {
      current = Math.min(90, current + 25);
      setUploadProgress(current);
      if (current >= 90 && intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 120);

    timeoutRef.current = window.setTimeout(() => {
      clearTimers();
      setUploadProgress(100);
      setUploadStatus("success");

      timeoutRef.current = window.setTimeout(() => {
        setIsUploading(false);
        onSubmitSuccess?.({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          ghiChuNcs: note.trim(),
          lanNop: nextLanNop,
          fileId: `file-${Date.now()}`,
        });
        onClose();
      }, 250);
    }, 450);
  };

  const isResubmit = milestone.trangThai === "REJECTED";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={() => {
        if (!isUploading) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs transition-opacity duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl"
      >
        {/* Header Dialog */}
        <div className="flex items-start justify-between gap-3 border-b border-border bg-muted/30 px-6 py-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-[#164E9B]">
                Mốc {milestone.thuTu}
              </span>
              {isResubmit && (
                <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 font-mono text-xs font-semibold text-rose-700">
                  Nộp lại (Lần {nextLanNop})
                </span>
              )}
            </div>
            <h3
              id={titleId}
              className="text-base font-bold leading-snug text-[#0F2744] sm:text-lg"
            >
              {isResubmit
                ? "Nộp lại minh chứng hoàn thiện"
                : "Nộp minh chứng tiến trình"}
            </h3>
            <p
              id={descId}
              className="line-clamp-1 text-xs text-muted-foreground"
            >
              {milestone.tenMoc}
            </p>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            disabled={isUploading}
            aria-label="Đóng hộp thoại nộp minh chứng"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:opacity-40 cursor-pointer"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto p-6"
        >
          {milestone.thuTu === 8 && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/75 p-4 text-amber-950">
              <AlertTriangle
                className="mt-0.5 size-4 shrink-0 text-amber-600"
                aria-hidden="true"
              />
              <div className="space-y-1 text-xs">
                <p className="font-bold">Lưu ý quan trọng cho Mốc 8:</p>
                <p className="leading-relaxed text-amber-900">
                  Mốc này chỉ nộp 01 tệp PDF gộp tất cả bài báo và minh chứng
                  chỉ số WoS/Scopus tương ứng theo danh mục phê duyệt.
                </p>
              </div>
            </div>
          )}

          {!milestone.coTheNop && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50/75 p-3.5 text-xs font-medium text-rose-800"
            >
              <AlertCircle
                className="mt-0.5 size-4 shrink-0 text-rose-600"
                aria-hidden="true"
              />
              <span>
                Mốc này hiện chưa mở quyền nộp minh chứng (`coTheNop = false`).
              </span>
            </div>
          )}

          {/* Vùng tải lên dùng chung PdfUploader (htmlFor + useId, role="button", tabIndex, onKeyDown) */}
          <PdfUploader
            id={fileUploadId}
            label="Tệp minh chứng đính kèm (PDF)"
            required={true}
            selectedFile={selectedFile}
            disabled={isUploading || !milestone.coTheNop}
            error={fileError}
            onFileSelect={(file) => {
              setSelectedFile(file);
              if (file) setFileError(null);
            }}
            onValidationError={(msg) => setFileError(msg)}
            helperText="Chỉ nhận tệp định dạng .PDF • Dung lượng tối đa 15 MB"
          />

          {/* Tiến trình upload dùng chung UploadProgress */}
          {selectedFile && isUploading && (
            <UploadProgress
              fileName={selectedFile.name}
              fileSize={selectedFile.size}
              progress={uploadProgress}
              status={uploadStatus}
              onCancel={handleCancelUpload}
            />
          )}

          {/* Ghi chú NCS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor={noteId}
                className="block text-xs font-semibold text-foreground"
              >
                Ghi chú hoặc tóm tắt nội dung gửi Giáo vụ
              </label>
              <span
                className={`font-mono text-xs tabular-nums ${
                  note.length > MAX_NOTE_LENGTH
                    ? "font-bold text-rose-600"
                    : "text-muted-foreground"
                }`}
              >
                {note.length}/{MAX_NOTE_LENGTH}
              </span>
            </div>

            <textarea
              id={noteId}
              rows={4}
              maxLength={MAX_NOTE_LENGTH}
              value={note}
              disabled={isUploading || !milestone.coTheNop}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú thêm cho Giáo vụ (vd: đã bổ sung chữ ký người hướng dẫn tại trang bìa)..."
              className="w-full resize-none rounded-xl border border-border bg-card p-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:bg-muted/40 sm:text-sm"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:opacity-40 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={
                !selectedFile ||
                isUploading ||
                !milestone.coTheNop ||
                note.length > MAX_NOTE_LENGTH
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#164E9B] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-slate-200 disabled:text-slate-500 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2
                    className="size-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  <span>Đang xử lý ({uploadProgress}%)...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="size-4" aria-hidden="true" />
                  <span>
                    {isResubmit ? "Gửi lại minh chứng" : "Gửi minh chứng"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SubmitEvidenceDialog({
  isOpen,
  ...props
}: SubmitEvidenceDialogProps) {
  if (!isOpen) return null;
  return <SubmitEvidenceDialogInner {...props} />;
}

export default SubmitEvidenceDialog;
