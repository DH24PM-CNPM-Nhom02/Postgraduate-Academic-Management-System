"use client";

import React, { useId, useRef, useState } from "react";
import {
  AlertCircle,
  FileCheck2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import type { PdfUploaderProps } from "@/src/types/ui/upload";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * PdfUploader
 *
 * Vùng tải lên tài liệu PDF dùng chung (kéo-thả hoặc chọn tệp từ thiết bị).
 * Kiểm tra định dạng .pdf và dung lượng tối đa (mặc định 15MB) ở phía client
 * trước khi trả File hợp lệ qua callback `onFileSelect`.
 */
export function PdfUploader({
  id,
  label = "Tài liệu đính kèm (PDF)",
  required = false,
  selectedFile = null,
  maxSizeMb = 15,
  onFileSelect,
  onValidationError,
  error = null,
  disabled = false,
  helperText,
  className = "",
}: PdfUploaderProps) {
  const generatedId = useId();
  const inputId = id || `${generatedId}-pdf-input`;
  const labelId = `${inputId}-label`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const activeError = error ?? internalError;
  const maxBytes = maxSizeMb * 1024 * 1024;

  const setValidationMessage = (msg: string | null) => {
    setInternalError(msg);
    onValidationError?.(msg);
  };

  const validateAndSelect = (file: File | undefined | null) => {
    if (!file || disabled) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setValidationMessage(
        "Định dạng không hợp lệ. Hệ thống chỉ chấp nhận tệp tin định dạng .PDF."
      );
      onFileSelect(null);
      return;
    }

    if (file.size === 0) {
      setValidationMessage(
        "Tệp PDF rỗng (0 byte). Vui lòng kiểm tra lại tài liệu trước khi tải lên."
      );
      onFileSelect(null);
      return;
    }

    if (file.size > maxBytes) {
      setValidationMessage(
        `Dung lượng tệp (${formatFileSize(file.size)}) vượt quá giới hạn tối đa ${maxSizeMb} MB.`
      );
      onFileSelect(null);
      return;
    }

    setValidationMessage(null);
    onFileSelect(file);
  };

  const openFilePicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFilePicker();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSelect(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    validateAndSelect(file);
  };

  const handleClearFile = () => {
    if (disabled) return;
    setValidationMessage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFileSelect(null);
  };

  const describedBy = [helperText ? helperId : "", activeError ? errorId : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        id={labelId}
        htmlFor={inputId}
        className="block text-xs font-semibold text-foreground"
      >
        {label}
        {required && (
          <span className="ml-1 text-rose-600" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="application/pdf,.pdf"
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
      />

      {!selectedFile ? (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-labelledby={labelId}
          aria-describedby={describedBy || undefined}
          onClick={openFilePicker}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed p-6 text-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 ${
            disabled
              ? "cursor-not-allowed border-border bg-muted/40 opacity-60"
              : isDragging
              ? "cursor-pointer border-[#164E9B] bg-blue-50/70"
              : activeError
              ? "cursor-pointer border-rose-300 bg-rose-50/40 hover:border-rose-400"
              : "cursor-pointer border-border bg-muted/30 hover:border-[#164E9B]/60 hover:bg-blue-50/30"
          }`}
        >
          <div
            className={`flex size-11 items-center justify-center rounded-xl border transition-colors ${
              isDragging
                ? "border-blue-200 bg-blue-100 text-[#164E9B]"
                : "border-border bg-card text-muted-foreground group-hover:border-blue-200 group-hover:text-[#164E9B]"
            }`}
          >
            <UploadCloud className="size-5" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Kéo và thả tệp PDF vào đây, hoặc{" "}
              <span className="font-semibold text-[#164E9B] underline underline-offset-2">
                chọn từ máy tính
              </span>
            </p>
            <p
              id={helperId}
              className="text-xs text-muted-foreground"
            >
              {helperText ||
                `Chỉ nhận tệp định dạng .PDF • Dung lượng tối đa ${maxSizeMb} MB`}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-card text-emerald-700">
              <FileCheck2 className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {selectedFile.name}
              </p>
              <p className="font-mono text-xs tabular-nums text-muted-foreground">
                {formatFileSize(selectedFile.size)} • PDF
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              disabled={disabled}
              onClick={openFilePicker}
              className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
              Đổi tệp
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={handleClearFile}
              aria-label="Xóa tệp đã chọn"
              title="Xóa tệp đã chọn"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {activeError && (
        <div
          id={errorId}
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50/70 px-3 py-2 text-xs font-medium text-rose-800"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden="true" />
          <span>{activeError}</span>
        </div>
      )}
    </div>
  );
}

export default PdfUploader;
