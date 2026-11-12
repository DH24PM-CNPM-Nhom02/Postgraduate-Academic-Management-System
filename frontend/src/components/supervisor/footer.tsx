"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Mail, Phone } from "lucide-react";

export function SupervisorFooter() {
  return (
    <footer className="border-t border-border bg-card px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-[#0F2744]">
            Phòng Đào tạo Sau đại học — Trường Đại học An Giang (ĐHQG TP.HCM)
          </p>
          <p className="mt-0.5">
            Phân hệ Giảng viên Hướng dẫn Nghiên cứu sinh
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href="/supervisor/regulations"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-1 font-medium text-[#164E9B] transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <BookOpen className="size-3.5 shrink-0" aria-hidden="true" />
            <span>Quy chế GVHD</span>
          </Link>

          <a
            href="mailto:saudaihoc@agu.edu.vn"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-1 transition-colors hover:text-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <Mail className="size-3.5 shrink-0" aria-hidden="true" />
            <span>saudaihoc@agu.edu.vn</span>
          </a>

          <a
            href="tel:+842963843110"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-1 transition-colors hover:text-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <Phone className="size-3.5 shrink-0" aria-hidden="true" />
            <span>(0296) 3843 110</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default SupervisorFooter;
