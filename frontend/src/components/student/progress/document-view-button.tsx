"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, Eye } from "lucide-react";
import { PdfViewer } from "@/src/components/upload/PdfViewer";
import { useDocumentPreviewUrl } from "@/src/hooks/api/use-documents";

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
 * Nút mở trình xem trước PDF dùng chung (`PdfViewer`).
 * Khi dùng với dữ liệu thật (chưa có `fileUrl` trực tiếp), component sẽ tự tải PDF
 * kèm Bearer Token qua `useDocumentPreviewUrl` (`GET /documents/:id/download`)
 * và tự giải phóng `blob:` URL khi đóng modal để tránh rò rỉ bộ nhớ.
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
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const objectUrlRef = useRef<string | null>(null);
  const isOpenRef = useRef(false);
  const requestIdRef = useRef(0);

  const previewMutation = useDocumentPreviewUrl();

  const revokeCurrentObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setObjectUrl(null);
  };

  useEffect(() => {
    return () => {
      isOpenRef.current = false;
      requestIdRef.current += 1;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const fetchRealPreview = async () => {
    if (!fileId) {
      setLocalError("Không tìm thấy mã tài liệu để hiển thị.");
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    setLocalError(null);
    revokeCurrentObjectUrl();

    try {
      const result = await previewMutation.mutateAsync(fileId);
      // Nếu người dùng đã đóng popup hoặc bấm lại trước khi tải xong -> giải phóng Blob ngay
      if (!isOpenRef.current || currentRequestId !== requestIdRef.current) {
        URL.revokeObjectURL(result.objectUrl);
        return;
      }
      objectUrlRef.current = result.objectUrl;
      setObjectUrl(result.objectUrl);
    } catch {
      // Thông báo lỗi đã chuẩn hóa nằm trong `previewMutation.error`
    }
  };

  const resolvedError =
    error ?? localError ?? previewMutation.error?.message ?? null;
  const resolvedUrl = fileUrl || objectUrl;

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    isOpenRef.current = true;
    setIsPreviewOpen(true);

    if (fileUrl) {
      if (!fileName && !fileUrl) {
        setLocalError("Không tìm thấy thông tin tệp minh chứng để hiển thị.");
      } else {
        setLocalError(null);
      }
      return;
    }

    void fetchRealPreview();
  };

  const handleClose = () => {
    isOpenRef.current = false;
    requestIdRef.current += 1;
    setIsPreviewOpen(false);
    setLocalError(null);
    previewMutation.reset();
    revokeCurrentObjectUrl();
  };

  const handleRetry = () => {
    setLocalError(null);
    if (!fileUrl) {
      void fetchRealPreview();
    }
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
        onClose={handleClose}
        fileUrl={resolvedUrl}
        fileName={fileName}
        title={fileName || "Xem minh chứng PDF"}
        subtitle={`Mã tài liệu: ${fileId} • Định dạng PDF`}
        isLoading={!fileUrl && previewMutation.isPending}
        error={resolvedError}
        onRetry={handleRetry}
        allowDownload={true}
      />
    </div>
  );
}

export default DocumentViewButton;
