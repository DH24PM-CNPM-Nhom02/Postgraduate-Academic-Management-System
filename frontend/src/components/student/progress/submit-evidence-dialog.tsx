"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import {
  X,
  UploadCloud,
  AlertCircle,
  AlertTriangle,
  Trash2,
  Loader2,
  FileCheck,
  RefreshCw,
} from "lucide-react";
import { MilestoneProgressItem } from "@/src/types/progress";

interface SubmitEvidenceDialogProps {
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

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_NOTE_LENGTH = 500;

export function SubmitEvidenceDialog({
  isOpen,
  onClose,
  milestone,
  lanNopTiepTheo,
  onSubmitSuccess,
}: SubmitEvidenceDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [persistedFileId, setPersistedFileId] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDuplicateFileError, setIsDuplicateFileError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [note, setNote] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const titleId = useId();
  const descId = useId();

  const nextLanNop =
    lanNopTiepTheo ||
    (milestone.lichSuMinhChung && milestone.lichSuMinhChung.length > 0
      ? milestone.lichSuMinhChung.length + 1
      : 1);

  // Dọn dẹp timer upload khi unmount
  useEffect(() => {
    return () => {
      if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    };
  }, []);

  const handleDismiss = () => {
    if (isUploading) return;
    setSelectedFile(null);
    setPersistedFileId(null);
    setFileError(null);
    setSubmitError(null);
    setIsDuplicateFileError(false);
    setIsDragging(false);
    setNote("");
    setUploadProgress(0);
    onClose();
  };

  if (!isOpen) return null;

  // Format kích thước file hiển thị thân thiện
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Validate file chọn
  const validateAndSetFile = (file: File) => {
    setFileError(null);
    setSubmitError(null);
    setIsDuplicateFileError(false);

    // Kiểm tra định dạng (phải là PDF)
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setFileError("Định dạng không hợp lệ. Hệ thống chỉ chấp nhận tệp tin định dạng .PDF.");
      setSelectedFile(null);
      setPersistedFileId(null);
      return false;
    }

    // Kiểm tra dung lượng (≤ 15MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(
        `Dung lượng tệp (${formatFileSize(file.size)}) vượt quá giới hạn cho phép tối đa 15MB.`
      );
      setSelectedFile(null);
      setPersistedFileId(null);
      return false;
    }

    setSelectedFile(file);
    // Khởi tạo fileId tạm thời được lưu giữ lại khi submit lỗi
    setPersistedFileId(`file-${Date.now()}`);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPersistedFileId(null);
    setFileError(null);
    setSubmitError(null);
    setIsDuplicateFileError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setUploadProgress(15);
    setSubmitError(null);

    // Giả lập tiến trình upload
    let current = 15;
    uploadTimerRef.current = setInterval(() => {
      current += Math.floor(Math.random() * 20) + 15;
      if (current >= 95) {
        current = 95;
        if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
      }
      setUploadProgress(current);
    }, 180);

    // Hoàn tất giả lập sau 1.1s
    setTimeout(() => {
      if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        if (onSubmitSuccess && selectedFile) {
          onSubmitSuccess({
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            ghiChuNcs: note.trim(),
            lanNop: nextLanNop,
            fileId: persistedFileId || undefined,
          });
        }
        handleDismiss();
      }, 400);
    }, 1100);
  };

  const isResubmit = milestone.trangThai === "REJECTED";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleDismiss}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Dialog */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">
                Mốc {milestone.thuTu}
              </span>
              {isResubmit && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/60 font-mono">
                  Nộp lại (Lần {nextLanNop})
                </span>
              )}
            </div>
            <h3 id={titleId} className="text-lg font-bold text-slate-900 leading-tight">
              {isResubmit ? "Nộp lại minh chứng hoàn thiện" : "Nộp minh chứng tiến trình"}
            </h3>
            <p id={descId} className="text-xs text-slate-500 mt-1 line-clamp-1">
              {milestone.tenMoc}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            disabled={isUploading}
            aria-label="Đóng hộp thoại"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Cảnh báo đặc thù cho Mốc 8 */}
          {milestone.thuTu === 8 && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-amber-950">
                  Lưu ý quan trọng cho Mốc 8:
                </p>
                <p className="text-amber-800 leading-relaxed font-normal">
                  Lưu ý: Mốc này chỉ nộp 01 file PDF gộp tất cả bài báo và minh chứng chỉ số
                  WoS/Scopus tương ứng theo danh mục phê duyệt.
                </p>
              </div>
            </div>
          )}

          {/* Vùng tải lên / Kéo thả tệp PDF */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-800 tracking-tight">
              Tệp minh chứng đính kèm (PDF) <span className="text-rose-500">*</span>
            </label>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-50/50 scale-[1.01]"
                    : fileError
                    ? "border-rose-300 bg-rose-50/30 hover:border-rose-400"
                    : "border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                    isDragging
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-white text-slate-600 shadow-xs border border-slate-200"
                  }`}
                >
                  <UploadCloud className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-800">
                    Kéo và thả tệp PDF vào đây, hoặc{" "}
                    <span className="text-emerald-700 underline font-semibold">
                      chọn từ máy tính
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Chỉ nhận tệp định dạng .PDF • Dung lượng tối đa: 15 MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {formatFileSize(selectedFile.size)} • PDF Document
                      {persistedFileId && (
                        <span className="ml-2 text-emerald-600">• Đã lưu bộ đệm</span>
                      )}
                    </p>
                  </div>
                </div>

                {!isUploading && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    aria-label="Xóa tệp đã chọn"
                    title="Chọn lại tệp khác"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {fileError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 pt-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {submitError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{submitError}</p>
                  {!isDuplicateFileError && selectedFile && (
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      Tệp tin đã được lưu trong bộ đệm tạm thời. Bạn có thể nhấn &ldquo;Thử lại&rdquo; bên dưới mà không cần tải lại tệp.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Textarea Ghi chú kèm bộ đếm */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="ghiChuNcs"
                className="block text-xs font-semibold text-slate-800"
              >
                Ghi chú hoặc tóm tắt nội dung gửi Giáo vụ
              </label>
              <span
                className={`text-[11px] font-mono tabular-nums ${
                  note.length > MAX_NOTE_LENGTH
                    ? "text-rose-600 font-bold"
                    : "text-slate-400"
                }`}
              >
                {note.length}/{MAX_NOTE_LENGTH}
              </span>
            </div>

            <textarea
              id="ghiChuNcs"
              rows={4}
              maxLength={MAX_NOTE_LENGTH}
              value={note}
              disabled={isUploading}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú thêm cho Giáo vụ (ví dụ: đã bổ sung chữ ký người hướng dẫn tại trang bìa, đính kèm kết quả đánh giá)..."
              className="w-full text-xs text-slate-900 bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder:text-slate-400 transition-all resize-none disabled:bg-slate-50"
            />
          </div>

          {/* Thanh hiển thị tiến độ upload giả lập */}
          {isUploading && (
            <div className="space-y-2 pt-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  Đang tải lên hệ thống lưu trữ an toàn...
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  {uploadProgress}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleDismiss}
              disabled={isUploading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors disabled:opacity-40"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading || note.length > MAX_NOTE_LENGTH}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs font-semibold shadow-xs shadow-emerald-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang xử lý ({uploadProgress}%)...</span>
                </>
              ) : submitError && !isDuplicateFileError ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Thử lại</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>{isResubmit ? "Gửi lại minh chứng" : "Gửi minh chứng"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
