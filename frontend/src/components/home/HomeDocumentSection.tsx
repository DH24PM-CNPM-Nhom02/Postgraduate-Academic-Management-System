"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList } from "lucide-react";
import { PublicDocumentList } from "@/src/components/shared/PublicDocumentList";
import { usePublicDocuments } from "@/src/hooks/api/use-documents";

const DOCUMENT_SECTIONS = [
  {
    type: "BIEU_MAU",
    title: "Biểu mẫu học vụ",
    href: "/forms",
    linkLabel: "Tất cả biểu mẫu",
    emptyMessage: "Chưa có biểu mẫu học vụ.",
    icon: ClipboardList,
  },
  {
    type: "QUY_DINH",
    title: "Quy định & Quy chế",
    href: "/regulations",
    linkLabel: "Tất cả quy chế",
    emptyMessage: "Chưa có văn bản quy định, quy chế.",
    icon: BookOpen,
  },
] as const;

const PREVIEW_LIMIT = 4;

function HomeDocumentPreview({ section }: { section: (typeof DOCUMENT_SECTIONS)[number] }) {
  const { data = [], isPending, isError, refetch } = usePublicDocuments(section.type);
  const Icon = section.icon;

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Icon className="size-5 text-[#164E9B]" aria-hidden="true" />
          {section.title}
        </h3>
        <Link href={section.href} className="inline-flex items-center gap-1 text-xs font-bold text-[#164E9B] hover:underline">
          {section.linkLabel}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
      <PublicDocumentList
        documents={data.slice(0, PREVIEW_LIMIT)}
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        emptyMessage={section.emptyMessage}
      />
    </div>
  );
}

export function HomeDocumentSection() {
  return (
    <section id="documents" aria-labelledby="home-documents-heading" className="scroll-mt-24 space-y-6 pt-4">
      <h2 id="home-documents-heading" className="border-b border-slate-200 pb-4 text-xl font-black tracking-tight text-[#0F2744] sm:text-2xl">
        Biểu mẫu học vụ &amp; Quy chế
      </h2>
      <div className="grid gap-8 lg:grid-cols-2">
        {DOCUMENT_SECTIONS.map((section) => <HomeDocumentPreview key={section.type} section={section} />)}
      </div>
    </section>
  );
}
