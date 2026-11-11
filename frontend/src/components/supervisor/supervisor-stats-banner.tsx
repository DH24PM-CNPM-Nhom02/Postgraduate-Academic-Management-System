"use client";

import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Mail,
  Phone,
  UserCheck,
  Users,
} from "lucide-react";
import type { SupervisorStatsBannerProps } from "@/src/types/ui/supervisor";
import { QuotaBar } from "./QuotaBar";

export function SupervisorStatsBanner({
  profile,
  quota,
  students,
  isLoading = false,
}: SupervisorStatsBannerProps) {
  if (isLoading) {
    return (
      <section
        role="status"
        aria-label="Đang tải thông tin Giảng viên Hướng dẫn"
        className="animate-pulse motion-reduce:animate-none rounded-xl border border-border bg-card p-6"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
          <div className="flex gap-4">
            <div className="size-14 rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-6 w-56 rounded bg-muted" />
              <div className="h-4 w-72 rounded bg-muted" />
            </div>
          </div>
          <div className="h-24 w-full rounded-xl bg-muted lg:w-80" />
        </div>
      </section>
    );
  }

  const totalStudents = students.length;
  const actionRequiredCount = students.filter((s) => s.coMocCanHoanThien).length;
  const onTrackCount = totalStudents - actionRequiredCount;

  return (
    <section
      aria-label="Thông tin Giảng viên Hướng dẫn và Hạn ngạch"
      className="rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Thông tin Profile GVHD */}
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#0F2744] text-white shadow-2xs">
            <UserCheck className="size-7" aria-hidden="true" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#0F2744] sm:text-2xl">
                {profile.hoTen}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#164E9B]/10 px-2.5 py-0.5 text-xs font-semibold text-[#164E9B]">
                <Award className="size-3.5" aria-hidden="true" />
                {profile.hocHamHocVi}
              </span>
              <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
                {profile.maCanBo}
              </span>
            </div>

            <p className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted-foreground sm:text-sm">
              <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{profile.donVi}</span>
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-muted-foreground">
              <span>
                Lĩnh vực:{" "}
                <strong className="font-semibold text-foreground">
                  {profile.chuyenMon}
                </strong>
              </span>
              <span aria-hidden="true" className="text-border">
                •
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1 transition-colors hover:text-[#164E9B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
              >
                <Mail className="size-3.5" aria-hidden="true" />
                <span>{profile.email}</span>
              </a>
              <span aria-hidden="true" className="text-border">
                •
              </span>
              <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                <Phone className="size-3.5" aria-hidden="true" />
                <span>{profile.soDienThoai}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Khối tóm tắt Quota trọng số (tính từ QuotaBar compact) */}
        <div className="shrink-0 space-y-2.5 rounded-xl bg-muted/50 p-4 lg:w-84">
          <QuotaBar quota={quota} compact showDetails={false} />
          <div className="flex justify-end border-t border-border/60 pt-2">
            <Link
              href="/supervisor/quota"
              className="inline-flex min-h-8 items-center gap-1 text-xs font-semibold text-[#164E9B] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
            >
              <span>Xem chi tiết định mức</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3 chỉ số tổng hợp (Tonal tiles không lồng viền kép) */}
      <div className="mt-5 grid grid-cols-1 gap-3 border-t border-border pt-5 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl bg-muted/45 p-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#164E9B]/10 text-[#164E9B]">
            <Users className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-bold leading-tight text-foreground tabular-nums">
              {totalStudents} Nghiên cứu sinh
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tổng số NCS đang phụ trách ({quota.tongTrongSo.toFixed(1)}/{quota.hanMucToiDa.toFixed(1)} trọng số)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-rose-50/70 p-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
            <AlertTriangle className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-bold leading-tight text-rose-950 tabular-nums">
              {actionRequiredCount} NCS cần hoàn thiện
            </p>
            <p className="mt-0.5 text-xs text-rose-800">
              Có mốc minh chứng đang bị yêu cầu bổ sung
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-emerald-50/70 p-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-bold leading-tight text-emerald-950 tabular-nums">
              {onTrackCount} NCS theo đúng lộ trình
            </p>
            <p className="mt-0.5 text-xs text-emerald-800">
              Đang thực hiện hoặc chờ thẩm định đúng hạn
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SupervisorStatsBanner;
