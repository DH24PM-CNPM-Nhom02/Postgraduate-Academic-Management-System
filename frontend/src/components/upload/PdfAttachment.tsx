"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Eye, FileText } from "lucide-react";
import { PdfViewer } from "@/src/components/upload/PdfViewer";
import { useDocumentMetadata, useDownloadDocument } from "@/src/hooks/api/use-documents";
import { DocumentService } from "@/src/services/document";

interface PdfAttachmentProps {
  fileId: string;
  fileName?: string | null;
  title: string;
  fallbackName: string;
}

export function PdfAttachment({ fileId, fileName, title, fallbackName }: PdfAttachmentProps) {
  const { data: metadata } = useDocumentMetadata(fileId);
  const download = useDownloadDocument();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewAttempt, setPreviewAttempt] = useState(0);
  const [preview, setPreview] = useState<{ url: string | null; error: string | null }>({
    url: null,
    error: null,
  });

  const name = metadata?.originalName || fileName || fallbackName;

  useEffect(() => {
    if (!previewOpen) return;

    let cancelled = false;
    let url: string | undefined;

    void DocumentService.createPreviewUrl(fileId).then(({ objectUrl }) => {
      if (cancelled) {
        URL.revokeObjectURL(objectUrl);
        return;
      }

      url = objectUrl;
      setPreview({ url: objectUrl, error: null });
    }).catch((error: unknown) => {
      if (!cancelled) {
        setPreview({
          url: null,
          error: error instanceof Error ? error.message : "Không thể xem tệp PDF.",
        });
      }
    });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [fileId, previewOpen, previewAttempt]);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
    setPreview({ url: null, error: null });
  }, []);

  const downloadPdf = async () => {
    try {
      const blob = await download.mutateAsync(fileId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch {
      // The mutation error is shown under the attachment.
    }
  };

  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2 font-semibold text-slate-700" title={name}>
          <FileText className="size-4 shrink-0 text-[#164E9B]" />
          <span className="truncate">{name}</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-[#164E9B] hover:bg-blue-50"
          >
            <Eye className="size-3.5" /> Xem PDF
          </button>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={download.isPending}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-[#164E9B] hover:bg-blue-50 disabled:opacity-50"
          >
            <Download className="size-3.5" /> {download.isPending ? "Đang tải..." : "Tải PDF"}
          </button>
        </div>
      </div>
      {download.error && <p role="alert" className="text-rose-700">{download.error.message}</p>}
      {previewOpen && createPortal(
        <PdfViewer
          isOpen
          onClose={closePreview}
          title={title}
          fileName={name}
          fileUrl={preview.url}
          isLoading={!preview.url && !preview.error}
          error={preview.error}
          onRetry={() => {
            setPreview({ url: null, error: null });
            setPreviewAttempt((attempt) => attempt + 1);
          }}
        />,
        document.body,
      )}
    </div>
  );
}
