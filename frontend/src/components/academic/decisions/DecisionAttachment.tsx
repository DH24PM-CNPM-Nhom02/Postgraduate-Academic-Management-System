"use client";

import { PdfAttachment } from "@/src/components/upload/PdfAttachment";

interface DecisionAttachmentProps {
  fileId: string;
  fileName?: string | null;
  decisionNumber: string;
}

export function DecisionAttachment({ fileId, fileName, decisionNumber }: DecisionAttachmentProps) {
  return (
    <PdfAttachment
      fileId={fileId}
      fileName={fileName}
      title={`Quyết định ${decisionNumber}`}
      fallbackName={`Quyet_dinh_${decisionNumber.replace(/[/\\]/g, "_")}.pdf`}
    />
  );
}
