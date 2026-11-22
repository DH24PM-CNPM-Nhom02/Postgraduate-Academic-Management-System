"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, FileText, LoaderCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { PdfViewer } from "@/src/components/upload/PdfViewer";
import { formatDate, formatFileSize } from "@/src/lib/utils";
import { DocumentService } from "@/src/services/document";
import type { DocumentListItem } from "@/src/types/api/document";

type PublicDocumentListProps = {
  documents: DocumentListItem[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  emptyMessage: string;
};

export function PublicDocumentList({
  documents,
  isPending,
  isError,
  onRetry,
  emptyMessage,
}: PublicDocumentListProps) {
  const [selected, setSelected] = useState<DocumentListItem | null>(null);
  const closePreview = useCallback(() => setSelected(null), []);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
      {isPending ? (
        <div role="status" className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-slate-600">
          <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          Đang tải danh sách tài liệu…
        </div>
      ) : isError ? (
        <div className="space-y-3 px-4 py-8 text-center">
          <p role="alert" className="text-sm text-slate-700">Không thể tải danh sách tài liệu.</p>
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>Thử lại</Button>
        </div>
      ) : documents.length === 0 ? (
        <p role="status" className="px-4 py-10 text-center text-sm text-slate-600">{emptyMessage}</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {documents.map((document) => (
            <li key={document.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5">
              <span className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#164E9B] sm:flex">
                <FileText className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="wrap-break-word font-semibold text-slate-900">
                  {document.originalName}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  PDF · {formatFileSize(document.size)} · <time dateTime={document.createdAt}>{formatDate(document.createdAt)}</time>
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 text-[#164E9B]"
                aria-label={`Xem PDF ${document.originalName}`}
                onClick={() => setSelected(document)}
              >
                <Eye aria-hidden="true" />
                <span className="hidden sm:inline">Xem PDF</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
      {selected && <PublicDocumentPreview document={selected} onClose={closePreview} />}
    </div>
  );
}

function PublicDocumentPreview({
  document: file,
  onClose,
}: {
  document: DocumentListItem;
  onClose: () => void;
}) {
  const [preview, setPreview] = useState<{ url: string } | { error: string } | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let url: string | undefined;

    DocumentService.downloadPublicBlob(file.id, controller.signal)
      .then((blob) => {
        if (controller.signal.aborted) return;
        url = URL.createObjectURL(blob);
        setPreview({ url });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setPreview({ error: error instanceof Error ? error.message : "Vui lòng thử lại." });
      });

    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [file.id, attempt]);

  return createPortal(
    <PdfViewer
      isOpen
      onClose={onClose}
      fileName={file.originalName}
      fileUrl={preview && "url" in preview ? preview.url : null}
      isLoading={preview === null}
      error={preview && "error" in preview ? preview.error : null}
      onRetry={() => {
        setPreview(null);
        setAttempt((value) => value + 1);
      }}
    />,
    document.body,
  );
}
