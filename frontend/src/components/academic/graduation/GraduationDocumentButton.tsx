"use client";

import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useDocumentMetadata } from "@/src/hooks/api/use-documents";
import { DocumentService } from "@/src/services/document";
import { GraduationDialog, GraduationLoadError } from "./GraduationDialog";

function GraduationDocumentDialog({ fileId, label, onClose }: {
  fileId: string;
  label: string;
  onClose: () => void;
}) {
  const metadata = useDocumentMetadata(fileId);
  const [attempt, setAttempt] = useState(0);
  const [preview, setPreview] = useState<{ url: string } | { error: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let url: string | undefined;
    void DocumentService.createPreviewUrl(fileId).then(
      ({ objectUrl }) => {
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        url = objectUrl;
        setPreview({ url });
      },
      (error: Error) => {
        if (!cancelled) setPreview({ error: error.message });
      },
    );

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [fileId, attempt]);

  const fileName = metadata.data?.originalName ?? "tai-lieu.pdf";
  return (
    <GraduationDialog title={label} description={metadata.data?.originalName ?? "Tài liệu PDF"} onClose={onClose}>
      <div className="space-y-3 overflow-y-auto p-4">
        {!preview && <p role="status" className="text-sm text-slate-500">Đang tải tài liệu…</p>}
        {preview && "error" in preview && (
          <GraduationLoadError message={preview.error} onRetry={() => {
            setPreview(null);
            setAttempt((current) => current + 1);
          }} />
        )}
        {preview && "url" in preview && (
          <>
            <a href={preview.url} download={fileName} className="text-sm font-semibold text-[#164E9B] hover:underline">
              Tải PDF
            </a>
            <iframe src={preview.url} title={label} className="h-[62dvh] w-full rounded-lg border border-slate-200" />
          </>
        )}
      </div>
    </GraduationDialog>
  );
}

export function GraduationDocumentButton({ fileId, label }: { fileId: string; label: string }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  function closePreview() {
    setOpen(false);
    // Wait until the parent dialog is visible again before focusing its button.
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }

  return (
    <>
      <Button ref={trigger} type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Eye className="size-3.5" />{label}
      </Button>
      {open && <GraduationDocumentDialog fileId={fileId} label={label} onClose={closePreview} />}
    </>
  );
}
