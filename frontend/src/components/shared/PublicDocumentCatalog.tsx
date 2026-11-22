"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { usePublicDocuments } from "@/src/hooks/api/use-documents";
import type { PublicDocumentType } from "@/src/types/api/document";
import { PublicDocumentList } from "./PublicDocumentList";

export interface DocumentCatalogNavigation {
  backHref?: string;
  backLabel?: string;
}

type PublicDocumentCatalogProps = DocumentCatalogNavigation & {
  documentType: PublicDocumentType;
  title: string;
  description: string;
  emptyMessage: string;
};

export function PublicDocumentCatalog({
  backHref = "/",
  backLabel = "Trang chủ",
  title,
  description,
  documentType,
  emptyMessage,
}: PublicDocumentCatalogProps) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <header className="space-y-3 border-b border-slate-200 pb-5">
        <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-semibold text-[#164E9B] hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {backLabel}
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2744] sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
      </header>

      <Suspense fallback={<p role="status" className="text-sm text-slate-600">Đang tải danh sách tài liệu…</p>}>
        <CatalogSearch documentType={documentType} emptyMessage={emptyMessage} />
      </Suspense>
    </div>
  );
}

type CatalogSearchProps = Pick<PublicDocumentCatalogProps, "documentType" | "emptyMessage">;

function CatalogSearch(props: CatalogSearchProps) {
  const initialSearch = useSearchParams().get("search") ?? "";
  return <CatalogResults key={initialSearch} initialSearch={initialSearch} {...props} />;
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d");
}

function CatalogResults({
  documentType,
  emptyMessage,
  initialSearch,
}: CatalogSearchProps & { initialSearch: string }) {
  const [search, setSearch] = useState(initialSearch);
  const { data = [], isPending, isError, refetch } = usePublicDocuments(documentType);
  const keyword = normalizeSearch(search);
  const documents = keyword
    ? data.filter(({ originalName }) => normalizeSearch(originalName).includes(keyword))
    : data;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <Input
            type="search"
            aria-label="Tìm theo tên tài liệu"
            placeholder="Tìm theo tên tài liệu"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 bg-white pl-9"
          />
        </div>
        {!isPending && !isError && (
          <p className="text-sm text-slate-600" aria-live="polite">{documents.length} tài liệu</p>
        )}
      </div>
      <PublicDocumentList
        documents={documents}
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        emptyMessage={keyword && data.length ? "Không tìm thấy tài liệu phù hợp." : emptyMessage}
      />
    </div>
  );
}
