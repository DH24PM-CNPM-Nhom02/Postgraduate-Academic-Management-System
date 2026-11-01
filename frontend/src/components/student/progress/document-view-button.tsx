"use client";

import React, { useState } from "react";
import { Eye, Loader2, FileText, ExternalLink, X, ShieldCheck } from "lucide-react";

interface DocumentViewButtonProps {
  fileId: string;
  fileName: string;
  fileUrl?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "sm" | "default";
  showLabel?: boolean;
  className?: string;
}

export function DocumentViewButton({
  fileId,
  fileName,
  fileUrl,
  variant = "outline",
  size = "sm",
  showLabel = true,
  className = "",
}: DocumentViewButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRenderingContent, setIsRenderingContent] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(fileUrl || null);

  const handleView = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (previewBlobUrl) {
      setIsPreviewOpen(true);
      setIsRenderingContent(true);
      setTimeout(() => setIsRenderingContent(false), 300);
      return;
    }

    try {
      setIsLoading(true);

      // Mô phỏng fetch tài liệu với Bearer token và tạo URL.createObjectURL
      await new Promise((resolve) => setTimeout(resolve, 550));

      const sampleBlob = new Blob(
        [
          `%PDF-1.4\n% Minh chứng tiến trình đào tạo NCS: ${fileName}\n` +
            `% File ID: ${fileId}\n` +
            `1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n` +
            `2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n` +
            `3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\n` +
            `xref\n0 4\n0000000000 65535 f \n0000000018 00000 n \n0000000063 00000 n \n0000000115 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n193\n%%EOF`,
        ],
        { type: "application/pdf" }
      );

      const objectUrl = URL.createObjectURL(sampleBlob);
      setPreviewBlobUrl(objectUrl);
      setIsPreviewOpen(true);
      setIsRenderingContent(true);
      setTimeout(() => setIsRenderingContent(false), 300);
    } catch (err) {
      console.error("Lỗi khi tải tài liệu:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

  const sizeStyles =
    size === "sm"
      ? "text-xs px-2.5 py-1.5 rounded-lg gap-1.5"
      : "text-sm px-3.5 py-2 rounded-xl gap-2";

  const variantStyles = {
    default:
      "bg-slate-900 text-white hover:bg-slate-800 shadow-2xs active:scale-[0.98]",
    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs active:scale-[0.98]",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
    link: "text-emerald-700 hover:text-emerald-800 hover:underline p-0 h-auto",
  }[variant];

  return (
    <>
      <button
        type="button"
        onClick={handleView}
        disabled={isLoading}
        aria-label={`Xem minh chứng ${fileName}`}
        title={`Xem tài liệu: ${fileName}`}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className} ${
          isLoading ? "animate-pulse" : ""
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
        ) : (
          <Eye className="w-3.5 h-3.5 text-slate-500 transition-colors group-hover:text-slate-700" />
        )}
        {showLabel && (
          <span>{isLoading ? "Đang mở..." : "Xem minh chứng"}</span>
        )}
      </button>

      {/* Modal xem trước tài liệu PDF với hiệu ứng chuyển động mượt mà */}
      {isPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {fileName}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Mã tài liệu: {fileId} • Định dạng PDF
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {previewBlobUrl && (
                  <a
                    href={previewBlobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở tab mới</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors"
                  aria-label="Đóng cửa sổ xem trước"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Nội dung PDF preview container kèm skeleton khi đang render */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-100/60 flex flex-col items-center justify-center min-h-[360px]">
              {isRenderingContent ? (
                /* Skeleton loader trang nhã khi khởi tạo nội dung file */
                <div className="w-full max-w-xl bg-white rounded-2xl p-8 space-y-4 shadow-xs border border-slate-200 animate-pulse">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 mx-auto" />
                  <div className="h-5 w-48 bg-slate-200 rounded-md mx-auto" />
                  <div className="h-4 w-72 bg-slate-100 rounded-md mx-auto" />
                  <div className="h-20 w-full bg-slate-50 rounded-xl mt-4" />
                </div>
              ) : (
                <div className="w-full max-w-xl bg-white rounded-2xl shadow-xs border border-slate-200 p-8 text-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-2xs">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-semibold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Tài liệu đã xác thực
                    </div>
                    <h4 className="text-base font-semibold text-slate-900">
                      Bản xem trước minh chứng tiến trình
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Tệp minh chứng đã được tải an toàn từ kho lưu trữ số của Trường Đại học An Giang.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-600 text-left space-y-1.5 border border-slate-200/60 font-mono">
                    <p>
                      <span className="text-slate-400">Tệp tin:</span> {fileName}
                    </p>
                    <p>
                      <span className="text-slate-400">Trạng thái:</span> Sẵn sàng xem trực tiếp hoặc tải về
                    </p>
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    {previewBlobUrl && (
                      <a
                        href={previewBlobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Xem toàn màn hình
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(false)}
                      className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-700 rounded-xl text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
