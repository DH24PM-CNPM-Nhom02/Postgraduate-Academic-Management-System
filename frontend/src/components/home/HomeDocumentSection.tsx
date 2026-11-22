"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicDocumentList } from "@/src/components/shared/PublicDocumentList";
import { usePublicDocuments } from "@/src/hooks/api/use-documents";
import type { PublicDocumentType } from "@/src/types/api/document";

const LATEST_DOCUMENT_COUNT = 4;

export function HomeDocumentSection({
  id,
  documentType,
  title,
  href,
  emptyMessage,
}: {
  id: string;
  documentType: PublicDocumentType;
  title: string;
  href: string;
  emptyMessage: string;
}) {
  const { data = [], isPending, isError, refetch } = usePublicDocuments(documentType);

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="min-w-0 scroll-mt-24 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2 id={`${id}-title`} className="text-2xl font-bold tracking-tight text-[#0F2744]">{title}</h2>
        <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#164E9B] hover:underline">
          Xem tất cả
          <span className="sr-only"> {title}</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <PublicDocumentList
        documents={data.slice(0, LATEST_DOCUMENT_COUNT)}
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        emptyMessage={emptyMessage}
      />
    </section>
  );
}
