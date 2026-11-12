"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  Gauge,
  Info,
  RefreshCw,
  Scale,
  Users,
} from "lucide-react";
import type {
  SupervisedStudent,
  SupervisorQuotaWorkspaceProps,
} from "@/src/types/ui/supervisor";
import { QuotaBar } from "./QuotaBar";

export type { SupervisorQuotaWorkspaceProps };

function formatDateUtc(isoString?: string): string {
  if (!isoString) return "--/--/----";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function getStudentEffectiveWeight(student: SupervisedStudent): number {
  if (
    student.trangThaiHocTap === "TOT_NGHIEP" ||
    student.trangThaiHocTap === "TAM_DUNG"
  ) {
    return 0;
  }
  return student.trongSo;
}

function getStudentStatusLabel(student: SupervisedStudent): {
  label: string;
  badgeClass: string;
} {
  switch (student.trangThaiHocTap) {
    case "TOT_NGHIEP":
      return {
        label: "Đã tốt nghiệp (Không tính định mức)",
        badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case "TAM_DUNG":
      return {
        label: "Tạm dừng (Không tính định mức)",
        badgeClass: "border-slate-200 bg-slate-100 text-slate-700",
      };
    case "CAN_HOAN_THIEN":
      return {
        label: "Cần hoàn thiện mốc",
        badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
      };
    case "CHO_DUYET":
      return {
        label: "Chờ Giáo vụ duyệt",
        badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
      };
    case "DANG_THUC_HIEN":
    default:
      return {
        label: "Đang thực hiện",
        badgeClass: "border-[#164E9B]/25 bg-[#164E9B]/10 text-[#164E9B]",
      };
  }
}

export function SupervisorQuotaWorkspace({
  profile,
  quota,
  students,
  scenarios = [],
  isLoading = false,
  error = null,
  onRetry,
}: SupervisorQuotaWorkspaceProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    () => scenarios[0]?.id ?? null
  );

  const selectedScenario = useMemo(
    () =>
      scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? null,
    [scenarios, selectedScenarioId]
  );

  const activeQuota = selectedScenario ? selectedScenario.quota : quota;
  const isPreviewScenario =
    selectedScenario !== null && selectedScenario.id !== "current";

  const totalRosterWeight = useMemo(
    () =>
      students.reduce(
        (sum, student) => sum + getStudentEffectiveWeight(student),
        0
      ),
    [students]
  );

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2744]">
            Định mức hướng dẫn Nghiên cứu sinh (BR-09)
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.hoTen} • {profile.hocHamHocVi} • {profile.maCanBo} • {profile.donVi}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/supervisor/students"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-[#0F2744] transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <ArrowLeft className="size-4 text-[#164E9B]" aria-hidden="true" />
            <span>Quay lại danh sách NCS</span>
          </Link>
          <Link
            href="/supervisor/regulations"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <BookOpen className="size-4" aria-hidden="true" />
            <span>Quy chế GVHD</span>
          </Link>
        </div>
      </header>

      {error && !isLoading && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-900 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-600" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-semibold">Không thể tải dữ liệu định mức hướng dẫn</p>
              <p className="mt-0.5 text-rose-800">{error}</p>
            </div>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-800 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 motion-reduce:transition-none"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              <span>Thử lại</span>
            </button>
          )}
        </div>
      )}

      {scenarios.length > 0 && !isLoading && (
        <section
          aria-label="Mô phỏng các ngưỡng định mức hướng dẫn"
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#0F2744]">
                Kiểm tra trạng thái theo ngưỡng cảnh báo BR-09
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Chọn kịch bản tải để xem giao diện thanh định mức phản ứng theo ngưỡng an toàn, cảnh báo 80% và đạt trần 100%.
              </p>
            </div>
            {isPreviewScenario && (
              <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                <Info className="size-3.5" aria-hidden="true" />
                <span>Đang xem kịch bản mô phỏng</span>
              </span>
            )}
          </div>

          <div
            role="group"
            aria-label="Danh sách kịch bản định mức"
            className="mt-3 flex flex-wrap gap-2"
          >
            {scenarios.map((scenario) => {
              const isSelected = selectedScenario?.id === scenario.id;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedScenarioId(scenario.id)}
                  className={`inline-flex min-h-10 items-center rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none ${
                    isSelected
                      ? "border-[#164E9B] bg-[#164E9B] text-white"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {scenario.label}
                </button>
              );
            })}
          </div>

          {selectedScenario && (
            <p className="mt-2.5 text-xs text-muted-foreground">
              {selectedScenario.description}
            </p>
          )}
        </section>
      )}

      <section
        aria-label="Chi tiết thanh định mức quy đổi"
        className="rounded-xl border border-border bg-card p-5 sm:p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <Gauge className="size-5 text-[#164E9B]" aria-hidden="true" />
          <h2 className="text-base font-bold text-[#0F2744]">
            Tổng hợp tải hướng dẫn hiện tại
          </h2>
        </div>

        <QuotaBar quota={activeQuota} showDetails isLoading={isLoading} />

        {!isLoading && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-[#F0F5FA] p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Hướng dẫn chính (×1.0)
              </p>
              <p className="mt-1.5 text-xl font-bold tabular-nums text-[#0F2744]">
                {activeQuota.soLuongHuongDanChinh} NCS
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Quy đổi {activeQuota.trongSoChinh.toFixed(1)} điểm
              </p>
            </div>

            <div className="rounded-lg bg-[#F0F5FA] p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Đồng hướng dẫn (×0.5)
              </p>
              <p className="mt-1.5 text-xl font-bold tabular-nums text-[#0F2744]">
                {activeQuota.soLuongDongHuongDan} NCS
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Quy đổi {activeQuota.trongSoPhu.toFixed(1)} điểm
              </p>
            </div>

            <div className="rounded-lg bg-[#F0F5FA] p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Tổng trọng số đang tính
              </p>
              <p className="mt-1.5 text-xl font-bold tabular-nums text-[#164E9B]">
                {activeQuota.tongTrongSo.toFixed(1)} / {activeQuota.hanMucToiDa.toFixed(1)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Chiếm {activeQuota.tyLeSuDungPhanTram}% hạn mức tối đa
              </p>
            </div>

            <div className="rounded-lg bg-[#F0F5FA] p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Phần định mức còn trống
              </p>
              <p
                className={`mt-1.5 text-xl font-bold tabular-nums ${
                  activeQuota.trongSoConLai > 0 ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {activeQuota.trongSoConLai.toFixed(1)} điểm
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {activeQuota.trongSoConLai >= 1
                  ? `Tối đa +${Math.floor(activeQuota.trongSoConLai)} Chính hoặc +${Math.floor(
                      activeQuota.trongSoConLai / 0.5
                    )} Đồng HD`
                  : activeQuota.trongSoConLai >= 0.5
                  ? "Chỉ đủ nhận thêm 1 Đồng HD (0.5)"
                  : "Đã hết hạn mức tiếp nhận mới"}
              </p>
            </div>
          </div>
        )}
      </section>

      <section
        aria-label="Bảng phân bổ trọng số theo từng Nghiên cứu sinh"
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F2744]">
              Bảng kê trọng số từng Nghiên cứu sinh
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isPreviewScenario
                ? `Lưu ý: Bảng dưới đây phản ánh danh sách phân công thực tế (${totalRosterWeight.toFixed(
                    1
                  )} điểm), trong khi thẻ tổng quan phía trên đang mô phỏng ${activeQuota.tongTrongSo.toFixed(
                    1
                  )} điểm.`
                : "Danh sách học viên thực tế đang cấu thành tổng trọng số định mức của Giảng viên."}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold text-[#0F2744]">
            <Users className="size-3.5 text-[#164E9B]" aria-hidden="true" />
            <span>{students.length} hồ sơ phân công</span>
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5 animate-pulse motion-reduce:animate-none">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="h-12 rounded-lg bg-muted" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            Giảng viên chưa có Nghiên cứu sinh nào được phân công trong hệ thống.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                  <th className="px-5 py-3">STT</th>
                  <th className="px-5 py-3">Nghiên cứu sinh</th>
                  <th className="px-5 py-3">Tên đề tài luận án</th>
                  <th className="px-5 py-3">Vai trò</th>
                  <th className="px-5 py-3 text-right">Trọng số</th>
                  <th className="px-5 py-3">Số QĐ phân công</th>
                  <th className="px-5 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student, index) => {
                  const effectiveWeight = getStudentEffectiveWeight(student);
                  const statusMeta = getStudentStatusLabel(student);
                  const isMain = student.vaiTro === "HUONG_DAN_CHINH";
                  return (
                    <tr key={student.id} className="hover:bg-muted/30">
                      <td className="px-5 py-3.5 font-medium tabular-nums text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-[#0F2744]">{student.hoTen}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.mshv} • {student.khoaDaoTao}
                        </p>
                      </td>
                      <td className="max-w-xs px-5 py-3.5 text-xs text-foreground">
                        <span className="line-clamp-2">{student.tenDeTai}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                            isMain
                              ? "bg-[#164E9B]/10 text-[#164E9B]"
                              : "bg-sky-50 text-sky-800"
                          }`}
                        >
                          {isMain ? "Hướng dẫn chính" : "Đồng hướng dẫn"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold tabular-nums text-[#0F2744]">
                        {effectiveWeight > 0
                          ? effectiveWeight.toFixed(1)
                          : "0.0"}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-foreground">
                        <div className="flex items-center gap-1.5 font-medium">
                          <FileText className="size-3.5 text-muted-foreground" aria-hidden="true" />
                          <span>{student.soQuyetDinhPhanCong}</span>
                        </div>
                        <p className="mt-0.5 text-muted-foreground">
                          Ngày {formatDateUtc(student.ngayPhanCong)}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusMeta.badgeClass}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-muted/40 font-semibold text-[#0F2744]">
                  <td colSpan={4} className="px-5 py-3.5 text-right text-sm">
                    Tổng trọng số đang tính vào định mức thực tế:
                  </td>
                  <td className="px-5 py-3.5 text-right text-base font-bold tabular-nums text-[#164E9B]">
                    {totalRosterWeight.toFixed(1)}
                  </td>
                  <td colSpan={2} className="px-5 py-3.5 text-xs text-muted-foreground">
                    Trần quy chế: {quota.hanMucToiDa.toFixed(1)} điểm định mức
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      <section
        aria-label="Quy tắc áp dụng định mức BR-09"
        className="rounded-xl border border-border bg-card p-5 sm:p-6"
      >
        <div className="flex items-center gap-2">
          <Scale className="size-5 text-[#164E9B]" aria-hidden="true" />
          <h2 className="text-base font-bold text-[#0F2744]">
            Quy tắc quy đổi & ngưỡng kiểm soát BR-09
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-[#F0F5FA] p-4">
            <h3 className="text-sm font-semibold text-[#0F2744]">
              Hệ số quy đổi theo vai trò hướng dẫn
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-[#164E9B]" aria-hidden="true" />
                <span>
                  <strong>Hướng dẫn chính / Độc lập:</strong> tính trọng số{" "}
                  <strong>1.0</strong> điểm định mức / 1 NCS.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-[#164E9B]" aria-hidden="true" />
                <span>
                  <strong>Đồng hướng dẫn (GVHD phụ):</strong> tính trọng số{" "}
                  <strong>0.5</strong> điểm định mức / 1 NCS.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>
                  NCS đã bảo vệ thành công (Tốt nghiệp) hoặc Tạm dừng được giải phóng khỏi hạn mức hiện hành.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-[#F0F5FA] p-4">
            <h3 className="text-sm font-semibold text-[#0F2744]">
              Ngưỡng cảnh báo & điều kiện phân công mới
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-foreground">
              <li className="flex items-center gap-2">
                <span className="inline-block size-2.5 shrink-0 rounded-full bg-[#164E9B]" aria-hidden="true" />
                <span>
                  <strong>Dưới 80% (&lt; 4.0):</strong> An toàn, đủ điều kiện tiếp nhận thêm NCS.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block size-2.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                <span>
                  <strong>Từ 80% đến dưới 100% (4.0 – 4.9):</strong> Cảnh báo gần chạm trần khi phân công mới.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block size-2.5 shrink-0 rounded-full bg-rose-600" aria-hidden="true" />
                <span>
                  <strong>Từ 100% trở lên (≥ 5.0):</strong> Khóa tiếp nhận phân công mới trên hệ thống học vụ.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SupervisorQuotaWorkspace;
