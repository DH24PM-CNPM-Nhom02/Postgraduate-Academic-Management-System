"use client";

import React, { useEffect, useId, useRef } from "react";
import {
  AlertCircle,
  Download,
  ExternalLink,
  FileText,
  FileX2,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";
import type { PdfViewerProps } from "@/src/types/ui/upload";

function createPreviewBlobDownload(fileName: string, title: string, subtitle?: string) {
  const safeName = fileName || "tai-lieu-hoc-vu.pdf";
  const content =
    `%PDF-1.4\n` +
    `% ${title}\n` +
    `% ${subtitle || "Truong Dai hoc An Giang - DHQG-HCM"}\n` +
    `1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n` +
    `2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n` +
    `3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\n` +
    `xref\n0 4\n0000000000 65535 f \n0000000018 00000 n \n0000000063 00000 n \n0000000115 00000 n \n` +
    `trailer<</Size 4/Root 1 0 R>>\nstartxref\n193\n%%EOF`;

  const blob = new Blob([content], { type: "application/pdf" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = safeName;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

/**
 * PdfViewer
 *
 * Modal xem trước tài liệu PDF thuần UI (không phụ thuộc thư viện ngoài).
 * Hỗ trợ đóng bằng phím Escape, khóa cuộn nền, trả focus khi đóng,
 * và đầy đủ trạng thái Loading / Empty / Error.
 */
export function PdfViewer({
  isOpen,
  onClose,
  fileUrl,
  fileName = "tai-lieu.pdf",
  title = "Xem trước tài liệu PDF",
  subtitle,
  isLoading = false,
  error = null,
  onRetry,
  allowDownload = true,
  className = "",
}: PdfViewerProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMockUrl = Boolean(fileUrl && fileUrl.startsWith("mock://"));
  const resolvedIframeSrc =
    fileUrl && !isMockUrl
      ? allowDownload
        ? fileUrl
        : `${fileUrl}${fileUrl.includes("#") ? "&" : "#"}toolbar=0&navpanes=0`
      : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-xs transition-opacity duration-150 ${
        !allowDownload ? "print:hidden" : ""
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl ${className}`}
      >
        {/* Header thanh công cụ */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-[#164E9B]">
              <FileText className="size-4.5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2
                id={titleId}
                className="truncate text-sm font-bold text-[#0F2744]"
              >
                {title}
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                {subtitle ? `${subtitle} • ${fileName}` : fileName}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {allowDownload && fileUrl && !isLoading && !error && (
              <>
                {isMockUrl ? (
                  <button
                    type="button"
                    onClick={() =>
                      createPreviewBlobDownload(fileName, title, subtitle)
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
                  >
                    <Download className="size-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Tải PDF</span>
                  </button>
                ) : (
                  <>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
                    >
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">Mở tab mới</span>
                    </a>
                    <a
                      href={fileUrl}
                      download={fileName}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#164E9B] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2"
                    >
                      <Download className="size-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">Tải xuống</span>
                    </a>
                  </>
                )}
              </>
            )}

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Đóng trình xem tài liệu"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
            >
              <X className="size-4.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Nội dung trình xem PDF */}
        <div className="flex-1 overflow-y-auto bg-muted/50 p-4 sm:p-6">
          {isLoading ? (
            <div
              aria-busy="true"
              aria-label="Đang tải tài liệu PDF"
              className="mx-auto flex h-[56vh] max-w-2xl flex-col justify-between rounded-xl border border-border bg-card p-8 animate-pulse motion-reduce:animate-none"
            >
              <div className="space-y-3">
                <div className="mx-auto h-4 w-52 rounded bg-muted" />
                <div className="mx-auto h-5 w-72 rounded bg-muted" />
              </div>
              <div className="space-y-3">
                <div className="h-3.5 w-full rounded bg-muted" />
                <div className="h-3.5 w-11/12 rounded bg-muted" />
                <div className="h-3.5 w-4/5 rounded bg-muted" />
                <div className="h-3.5 w-9/12 rounded bg-muted" />
              </div>
              <div className="h-10 w-40 rounded-lg bg-muted" />
            </div>
          ) : error ? (
            <div
              role="alert"
              className="mx-auto flex min-h-[40vh] max-w-md flex-col items-center justify-center gap-3 rounded-xl border border-rose-200 bg-card p-8 text-center"
            >
              <div className="flex size-12 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700">
                <AlertCircle className="size-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  Không thể tải tài liệu PDF
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {error}
                </p>
              </div>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#164E9B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" />
                  <span>Thử lại</span>
                </button>
              )}
            </div>
          ) : !fileUrl ? (
            <div className="mx-auto flex min-h-[40vh] max-w-md flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <FileX2 className="size-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  Chưa có tệp tài liệu để hiển thị
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Tệp PDF quyết định hoặc minh chứng hiện chưa được đính kèm trên hệ thống.
                </p>
              </div>
            </div>
          ) : resolvedIframeSrc ? (
            <iframe
              src={resolvedIframeSrc}
              title={title}
              className="h-[64vh] w-full rounded-xl border border-border bg-white"
            />
          ) : (
            /* Chế độ xem trước văn bản học vụ chuẩn hóa khi dùng mock:// URI */
            <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10">
              <div className="border-b border-border pb-5 text-center">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Đại học Quốc gia TP. Hồ Chí Minh
                </p>
                <p className="mt-0.5 text-xs font-extrabold uppercase text-[#0F2744]">
                  Trường Đại học An Giang • Phòng Đào tạo Sau Đại học
                </p>
                <h3 className="mt-4 text-base font-bold text-[#164E9B]">
                  {title}
                </h3>
                {subtitle && (
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>

              <div className="my-6 space-y-3 text-xs leading-relaxed text-foreground">
                <p>
                  Tài liệu lưu trữ chính thức trên hệ thống Quản lý Đào tạo Sau Đại học
                  Trường Đại học An Giang (AGU).
                </p>
                <div className="rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs space-y-1.5">
                  <p>
                    <span className="text-muted-foreground">Tên tệp:</span>{" "}
                    <span className="font-semibold text-foreground">{fileName}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Định danh nguồn:</span>{" "}
                    <span className="text-foreground">{fileUrl}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Chế độ truy cập:</span>{" "}
                    <span className="text-foreground">
                      {allowDownload
                        ? "Cho phép xem và tải bản sao lưu"
                        : "Chỉ xem trực tiếp (Bảo mật phản biện kín)"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  <span>Văn bản đã được xác thực lưu trữ số</span>
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 items-center rounded-lg bg-[#164E9B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
                >
                  Đóng xem trước
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PdfViewer;
