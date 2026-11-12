"use client";

import React, { useState } from "react";
import { AlertCircle, Eye } from "lucide-react";
import { PdfViewer } from "@/src/components/upload/PdfViewer";

export interface DocumentViewButtonProps {
  fileId: string;
  fileName: string;
  fileUrl?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "sm" | "default";
  showLabel?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * DocumentViewButton
 *
 * Nút mở trình xem trước PDF dùng chung (`PdfViewer`), thay thế modal tự dựng
 * trước đây. Hỗ trợ `Escape`, Loading/Empty/Error và xem mô phỏng cho dữ liệu mẫu.
 */
export function DocumentViewButton({
  fileId,
  fileName,
  fileUrl,
  variant = "outline",
  size = "sm",
  showLabel = true,
  error = null,
  className = "",
}: DocumentViewButtonProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const resolvedError = error ?? localError;
  const resolvedUrl =
    fileUrl || `mock://minh-chung/${encodeURIComponent(fileId)}/${encodeURIComponent(fileName)}`;

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!fileName && !fileUrl) {
      setLocalError("Không tìm thấy thông tin tệp minh chứng để hiển thị.");
    } else {
      setLocalError(null);
    }
    setIsPreviewOpen(true);
  };

  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

  const sizeStyles =
    size === "sm"
      ? "min-h-9 px-3 py-1.5 rounded-lg text-xs gap-1.5"
      : "min-h-10 px-4 py-2 rounded-xl text-xs gap-2 sm:text-sm";

  const variantStyles = {
    default: "bg-[#164E9B] text-white hover:bg-[#113E7D]",
    outline:
      "border border-border bg-card text-foreground hover:bg-muted",
    ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
    link: "text-[#164E9B] hover:underline p-0 min-h-0 h-auto",
  }[variant];

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleOpen}
        aria-label={`Xem minh chứng ${fileName}`}
        title={`Xem tài liệu: ${fileName}`}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      >
        <Eye
          className={`size-3.5 ${
            variant === "default" ? "text-white" : "text-[#164E9B]"
          }`}
          aria-hidden="true"
        />
        {showLabel && <span>Xem minh chứng</span>}
      </button>

      {resolvedError && !isPreviewOpen && (
        <span
          role="alert"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600"
        >
          <AlertCircle className="size-3" aria-hidden="true" />
          <span>{resolvedError}</span>
        </span>
      )}

      <PdfViewer
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileUrl={resolvedUrl}
        fileName={fileName}
        title={fileName || "Xem minh chứng PDF"}
        subtitle={`Mã tài liệu: ${fileId} • Định dạng PDF`}
        error={resolvedError}
        onRetry={() => setLocalError(null)}
        allowDownload={true}
      />
    </div>
  );
}

export default DocumentViewButton;
