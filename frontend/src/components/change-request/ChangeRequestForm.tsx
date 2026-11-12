"use client";

import React, { useId, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Loader2,
  Send,
  ShieldAlert,
  X,
} from "lucide-react";
import { DeadlineCountdown } from "@/src/components/shared/DeadlineCountdown";
import { DeadlineWarningBanner } from "@/src/components/shared/DeadlineWarningBanner";
import { PdfUploader } from "@/src/components/upload/PdfUploader";
import { UploadProgress } from "@/src/components/upload/UploadProgress";
import type {
  ChangeRequestFormProps,
  ChangeRequestFormValues,
  ChangeRequestType,
} from "@/src/types/ui/change-request";
import {
  CHANGE_REQUEST_TYPE_META,
  addMonthsUtc,
  formatDateVi,
  isUtcDayAfter,
} from "./helpers";

const REQUEST_TYPES: ChangeRequestType[] = [
  "DOI_DE_TAI",
  "DOI_GVHD",
  "GIA_HAN",
];

const MAX_THESIS_TITLE_LENGTH = 500;
const MAX_EXTENSION_INPUT_MONTHS = 24;

/**
 * ChangeRequestForm
 *
 * Biểu mẫu lập đơn đề nghị điều chỉnh / gia hạn của NCS (DOI_DE_TAI, DOI_GVHD, GIA_HAN).
 * Kiểm tra đầy đủ ràng buộc quy chế qua props, tái sử dụng `PdfUploader`, `UploadProgress`,
 * `DeadlineWarningBanner` và `DeadlineCountdown`.
 */
export function ChangeRequestForm({
  currentThesisTitle,
  currentSupervisors,
  candidateSupervisors,
  trainingSummary,
  initialType = "DOI_DE_TAI",
  hasPendingRequest = false,
  uploadState = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null,
  className = "",
}: ChangeRequestFormProps) {
  const formTitleId = useId();
  const newTopicId = useId();
  const oldSupId = useId();
  const newSupId = useId();
  const extMonthsId = useId();
  const reasonId = useId();
  const forceMajeureId = useId();
  const pdfId = useId();

  const activeCurrentSupervisors = useMemo(
    () => currentSupervisors.filter((s) => s.trangThai === "DANG_HUONG_DAN"),
    [currentSupervisors]
  );

  const filteredCandidateSupervisors = useMemo(() => {
    const activeIds = new Set(
      activeCurrentSupervisors.map((s) => s.giangVienId)
    );
    return candidateSupervisors.filter((c) => !activeIds.has(c.giangVienId));
  }, [activeCurrentSupervisors, candidateSupervisors]);

  const [loaiDon, setLoaiDon] = useState<ChangeRequestType>(initialType);
  const [tenDeTaiMoi, setTenDeTaiMoi] = useState("");
  const [phanCongCuId, setPhanCongCuId] = useState(
    () => activeCurrentSupervisors[0]?.id ?? ""
  );
  const [gvhdMoiId, setGvhdMoiId] = useState(
    () => filteredCandidateSupervisors[0]?.giangVienId ?? ""
  );
  const [soThangInput, setSoThangInput] = useState("6");
  const [lyDo, setLyDo] = useState("");
  const [batKhaKhang, setBatKhaKhang] = useState(
    () =>
      initialType === "DOI_GVHD" && trainingSummary.conDuoi12ThangKhoaHoc
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileClientError, setFileClientError] = useState<string | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleSelectType = (nextType: ChangeRequestType) => {
    setLoaiDon(nextType);
    setAttemptedSubmit(false);
    setFileClientError(null);
    if (nextType === "DOI_GVHD") {
      setBatKhaKhang(trainingSummary.conDuoi12ThangKhoaHoc);
      if (!phanCongCuId && activeCurrentSupervisors[0]?.id) {
        setPhanCongCuId(activeCurrentSupervisors[0].id);
      }
      if (!gvhdMoiId && filteredCandidateSupervisors[0]?.giangVienId) {
        setGvhdMoiId(filteredCandidateSupervisors[0].giangVienId);
      }
    } else if (nextType === "DOI_DE_TAI") {
      setBatKhaKhang(false);
    } else {
      setBatKhaKhang(false);
    }
  };

  // Tính toán & kiểm tra thời gian cho GIA_HAN theo thời gian thực
  const extensionCheck = useMemo(() => {
    const trimmed = soThangInput.trim();
    const num = Number(trimmed);
    const isValidInteger =
      trimmed !== "" &&
      Number.isInteger(num) &&
      num >= 1 &&
      num <= MAX_EXTENSION_INPUT_MONTHS;

    if (!isValidInteger) {
      return {
        isValidInteger: false,
        months: null as number | null,
        projectedDeadline: null as string | null,
        projectedCumulative: null as number | null,
        exceedsCumulative: false,
        exceedsMax72Months: false,
        realtimeError:
          trimmed === ""
            ? "Vui lòng nhập số tháng xin gia hạn (từ 1 đến 24 tháng)."
            : "Số tháng xin gia hạn phải là số nguyên từ 1 đến 24.",
      };
    }

    const projectedDeadline = addMonthsUtc(trainingSummary.hanHienTai, num);
    const projectedCumulative = trainingSummary.tongThangDaGiaHan + num;
    const exceedsCumulative =
      projectedCumulative > trainingSummary.toiDaThangTichLuy;
    const exceedsMax72Months = Boolean(
      projectedDeadline &&
        isUtcDayAfter(projectedDeadline, trainingSummary.hanBuocThoiHoc)
    );

    let realtimeError: string | null = null;
    if (exceedsMax72Months && projectedDeadline) {
      realtimeError = `Hạn mới dự kiến (${formatDateVi(
        projectedDeadline
      )}) vượt quá hạn đào tạo tối đa 72 tháng (${formatDateVi(
        trainingSummary.hanBuocThoiHoc
      )}).`;
    } else if (exceedsCumulative) {
      realtimeError = `Tổng thời gian gia hạn tích lũy (${projectedCumulative} tháng) vượt quá tối đa ${trainingSummary.toiDaThangTichLuy} tháng theo quy chế.`;
    }

    return {
      isValidInteger: true,
      months: num,
      projectedDeadline,
      projectedCumulative,
      exceedsCumulative,
      exceedsMax72Months,
      realtimeError,
    };
  }, [soThangInput, trainingSummary]);

  const extensionPrerequisitesMet =
    trainingSummary.daDatMoc2 && trainingSummary.conTruocHanToiThieu2Thang;

  const missingExtensionReasons: string[] = [];
  if (!trainingSummary.daDatMoc2) {
    missingExtensionReasons.push("NCS chưa hoàn thành Mốc 2 (Bảo vệ đề cương)");
  }
  if (!trainingSummary.conTruocHanToiThieu2Thang) {
    missingExtensionReasons.push(
      "đơn gia hạn phải được nộp trước hạn hiện tại tối thiểu 2 tháng"
    );
  }

  // Validate tất cả trường theo loại đơn
  const validationErrors = useMemo(() => {
    const errors: {
      tenDeTaiMoi?: string;
      phanCongCuId?: string;
      gvhdMoiId?: string;
      soThangGiaHan?: string;
      lyDo?: string;
      batKhaKhang?: string;
      tepDinhKem?: string;
    } = {};

    const cleanReason = lyDo.trim();
    if (!cleanReason) {
      errors.lyDo = "Vui lòng nhập lý do đề nghị chi tiết.";
    } else if (cleanReason.length < 10) {
      errors.lyDo = "Lý do đề nghị cần rõ ràng, tối thiểu 10 ký tự.";
    }

    if (loaiDon === "DOI_DE_TAI") {
      const cleanTitle = tenDeTaiMoi.trim();
      if (!cleanTitle) {
        errors.tenDeTaiMoi = "Vui lòng nhập tên đề tài mới đề xuất.";
      } else if (cleanTitle.length > MAX_THESIS_TITLE_LENGTH) {
        errors.tenDeTaiMoi = `Tên đề tài mới không được vượt quá ${MAX_THESIS_TITLE_LENGTH} ký tự.`;
      } else if (
        cleanTitle.toLowerCase() === currentThesisTitle.trim().toLowerCase()
      ) {
        errors.tenDeTaiMoi =
          "Tên đề tài mới đang trùng với tên đề tài hiện tại.";
      }

      if (trainingSummary.daDatMoc8 && !batKhaKhang) {
        errors.batKhaKhang =
          "Đã qua Mốc 8: bắt buộc xác nhận trường hợp bất khả kháng.";
      }
    }

    if (loaiDon === "DOI_GVHD") {
      if (!phanCongCuId) {
        errors.phanCongCuId =
          "Vui lòng chọn Giảng viên hướng dẫn hiện tại cần thay đổi.";
      }
      if (!gvhdMoiId) {
        errors.gvhdMoiId = "Vui lòng chọn Giảng viên hướng dẫn mới đề xuất.";
      }
      if (trainingSummary.conDuoi12ThangKhoaHoc && !batKhaKhang) {
        errors.batKhaKhang =
          "Khóa học còn dưới 12 tháng: bắt buộc xác nhận lý do bất khả kháng.";
      }
    }

    if (loaiDon === "GIA_HAN") {
      if (extensionCheck.realtimeError) {
        errors.soThangGiaHan = extensionCheck.realtimeError;
      }
      if (!selectedFile) {
        errors.tepDinhKem =
          "Đơn xin gia hạn bắt buộc đính kèm tệp PDF Báo cáo tiến độ.";
      }
    }

    return errors;
  }, [
    batKhaKhang,
    currentThesisTitle,
    extensionCheck.realtimeError,
    gvhdMoiId,
    loaiDon,
    lyDo,
    phanCongCuId,
    selectedFile,
    tenDeTaiMoi,
    trainingSummary.conDuoi12ThangKhoaHoc,
    trainingSummary.daDatMoc8,
  ]);

  const hasFormErrors =
    Object.keys(validationErrors).length > 0 || Boolean(fileClientError);
  const isSubmitBlocked =
    isSubmitting ||
    hasPendingRequest ||
    (loaiDon === "GIA_HAN" &&
      (!extensionPrerequisitesMet || Boolean(extensionCheck.realtimeError))) ||
    (loaiDon === "DOI_GVHD" &&
      (activeCurrentSupervisors.length === 0 ||
        filteredCandidateSupervisors.length === 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (isSubmitBlocked || hasFormErrors) {
      return;
    }

    const payload: ChangeRequestFormValues = {
      loaiDon,
      lyDo: lyDo.trim(),
      batKhaKhang,
      tepDinhKemFile: selectedFile,
      ...(loaiDon === "DOI_DE_TAI" ? { tenDeTaiMoi: tenDeTaiMoi.trim() } : {}),
      ...(loaiDon === "DOI_GVHD"
        ? { phanCongCuId, gvhdMoiId }
        : {}),
      ...(loaiDon === "GIA_HAN"
        ? {
            soThangGiaHan: extensionCheck.months ?? undefined,
            hanMoiDuKien: extensionCheck.projectedDeadline ?? undefined,
          }
        : {}),
    };

    await onSubmit(payload);
  };

  const currentTypeMeta = CHANGE_REQUEST_TYPE_META[loaiDon];
  const baseDeadline = trainingSummary.hanGiaHan || trainingSummary.hanChinhQuy;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={formTitleId}
      className={`overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xs ${className}`}
    >
      {/* Header Form */}
      <div className="flex items-start justify-between gap-4 border-b border-border bg-muted/25 px-5 py-4 sm:px-6">
        <div className="space-y-1">
          <h2
            id={formTitleId}
            className="text-base font-bold text-[#0F2744] sm:text-lg"
          >
            Lập đơn đề nghị điều chỉnh &amp; gia hạn học tập
          </h2>
          <p className="text-xs text-muted-foreground">
            Chọn đúng loại đơn đề nghị, kiểm tra điều kiện quy chế và đính kèm minh chứng PDF nếu có.
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            aria-label="Đóng biểu mẫu lập đơn"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        {/* Cảnh báo nếu đang có 1 đơn chờ xử lý */}
        {hasPendingRequest && (
          <DeadlineWarningBanner
            severity="warning"
            alwaysShow
            title="Đã có đơn đề nghị đang chờ xử lý"
            message="Mỗi thời điểm chỉ được có tối đa 01 đơn đề nghị đang xử lý. Bạn cần chờ kết quả phê duyệt hoặc hủy đơn đang chờ trước khi gửi đơn mới."
          />
        )}

        {/* Lỗi từ tầng trên trả về */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-sm text-rose-900"
          >
            <AlertCircle
              className="mt-0.5 size-4 shrink-0 text-rose-600"
              aria-hidden="true"
            />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Chọn loại đơn */}
        <fieldset className="space-y-2.5">
          <legend className="text-xs font-semibold text-foreground">
            Loại đơn đề nghị <span className="text-rose-600">*</span>
          </legend>

          <div
            role="radiogroup"
            aria-label="Chọn loại đơn đề nghị"
            className="grid grid-cols-1 gap-3 md:grid-cols-3"
          >
            {REQUEST_TYPES.map((typeKey) => {
              const meta = CHANGE_REQUEST_TYPE_META[typeKey];
              const Icon = meta.Icon;
              const isSelected = loaiDon === typeKey;

              return (
                <button
                  key={typeKey}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={isSubmitting}
                  onClick={() => handleSelectType(typeKey)}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:pointer-events-none disabled:opacity-60 cursor-pointer ${
                    isSelected
                      ? "border-[#164E9B] bg-[#F0F5FA] text-[#0F2744]"
                      : "border-border bg-card text-foreground hover:border-[#164E9B]/40 hover:bg-muted/30"
                  }`}
                >
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${
                      isSelected
                        ? "border-[#164E9B] bg-[#164E9B] text-white"
                        : "border-border bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4.5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-bold leading-snug sm:text-sm">
                      {meta.shortLabel}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {meta.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* 2. Khối nhập liệu theo loại đơn */}
        {loaiDon === "DOI_DE_TAI" && (
          <div className="space-y-4 border-t border-border pt-5">
            {trainingSummary.daDatMoc8 && (
              <DeadlineWarningBanner
                severity="warning"
                alwaysShow
                title="Quy định điều chỉnh đề tài sau Mốc 8"
                message="NCS đã hoàn thành Mốc 8 (Bảo vệ cấp Đơn vị chuyên môn). Việc điều chỉnh đề tài sau Mốc 8 chỉ được xem xét nếu phát sinh lý do bất khả kháng."
              />
            )}

            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-muted-foreground">
                Tên đề tài luận án hiện tại
              </span>
              <div className="rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm font-medium text-foreground">
                {currentThesisTitle}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={newTopicId}
                  className="text-xs font-semibold text-foreground"
                >
                  Tên đề tài mới đề xuất{" "}
                  <span className="text-rose-600">*</span>
                </label>
                <span
                  className={`font-mono text-xs tabular-nums ${
                    tenDeTaiMoi.length > MAX_THESIS_TITLE_LENGTH
                      ? "font-bold text-rose-600"
                      : tenDeTaiMoi.length > 440
                      ? "font-semibold text-amber-700"
                      : "text-muted-foreground"
                  }`}
                >
                  {tenDeTaiMoi.length}/{MAX_THESIS_TITLE_LENGTH} ký tự
                </span>
              </div>

              <textarea
                id={newTopicId}
                rows={3}
                maxLength={MAX_THESIS_TITLE_LENGTH + 40}
                disabled={isSubmitting}
                value={tenDeTaiMoi}
                onChange={(e) => setTenDeTaiMoi(e.target.value)}
                placeholder="Nhập đầy đủ tên đề tài luận án tiến sĩ mới bằng tiếng Việt..."
                aria-invalid={Boolean(
                  attemptedSubmit && validationErrors.tenDeTaiMoi
                )}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:opacity-60"
              />

              {(tenDeTaiMoi.length > MAX_THESIS_TITLE_LENGTH ||
                (attemptedSubmit && validationErrors.tenDeTaiMoi)) && (
                <p role="alert" className="text-xs font-medium text-rose-600">
                  {validationErrors.tenDeTaiMoi ||
                    `Tên đề tài mới không được vượt quá ${MAX_THESIS_TITLE_LENGTH} ký tự.`}
                </p>
              )}
            </div>

            {trainingSummary.daDatMoc8 && (
              <label
                htmlFor={forceMajeureId}
                className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs leading-relaxed text-amber-950"
              >
                <input
                  id={forceMajeureId}
                  type="checkbox"
                  checked={batKhaKhang}
                  disabled={isSubmitting}
                  onChange={(e) => setBatKhaKhang(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-amber-400 text-[#164E9B] focus-visible:ring-2 focus-visible:ring-[#164E9B]"
                />
                <span className="font-medium">
                  Tôi xác nhận đề nghị điều chỉnh đề tài sau Mốc 8 phát sinh do{" "}
                  <strong>lý do bất khả kháng</strong> và chịu trách nhiệm trước
                  Hội đồng khoa học về minh chứng kèm theo.
                </span>
              </label>
            )}
            {attemptedSubmit && validationErrors.batKhaKhang && (
              <p role="alert" className="text-xs font-medium text-rose-600">
                {validationErrors.batKhaKhang}
              </p>
            )}
          </div>
        )}

        {loaiDon === "DOI_GVHD" && (
          <div className="space-y-4 border-t border-border pt-5">
            {trainingSummary.conDuoi12ThangKhoaHoc && (
              <DeadlineWarningBanner
                severity="warning"
                alwaysShow
                title="Thời gian khóa học còn dưới 12 tháng"
                message="Theo quy chế đào tạo tiến sĩ, khi khóa học còn dưới 12 tháng, đề nghị thay đổi GVHD chỉ được giải quyết trong trường hợp bất khả kháng (đã tự động kích hoạt cờ bất khả kháng)."
              />
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor={oldSupId}
                  className="block text-xs font-semibold text-foreground"
                >
                  GVHD hiện tại cần thay đổi{" "}
                  <span className="text-rose-600">*</span>
                </label>
                <select
                  id={oldSupId}
                  value={phanCongCuId}
                  disabled={
                    isSubmitting || activeCurrentSupervisors.length === 0
                  }
                  onChange={(e) => setPhanCongCuId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:opacity-60"
                >
                  {activeCurrentSupervisors.length === 0 ? (
                    <option value="">
                      Không có GVHD đang hướng dẫn
                    </option>
                  ) : (
                    activeCurrentSupervisors.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.hocHamHocVi} {sup.hoTen} —{" "}
                        {sup.vaiTro === "HUONG_DAN_CHINH"
                          ? "Hướng dẫn chính"
                          : "Đồng hướng dẫn"}{" "}
                        ({sup.trongSo.toFixed(1)})
                      </option>
                    ))
                  )}
                </select>
                {attemptedSubmit && validationErrors.phanCongCuId && (
                  <p role="alert" className="text-xs font-medium text-rose-600">
                    {validationErrors.phanCongCuId}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor={newSupId}
                  className="block text-xs font-semibold text-foreground"
                >
                  GVHD mới đề xuất{" "}
                  <span className="text-rose-600">*</span>
                </label>
                <select
                  id={newSupId}
                  value={gvhdMoiId}
                  disabled={
                    isSubmitting || filteredCandidateSupervisors.length === 0
                  }
                  onChange={(e) => setGvhdMoiId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:opacity-60"
                >
                  {filteredCandidateSupervisors.length === 0 ? (
                    <option value="">
                      Chưa có danh sách giảng viên thay thế khả dụng
                    </option>
                  ) : (
                    filteredCandidateSupervisors.map((cand) => (
                      <option key={cand.giangVienId} value={cand.giangVienId}>
                        {cand.hocHamHocVi} {cand.hoTen} — {cand.donViCongTac}
                        {cand.slotConLai !== undefined
                          ? ` (Còn ${cand.slotConLai} định mức)`
                          : ""}
                      </option>
                    ))
                  )}
                </select>
                {attemptedSubmit && validationErrors.gvhdMoiId && (
                  <p role="alert" className="text-xs font-medium text-rose-600">
                    {validationErrors.gvhdMoiId}
                  </p>
                )}
              </div>
            </div>

            {trainingSummary.conDuoi12ThangKhoaHoc && (
              <label
                htmlFor={forceMajeureId}
                className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs leading-relaxed text-amber-950"
              >
                <input
                  id={forceMajeureId}
                  type="checkbox"
                  checked={batKhaKhang}
                  disabled={isSubmitting}
                  onChange={(e) => setBatKhaKhang(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-amber-400 text-[#164E9B] focus-visible:ring-2 focus-visible:ring-[#164E9B]"
                />
                <span className="font-medium">
                  Xác nhận trường hợp <strong>bất khả kháng</strong> (GVHD nghỉ
                  hưu, chuyển công tác hoặc lý do sức khỏe/khách quan khác) khi
                  khóa học còn dưới 12 tháng.
                </span>
              </label>
            )}
            {attemptedSubmit && validationErrors.batKhaKhang && (
              <p role="alert" className="text-xs font-medium text-rose-600">
                {validationErrors.batKhaKhang}
              </p>
            )}
          </div>
        )}

        {loaiDon === "GIA_HAN" && (
          <div className="space-y-4 border-t border-border pt-5">
            {/* Bảng tóm tắt 4 chỉ số thời gian trên đầu form */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-xs font-bold text-[#0F2744] sm:text-sm">
                  <CalendarClock
                    className="size-4 text-[#164E9B]"
                    aria-hidden="true"
                  />
                  <span>Tổng quan thời hạn đào tạo tiến sĩ</span>
                </h3>
                <DeadlineCountdown
                  targetDate={trainingSummary.hanBuocThoiHoc}
                  label="Hạn 72 tháng"
                  variant="badge"
                />
              </div>

              <dl className="grid grid-cols-1 divide-y divide-border rounded-xl border border-border bg-muted/25 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                <div className="p-3.5">
                  <dt className="text-xs text-muted-foreground">
                    {trainingSummary.hanGiaHan
                      ? "Hạn hiện tại (đã gia hạn)"
                      : "Hạn đào tạo chính quy"}
                  </dt>
                  <dd className="mt-1 font-mono text-sm font-bold tabular-nums text-[#0F2744]">
                    {formatDateVi(baseDeadline)}
                  </dd>
                </div>

                <div className="p-3.5">
                  <dt className="text-xs text-muted-foreground">
                    Hạn tối đa 72 tháng
                  </dt>
                  <dd className="mt-1 font-mono text-sm font-bold tabular-nums text-foreground">
                    {formatDateVi(trainingSummary.hanBuocThoiHoc)}
                  </dd>
                </div>

                <div className="p-3.5">
                  <dt className="text-xs text-muted-foreground">
                    Đã gia hạn tích lũy
                  </dt>
                  <dd className="mt-1 font-mono text-sm font-bold tabular-nums text-foreground">
                    {trainingSummary.tongThangDaGiaHan}/
                    {trainingSummary.toiDaThangTichLuy} tháng
                  </dd>
                </div>

                <div className="p-3.5 bg-blue-50/40">
                  <dt className="text-xs font-semibold text-[#164E9B]">
                    Tối đa còn được xin
                  </dt>
                  <dd className="mt-1 font-mono text-sm font-bold tabular-nums text-[#164E9B]">
                    {trainingSummary.soThangToiDaConDuocXin} tháng
                  </dd>
                </div>
              </dl>
            </div>

            {/* Kiểm tra điều kiện qua props daDatMoc2 & conTruocHanToiThieu2Thang */}
            {!extensionPrerequisitesMet ? (
              <DeadlineWarningBanner
                severity="critical"
                alwaysShow
                title="Chưa đủ điều kiện nộp đơn gia hạn học tập"
                message={`Hiện tại không thể gửi đơn gia hạn vì: ${missingExtensionReasons.join(
                  "; "
                )}. Nút gửi đơn đã được khóa theo quy chế.`}
              />
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/50 px-3.5 py-2.5 text-xs font-medium text-emerald-900">
                <CheckCircle2
                  className="size-4 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                <span>
                  Đạt điều kiện nộp đơn gia hạn (đã hoàn thành Mốc 2 và nộp trước hạn hiện tại tối thiểu 2 tháng).
                </span>
              </div>
            )}

            {/* Nhập số tháng & Tự động tính Hạn mới dự kiến */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor={extMonthsId}
                  className="block text-xs font-semibold text-foreground"
                >
                  Số tháng xin gia hạn (1–24 tháng){" "}
                  <span className="text-rose-600">*</span>
                </label>
                <input
                  id={extMonthsId}
                  type="number"
                  min={1}
                  max={MAX_EXTENSION_INPUT_MONTHS}
                  step={1}
                  disabled={isSubmitting || !extensionPrerequisitesMet}
                  value={soThangInput}
                  onChange={(e) => setSoThangInput(e.target.value)}
                  aria-invalid={Boolean(extensionCheck.realtimeError)}
                  className="h-10 w-full rounded-xl border border-border bg-card px-3.5 font-mono text-sm font-semibold tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:opacity-60"
                />
                {extensionCheck.realtimeError && (
                  <p role="alert" className="text-xs font-medium text-rose-600">
                    {extensionCheck.realtimeError}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-muted-foreground">
                  Hạn mới dự kiến &amp; Tích lũy sau gia hạn
                </span>
                <div
                  className={`flex h-auto min-h-10 flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2 ${
                    extensionCheck.realtimeError
                      ? "border-rose-300 bg-rose-50/50 text-rose-900"
                      : "border-blue-200 bg-[#F0F5FA] text-[#0F2744]"
                  }`}
                >
                  <span className="font-mono text-sm font-bold tabular-nums">
                    {extensionCheck.projectedDeadline
                      ? formatDateVi(extensionCheck.projectedDeadline)
                      : "--/--/----"}
                  </span>
                  {extensionCheck.projectedCumulative !== null && (
                    <span className="font-mono text-xs font-semibold tabular-nums">
                      Tích lũy: {extensionCheck.projectedCumulative}/
                      {trainingSummary.toiDaThangTichLuy} tháng
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Lý do đề nghị (chung cho cả 3 loại đơn) */}
        <div className="space-y-1.5 border-t border-border pt-5">
          <label
            htmlFor={reasonId}
            className="block text-xs font-semibold text-foreground"
          >
            {loaiDon === "GIA_HAN"
              ? "Lý do xin gia hạn & Kế hoạch hoàn thành luận án"
              : "Lý do đề nghị chi tiết"}{" "}
            <span className="text-rose-600">*</span>
          </label>
          <textarea
            id={reasonId}
            rows={3}
            disabled={isSubmitting}
            value={lyDo}
            onChange={(e) => setLyDo(e.target.value)}
            placeholder={`Nêu rõ căn cứ chuyên môn hoặc lý do thực hiện "${currentTypeMeta.label}"...`}
            aria-invalid={Boolean(attemptedSubmit && validationErrors.lyDo)}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:opacity-60"
          />
          {attemptedSubmit && validationErrors.lyDo && (
            <p role="alert" className="text-xs font-medium text-rose-600">
              {validationErrors.lyDo}
            </p>
          )}
        </div>

        {/* 4. Đính kèm PDF qua PdfUploader & UploadProgress */}
        <div className="space-y-3">
          <PdfUploader
            id={pdfId}
            label={
              loaiDon === "GIA_HAN"
                ? "Báo cáo tiến độ nghiên cứu kèm theo (PDF)"
                : "Tài liệu minh chứng / Công văn giải trình (PDF, tùy chọn)"
            }
            required={loaiDon === "GIA_HAN"}
            selectedFile={selectedFile}
            disabled={isSubmitting}
            helperText={
              loaiDon === "GIA_HAN"
                ? "Bắt buộc đính kèm Báo cáo tiến độ định dạng .PDF (tối đa 15 MB) để tập thể GVHD xem xét."
                : "Đính kèm tệp PDF tối đa 15 MB nếu có biên bản họp bộ môn hoặc minh chứng liên quan."
            }
            error={
              fileClientError ||
              (attemptedSubmit ? validationErrors.tepDinhKem ?? null : null)
            }
            onFileSelect={(file) => {
              setSelectedFile(file);
              if (file) setFileClientError(null);
            }}
            onValidationError={(msg) => setFileClientError(msg)}
          />

          {selectedFile && uploadState && (
            <UploadProgress
              fileName={selectedFile.name}
              fileSize={selectedFile.size}
              progress={uploadState.progress}
              status={uploadState.status}
              errorMessage={uploadState.errorMessage}
              onCancel={uploadState.onCancel}
              onRetry={uploadState.onRetry}
              onRemove={
                !isSubmitting
                  ? () => {
                      setSelectedFile(null);
                      setFileClientError(null);
                    }
                  : undefined
              }
            />
          )}
        </div>

        {/* Ghi chú quy trình xử lý */}
        <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
          <ShieldAlert
            className="mt-0.5 size-4 shrink-0 text-[#164E9B]"
            aria-hidden="true"
          />
          <span>
            {loaiDon === "GIA_HAN"
              ? "Sau khi gửi, đơn gia hạn sẽ chuyển tới Tập thể GVHD để lấy ý kiến xác nhận trước khi Phòng ĐT-SĐH xét duyệt."
              : "Sau khi gửi, đơn đề nghị sẽ chuyển trực tiếp tới Phòng Đào tạo Sau Đại học để kiểm tra điều kiện và trình phê duyệt."}
          </span>
        </div>
      </div>

      {/* Footer nút hành động */}
      <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-border bg-muted/25 px-5 py-3.5 sm:px-6">
        {onCancel && (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            Hủy bỏ
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitBlocked}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#113E7D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-slate-200 disabled:text-slate-500 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              <span>Đang gửi đơn...</span>
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              <span>Gửi đơn đề nghị</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ChangeRequestForm;
