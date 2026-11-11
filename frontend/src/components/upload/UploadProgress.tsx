"use client";

import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import type { UploadProgressProps } from "@/src/types/ui/upload";

function formatFileSize(bytes?: number): string | null {
  if (bytes === undefined || bytes < 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * UploadProgress
 *
 * Hiển thị tiến độ tải lên tệp PDF kèm trạng thái (`uploading` | `success` | `error`)
 * và các hành động hủy / thử lại / gỡ bỏ thông qua callback props.
 */
export function UploadProgress({
  fileName,
  fileSize,
  progress,
  status,
  errorMessage,
  onCancel,
  onRetry,
  onRemove,
  className = "",
}: UploadProgressProps) {
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));
  const formattedSize = formatFileSize(fileSize);

  const statusMeta = {
    uploading: {
      label: "Đang tải lên",
      badgeClass: "border-blue-200 bg-blue-50 text-[#164E9B]",
      barClass: "bg-[#164E9B]",
      borderClass: "border-border bg-card",
    },
    success: {
      label: "Tải lên hoàn tất",
      badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
      barClass: "bg-emerald-600",
      borderClass: "border-emerald-200 bg-emerald-50/30",
    },
    error: {
      label: "Tải lên thất bại",
      badgeClass: "border-rose-200 bg-rose-50 text-rose-800",
      barClass: "bg-rose-600",
      borderClass: "border-rose-200 bg-rose-50/30",
    },
  }[status];

  return (
    <div
      className={`rounded-xl border p-3.5 transition-colors ${statusMeta.borderClass} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-[#164E9B]">
            <FileText className="size-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
              {fileName}
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              {formattedSize && (
                <span className="font-mono tabular-nums">{formattedSize}</span>
              )}
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusMeta.badgeClass}`}
              >
                {status === "uploading" && (
                  <Loader2
                    className="size-3 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                )}
                {status === "success" && (
                  <CheckCircle2 className="size-3" aria-hidden="true" />
                )}
                {status === "error" && (
                  <AlertCircle className="size-3" aria-hidden="true" />
                )}
                <span>{statusMeta.label}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="font-mono text-xs font-bold tabular-nums text-foreground">
            {clampedProgress}%
          </span>

          {status === "uploading" && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              aria-label={`Hủy tải lên ${fileName}`}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
            >
              <X className="size-3.5" aria-hidden="true" />
              <span>Hủy</span>
            </button>
          )}

          {status === "error" && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-rose-200 bg-card px-2.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              <span>Thử lại</span>
            </button>
          )}

          {status !== "uploading" && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Gỡ bỏ ${fileName}`}
              className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Thanh tiến trình chuẩn ARIA */}
      <div
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Tiến độ tải lên ${fileName}`}
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={`h-full rounded-full transition-all duration-200 motion-reduce:transition-none ${statusMeta.barClass}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      {status === "error" && errorMessage && (
        <p
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-700"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
}

export default UploadProgress;
