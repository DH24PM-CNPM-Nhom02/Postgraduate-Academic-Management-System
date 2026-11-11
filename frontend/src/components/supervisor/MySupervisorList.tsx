"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Award,
  Building2,
  Calendar,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  ScrollText,
  UserCheck,
  Users,
} from "lucide-react";
import type {
  SupervisorAssignmentItem,
  SupervisorRoleType,
} from "@/src/types/ui/thesis";
import { PdfViewer } from "@/src/components/upload/PdfViewer";

export interface MySupervisorListProps {
  /** Danh sách Giảng viên hướng dẫn được phân công cho NCS */
  supervisors: SupervisorAssignmentItem[];
  /** Trạng thái đang tải dữ liệu */
  isLoading?: boolean;
  /** Thông báo lỗi nếu tải dữ liệu thất bại */
  error?: string | null;
  /** Callback thử lại khi có lỗi */
  onRetry?: () => void;
  /** Class CSS bổ sung */
  className?: string;
}

function formatDateVi(iso?: string): string {
  if (!iso) return "--/--/----";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function getRoleMeta(role: SupervisorRoleType) {
  if (role === "HUONG_DAN_CHINH") {
    return {
      label: "Hướng dẫn chính",
      badgeClass: "border-blue-200 bg-blue-50 text-[#164E9B]",
      weightClass: "border-blue-200 bg-[#F0F5FA] text-[#0F2744]",
    };
  }
  return {
    label: "Đồng hướng dẫn",
    badgeClass: "border-slate-200 bg-slate-100 text-slate-800",
    weightClass: "border-border bg-muted/60 text-foreground",
  };
}

/**
 * MySupervisorList
 *
 * Hiển thị danh sách Giảng viên Hướng dẫn (Hướng dẫn chính / Đồng hướng dẫn),
 * trọng số định mức (1.0 / 0.5 theo BR-09), thông tin liên hệ và số Quyết định phân công.
 * Hỗ trợ đầy đủ trạng thái `isLoading`, `error` và `empty`.
 */
export function MySupervisorList({
  supervisors,
  isLoading = false,
  error = null,
  onRetry,
  className = "",
}: MySupervisorListProps) {
  const [selectedDecision, setSelectedDecision] =
    useState<SupervisorAssignmentItem | null>(null);

  if (isLoading) {
    return (
      <section
        aria-busy="true"
        aria-label="Đang tải danh sách giảng viên hướng dẫn"
        className={`space-y-4 animate-pulse motion-reduce:animate-none ${className}`}
      >
        <div className="h-16 rounded-2xl border border-border bg-card" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[0, 1].map((idx) => (
            <div
              key={idx}
              className="space-y-4 rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-xl bg-muted" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-44 rounded bg-muted" />
                    <div className="h-3 w-32 rounded bg-muted/70" />
                  </div>
                </div>
                <div className="h-6 w-24 rounded-full bg-muted" />
              </div>
              <div className="space-y-2 border-t border-border pt-4">
                <div className="h-3.5 w-4/5 rounded bg-muted/70" />
                <div className="h-3.5 w-3/5 rounded bg-muted/70" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        role="alert"
        className={`rounded-2xl border border-rose-200 bg-card p-6 ${className}`}
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700">
              <AlertCircle className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground">
                Không thể tải danh sách giảng viên hướng dẫn
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {error}
              </p>
            </div>
          </div>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-[#164E9B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              <span>Thử lại</span>
            </button>
          )}
        </div>
      </section>
    );
  }

  if (supervisors.length === 0) {
    return (
      <section
        className={`rounded-2xl border border-dashed border-border bg-card p-8 text-center ${className}`}
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Users className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-3 text-base font-bold text-foreground">
          Chưa có giảng viên hướng dẫn được phân công
        </h2>
        <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Hệ thống chưa ghi nhận Quyết định phân công người hướng dẫn cho hồ sơ của bạn.
          Vui lòng liên hệ Phòng Đào tạo Sau Đại học nếu cần hỗ trợ kiểm tra.
        </p>
      </section>
    );
  }

  const activeSupervisors = supervisors.filter(
    (s) => s.trangThai === "DANG_HUONG_DAN"
  );
  const totalWeight = activeSupervisors.reduce(
    (sum, item) => sum + item.trongSo,
    0
  );

  return (
    <>
      <div className={`space-y-5 ${className}`}>
        {/* Thanh tóm tắt phân công & trọng số định mức BR-09 */}
        <section
          aria-label="Tóm tắt phân công hướng dẫn"
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#164E9B]">
              <UserCheck className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F2744] sm:text-base">
                Hội đồng người hướng dẫn khoa học
              </h2>
              <p className="text-xs text-muted-foreground">
                Theo Quy chế Đào tạo Tiến sĩ BR-09 (Hướng dẫn chính 1.0 • Đồng hướng dẫn 0.5)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 font-semibold text-foreground">
              Đang hướng dẫn:{" "}
              <span className="font-mono font-bold text-[#164E9B] tabular-nums">
                {activeSupervisors.length}
              </span>{" "}
              giảng viên
            </span>
            <span className="rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-1.5 font-semibold text-[#0F2744]">
              Tổng trọng số:{" "}
              <span className="font-mono font-bold text-[#164E9B] tabular-nums">
                {totalWeight.toFixed(1)}
              </span>
            </span>
          </div>
        </section>

        {/* Danh sách chi tiết từng GVHD */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {supervisors.map((supervisor) => {
            const roleMeta = getRoleMeta(supervisor.vaiTro);
            const isActive = supervisor.trangThai === "DANG_HUONG_DAN";

            return (
              <article
                key={supervisor.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xs"
              >
                <div
                  className={`h-1 w-full ${
                    supervisor.vaiTro === "HUONG_DAN_CHINH"
                      ? "bg-[#164E9B]"
                      : "bg-slate-400"
                  }`}
                />

                <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                  <div className="space-y-4">
                    {/* Header thẻ giảng viên */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#164E9B] text-sm font-bold text-white">
                          {supervisor.hoTen.trim().split(" ").pop()?.charAt(0) ||
                            "G"}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-foreground">
                              {supervisor.hocHamHocVi} {supervisor.hoTen}
                            </h3>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                                isActive
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                  : "border-border bg-muted text-muted-foreground"
                              }`}
                            >
                              {isActive ? "Đang hướng dẫn" : "Đã kết thúc"}
                            </span>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleMeta.badgeClass}`}
                            >
                              <Award className="size-3" aria-hidden="true" />
                              <span>{roleMeta.label}</span>
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold tabular-nums ${roleMeta.weightClass}`}
                            >
                              Trọng số: {supervisor.trongSo.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin chuyên môn & liên hệ */}
                    <dl className="space-y-2.5 border-t border-border pt-4 text-xs sm:text-[13px]">
                      <div className="flex items-start gap-2.5">
                        <Building2
                          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <div>
                          <dt className="sr-only">Đơn vị công tác</dt>
                          <dd className="font-medium text-foreground">
                            {supervisor.donViCongTac}
                          </dd>
                        </div>
                      </div>

                      {supervisor.linhVucNghienCuu && (
                        <div className="flex items-start gap-2.5">
                          <UserCheck
                            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <div>
                            <dt className="sr-only">Lĩnh vực nghiên cứu</dt>
                            <dd className="text-muted-foreground">
                              Chuyên môn:{" "}
                              <span className="text-foreground">
                                {supervisor.linhVucNghienCuu}
                              </span>
                            </dd>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2.5">
                        <Mail
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <dt className="sr-only">Email</dt>
                        <dd>
                          <a
                            href={`mailto:${supervisor.email}`}
                            className="font-medium text-[#164E9B] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
                          >
                            {supervisor.email}
                          </a>
                        </dd>
                      </div>

                      {supervisor.soDienThoai && (
                        <div className="flex items-center gap-2.5">
                          <Phone
                            className="size-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <dt className="sr-only">Số điện thoại</dt>
                          <dd className="font-mono text-foreground tabular-nums">
                            {supervisor.soDienThoai}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {/* Quyết định phân công */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-foreground">
                        <ScrollText
                          className="size-3.5 text-[#164E9B]"
                          aria-hidden="true"
                        />
                        <span>QĐ: {supervisor.soQuyetDinh}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="size-3.5" aria-hidden="true" />
                        <span className="font-mono tabular-nums">
                          Ngày ký: {formatDateVi(supervisor.ngayKyQuyetDinh)}
                        </span>
                      </div>
                    </div>

                    {supervisor.fileUrlQuyetDinh && (
                      <button
                        type="button"
                        onClick={() => setSelectedDecision(supervisor)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-[#164E9B] transition-colors hover:border-blue-200 hover:bg-blue-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] cursor-pointer"
                      >
                        <FileText className="size-3.5" aria-hidden="true" />
                        <span>Xem QĐ phân công</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <PdfViewer
        isOpen={Boolean(selectedDecision)}
        onClose={() => setSelectedDecision(null)}
        fileUrl={selectedDecision?.fileUrlQuyetDinh}
        fileName={selectedDecision?.fileNameQuyetDinh}
        title={
          selectedDecision
            ? `Quyết định phân công ${selectedDecision.soQuyetDinh}`
            : undefined
        }
        subtitle={
          selectedDecision
            ? `${selectedDecision.hocHamHocVi} ${selectedDecision.hoTen} • ${
                selectedDecision.vaiTro === "HUONG_DAN_CHINH"
                  ? "Hướng dẫn chính (1.0)"
                  : "Đồng hướng dẫn (0.5)"
              }`
            : undefined
        }
        allowDownload={true}
      />
    </>
  );
}

export default MySupervisorList;
