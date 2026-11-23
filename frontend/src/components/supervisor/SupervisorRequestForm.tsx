"use client";

import React, { useId, useMemo, useState } from "react";
import { z } from "zod";
import { MAX_PDF_SIZE_BYTES } from "@/src/types/api/document";
import { SupervisorSelect } from "./supervisor-select";
import {
  AlertCircle,
  BookOpen,
  FilePlus2,
  Send,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { ConfirmDialog } from "@/src/components/shared/ConfirmDialog";
import { DeadlineWarningBanner } from "@/src/components/shared/DeadlineWarningBanner";
import { PdfUploader } from "@/src/components/upload/PdfUploader";
import { useSupervisorCandidates } from "@/src/hooks/api/use-change-requests";
import { useMyNcsDetail } from "@/src/hooks/use-academic";
import type {
  SupervisedStudent,
  SupervisorProxyRequestFormValues,
  SupervisorProxyRequestType,
  SupervisorRole,
} from "@/src/types/ui/supervisor";

const requestFields = {
  studentId: z.uuid("Vui lòng chọn Nghiên cứu sinh cần lập đơn."),
  lyDo: z.string().trim().min(15, "Lý do chuyên môn phải có ít nhất 15 ký tự."),
  batKhaKhang: z.boolean(),
  tepDinhKemFile: z.custom<File>((file) => file instanceof File, "Tệp đính kèm không hợp lệ.")
    .refine((file) => /\.pdf$/i.test(file.name) && (!file.type || file.type === "application/pdf"), "Chỉ nhận tệp định dạng PDF.")
    .refine((file) => file.size > 0 && file.size <= MAX_PDF_SIZE_BYTES, "Tệp PDF phải có dung lượng lớn hơn 0 và tối đa 15 MB.")
    .nullable(),
};

const supervisorRequestSchema = z.discriminatedUnion("loaiDon", [
  z.object({
    ...requestFields,
    loaiDon: z.literal("DOI_DE_TAI"),
    tenDeTaiMoi: z.string().trim()
      .min(15, "Tên đề tài mới phải có ít nhất 15 ký tự.")
      .max(500, "Tên đề tài mới không được vượt quá 500 ký tự."),
  }),
  z.object({
    ...requestFields,
    loaiDon: z.literal("DOI_GVHD"),
    phanCongCuId: z.uuid("Chưa có phân công hướng dẫn hiệu lực cho vai trò đã chọn."),
    gvhdMoiId: z.uuid("Vui lòng chọn Giảng viên hướng dẫn mới được đề xuất."),
  }),
]);

type FieldErrors = Partial<Record<keyof SupervisorProxyRequestFormValues, string>>;

const normalizeTitle = (title: string) => title.trim().replace(/\s+/g, " ").toLowerCase();

export interface SupervisorRequestFormProps {
  students: SupervisedStudent[];
  initialStudentId?: string;
  initialType?: SupervisorProxyRequestType;
  isSubmitting?: boolean;
  onSubmit: (values: SupervisorProxyRequestFormValues) => void | Promise<void>;
  onCancel?: () => void;
}

export function SupervisorRequestForm({
  students,
  initialStudentId,
  initialType = "DOI_DE_TAI",
  isSubmitting = false,
  onSubmit,
  onCancel,
}: SupervisorRequestFormProps) {
  const formId = useId();
  const [openedAt] = useState(Date.now);
  const [studentId, setStudentId] = useState<string>(
    () => initialStudentId || students[0]?.id || ""
  );
  const [loaiDon, setLoaiDon] = useState<SupervisorProxyRequestType>(initialType);
  const [tenDeTaiMoi, setTenDeTaiMoi] = useState("");
  const [vaiTroGvhdCanThay, setVaiTroGvhdCanThay] =
    useState<SupervisorRole>("DONG_HUONG_DAN");
  const [gvhdMoiId, setGvhdMoiId] = useState("");
  const [lyDo, setLyDo] = useState("");
  const [batKhaKhang, setBatKhaKhang] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [confirmedValues, setConfirmedValues] = useState<SupervisorProxyRequestFormValues | null>(null);

  const renderFieldError = (field: keyof FieldErrors) =>
    fieldErrors[field] && <p role="alert" className="mt-1 text-xs text-destructive">{fieldErrors[field]}</p>;
  const clearFieldError = (field: keyof FieldErrors) =>
    setFieldErrors((errors) => ({ ...errors, [field]: undefined }));

  const selectedStudent = useMemo(
    () => students.find((st) => st.id === studentId) ?? null,
    [students, studentId]
  );

  const isSupervisorChange = loaiDon === "DOI_GVHD";
  const detail = useMyNcsDetail(studentId, isSupervisorChange);
  const candidates = useSupervisorCandidates(isSupervisorChange);
  const activeAssignments = detail.data?.phanCongs?.filter((item) => item.trangThai === "DANG_HIEU_LUC") ?? [];
  const assignmentToReplace = activeAssignments.find((item) => item.vaiTro === vaiTroGvhdCanThay);
  const currentSupervisorForRole = assignmentToReplace?.gvhd?.hoTen ?? "Chưa có dữ liệu phân công";
  const assignedIds = new Set(activeAssignments.map((item) => item.gvhdId));
  const availableCandidates = (candidates.data ?? []).filter((candidate) => !assignedIds.has(candidate.giangVienId));
  const assignmentError = detail.error ?? candidates.error;
  const isLoadingAssignments = detail.isLoading || candidates.isLoading;

  const selectedCandidate = availableCandidates.find((candidate) => candidate.giangVienId === gvhdMoiId);

  const requiresForceMajeure = useMemo(() => {
    if (!selectedStudent) return false;
    if (loaiDon === "DOI_DE_TAI") {
      const moc8 = selectedStudent.milestones.find((milestone) => milestone.thuTu === 8);
      return Boolean(moc8 && moc8.trangThai !== "LOCKED" && moc8.trangThai !== "UNLOCKED");
    }
    const trainingEnd = detail.data?.hanGiaHan ?? detail.data?.hanChinhQuy;
    if (!trainingEnd) return false;
    const deadline = new Date(trainingEnd);
    const day = deadline.getUTCDate();
    deadline.setUTCFullYear(deadline.getUTCFullYear() - 1);
    if (deadline.getUTCDate() !== day) deadline.setUTCDate(0);
    return openedAt > deadline.getTime();
  }, [loaiDon, selectedStudent, detail.data, openedAt]);

  const handleValidateAndAskConfirm = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const result = supervisorRequestSchema.superRefine((values, ctx) => {
      if (
        values.loaiDon === "DOI_DE_TAI" &&
        selectedStudent &&
        normalizeTitle(values.tenDeTaiMoi) === normalizeTitle(selectedStudent.tenDeTai)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["tenDeTaiMoi"],
          message: "Tên đề tài mới đang trùng với tên đề tài hiện tại của NCS.",
        });
      }
      if (requiresForceMajeure && !values.batKhaKhang) {
        ctx.addIssue({
          code: "custom",
          path: ["batKhaKhang"],
          message: "Vui lòng xác nhận điều kiện bất khả kháng và nêu rõ lý do.",
        });
      }
    }).safeParse({
      studentId: selectedStudent?.id ?? "",
      loaiDon,
      lyDo,
      batKhaKhang: requiresForceMajeure && batKhaKhang,
      tenDeTaiMoi,
      phanCongCuId: assignmentToReplace?.id ?? "",
      gvhdMoiId: selectedCandidate?.giangVienId ?? "",
      tepDinhKemFile: selectedFile,
    });

    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        errors[field] ??= issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setConfirmedValues(result.data);
  };

  const handleConfirmSubmit = async () => {
    if (!confirmedValues || isSubmitting) return;
    try {
      await onSubmit(confirmedValues);
      setConfirmedValues(null);
    } catch (error) {
      setConfirmedValues(null);
      setFormError(error instanceof Error ? error.message : "Không thể gửi đơn đề xuất.");
    }
  };

  return (
    <section
      aria-label="Biểu mẫu tạo đề xuất thay Nghiên cứu sinh"
      className="rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#164E9B]/10 text-[#164E9B]">
            <FilePlus2 className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F2744]">
              Tạo đơn đề xuất điều chỉnh thay Nghiên cứu sinh
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Chọn học viên đang phụ trách, loại đề xuất và đính kèm tờ trình/biên bản chuyên môn gửi Phòng Đào tạo Sau đại học xét duyệt.
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Đóng biểu mẫu đề xuất"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-[#0F2744] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <form onSubmit={handleValidateAndAskConfirm} className="mt-5 space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor={`${formId}-student`}
              className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#0F2744]"
            >
              <Users className="size-4 text-[#164E9B]" aria-hidden="true" />
              <span>
                Nghiên cứu sinh áp dụng <span className="text-rose-600">*</span>
              </span>
            </label>
            <SupervisorSelect
              id={`${formId}-student`}
              value={selectedStudent?.id ?? null}
              placeholder={students.length ? "Chọn Nghiên cứu sinh" : "Không có NCS trong danh sách"}
              disabled={!students.length}
              invalid={Boolean(fieldErrors.studentId)}
              options={students.map((student) => ({
                value: student.id,
                label: `${student.hoTen} (${student.mshv})`,
              }))}
              onValueChange={(id) => {
                setStudentId(id);
                setGvhdMoiId("");
                setBatKhaKhang(false);
                setFormError(null);
                setFieldErrors({});
              }}
            />
            {renderFieldError("studentId")}
            <p className="mt-1 text-xs text-muted-foreground">
              Chỉ hiển thị các Nghiên cứu sinh thuộc danh sách bạn đang hướng dẫn.
            </p>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold text-[#0F2744]">
              Loại đơn đề xuất <span className="text-rose-600">*</span>
            </span>
            <div
              role="group"
              aria-label="Chọn loại đơn đề xuất"
              className="grid grid-cols-2 gap-2.5"
            >
              <button
                type="button"
                aria-pressed={loaiDon === "DOI_DE_TAI"}
                onClick={() => {
                  setLoaiDon("DOI_DE_TAI");
                  setFieldErrors({});
                  setBatKhaKhang(false);
                  setFormError(null);
                }}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none ${
                  loaiDon === "DOI_DE_TAI"
                    ? "border-[#164E9B] bg-[#164E9B] text-white"
                    : "border-border bg-background text-[#0F2744] hover:bg-muted"
                }`}
              >
                <BookOpen className="size-4 shrink-0" aria-hidden="true" />
                <span>Đổi đề tài</span>
              </button>

              <button
                type="button"
                aria-pressed={loaiDon === "DOI_GVHD"}
                onClick={() => {
                  setLoaiDon("DOI_GVHD");
                  setFieldErrors({});
                  setBatKhaKhang(false);
                  setFormError(null);
                }}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none ${
                  loaiDon === "DOI_GVHD"
                    ? "border-[#164E9B] bg-[#164E9B] text-white"
                    : "border-border bg-background text-[#0F2744] hover:bg-muted"
                }`}
              >
                <UserCog className="size-4 shrink-0" aria-hidden="true" />
                <span>Đổi GVHD</span>
              </button>
            </div>
          </div>
        </div>

        {selectedStudent && (
          <div className="rounded-lg bg-[#F0F5FA] p-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-[#0F2744]">
                Hồ sơ hiện tại: {selectedStudent.hoTen} ({selectedStudent.mshv})
              </p>
              <span className="font-semibold text-[#164E9B]">
                {selectedStudent.khoaDaoTao} •{" "}
                {selectedStudent.daHetHan === null ||
                selectedStudent.daHetHan === undefined ||
                selectedStudent.soThangConLai === null
                  ? "Chưa cập nhật hạn đào tạo"
                  : selectedStudent.daHetHan
                    ? "Đã hết hạn đào tạo"
                    : selectedStudent.soNgayConLai === 0
                      ? "Hôm nay là hạn chót đào tạo"
                      : selectedStudent.soNgayConLai !== null &&
                        selectedStudent.soNgayConLai !== undefined &&
                        selectedStudent.soNgayConLai <= 30
                        ? `Còn lại ${selectedStudent.soNgayConLai} ngày`
                        : `Còn lại ${selectedStudent.soThangConLai} tháng`}
              </span>
            </div>
            <p className="mt-1.5 leading-relaxed text-foreground">
              <strong>Đề tài đang thực hiện:</strong> {selectedStudent.tenDeTai}
            </p>
            <p className="mt-1 text-muted-foreground">
              <strong>Phân công của bạn:</strong>{" "}
              {selectedStudent.vaiTro === "HUONG_DAN_CHINH"
                ? "Hướng dẫn chính (1.0)"
                : "Đồng hướng dẫn (0.5)"}{" "}
              {selectedStudent.gvhdDongHuongDan
                ? `• Đồng hướng dẫn: ${selectedStudent.gvhdDongHuongDan}`
                : ""}
            </p>
          </div>
        )}

        {loaiDon === "DOI_DE_TAI" && selectedStudent && (
          <div className="space-y-4">
            {requiresForceMajeure && (
              <DeadlineWarningBanner
                severity="warning"
                alwaysShow
                title="NCS đã từ Mốc 8 trở lên"
                message="Theo Quy chế đào tạo tiến sĩ, đề xuất điều chỉnh tên đề tài từ Mốc 8 trở đi chỉ được xem xét trong trường hợp bất khả kháng có lý do xác đáng."
              />
            )}

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor={`${formId}-new-title`}
                  className="text-sm font-semibold text-[#0F2744]"
                >
                  Tên đề tài luận án đề xuất mới <span className="text-rose-600">*</span>
                </label>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {tenDeTaiMoi.length}/500 ký tự
                </span>
              </div>
              <textarea
                id={`${formId}-new-title`}
                rows={3}
                maxLength={500}
                aria-invalid={Boolean(fieldErrors.tenDeTaiMoi)}
                value={tenDeTaiMoi}
                onChange={(e) => {
                  setTenDeTaiMoi(e.target.value);
                  clearFieldError("tenDeTaiMoi");
                  if (formError) setFormError(null);
                }}
                placeholder="Nhập đầy đủ tên đề tài luận án đề xuất điều chỉnh..."
                className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
              />
              {renderFieldError("tenDeTaiMoi")}
            </div>
          </div>
        )}

        {loaiDon === "DOI_GVHD" && selectedStudent && (
          <div className="space-y-4">
            {requiresForceMajeure && (
                <DeadlineWarningBanner
                  severity="warning"
                  remainingMonths={selectedStudent.soThangConLai ?? undefined}
                  alwaysShow
                  title="Đã qua hạn gửi đề nghị đổi GVHD"
                  message="Đơn đổi GVHD phải gửi ít nhất 12 tháng trước hạn đào tạo. Vui lòng xác nhận bất khả kháng và nêu rõ lý do."
                />
              )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor={`${formId}-role`}
                  className="mb-1.5 block text-sm font-semibold text-[#0F2744]"
                >
                  Vị trí GVHD cần điều chỉnh <span className="text-rose-600">*</span>
                </label>
                <SupervisorSelect
                  id={`${formId}-role`}
                  value={vaiTroGvhdCanThay}
                  invalid={Boolean(fieldErrors.phanCongCuId)}
                  onValueChange={(role) => {
                    setVaiTroGvhdCanThay(role);
                    clearFieldError("phanCongCuId");
                  }}
                  options={[
                    { value: "DONG_HUONG_DAN", label: "Đồng hướng dẫn (0.5)" },
                    { value: "HUONG_DAN_CHINH", label: "Hướng dẫn chính (1.0)" },
                  ]}
                />
                {renderFieldError("phanCongCuId")}
                <p className="mt-1 text-xs text-muted-foreground">
                  Hiện phụ trách vị trí này:{" "}
                  <strong className="text-[#0F2744]">
                    {currentSupervisorForRole}
                  </strong>
                </p>
              </div>

              <div>
                <label
                  htmlFor={`${formId}-candidate`}
                  className="mb-1.5 block text-sm font-semibold text-[#0F2744]"
                >
                  GVHD mới đề xuất <span className="text-rose-600">*</span>
                </label>
                <SupervisorSelect
                  id={`${formId}-candidate`}
                  value={selectedCandidate?.giangVienId ?? null}
                  placeholder="Chọn Giảng viên hướng dẫn thay thế"
                  invalid={Boolean(fieldErrors.gvhdMoiId)}
                  disabled={isLoadingAssignments || Boolean(assignmentError)}
                  options={availableCandidates.map((candidate) => ({
                    value: candidate.giangVienId,
                    label: `${candidate.hocHamHocVi ?? ""} ${candidate.hoTen} (Còn ${candidate.slotConLai ?? 0} điểm)`.trim(),
                  }))}
                  onValueChange={(id) => {
                    setGvhdMoiId(id);
                    clearFieldError("gvhdMoiId");
                  }}
                />
                {renderFieldError("gvhdMoiId")}
                {selectedCandidate && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selectedCandidate.donViCongTac}
                    {selectedCandidate.linhVucNghienCuu
                      ? ` • ${selectedCandidate.linhVucNghienCuu}`
                      : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor={`${formId}-reason`}
            className="mb-1.5 block text-sm font-semibold text-[#0F2744]"
          >
            Lý do chuyên môn & đề xuất xử lý <span className="text-rose-600">*</span>
          </label>
          <textarea
            id={`${formId}-reason`}
            rows={3}
            aria-invalid={Boolean(fieldErrors.lyDo)}
            value={lyDo}
            onChange={(e) => {
              setLyDo(e.target.value);
              clearFieldError("lyDo");
              if (formError) setFormError(null);
            }}
            placeholder="Trình bày rõ lý do khoa học, biên bản cuộc họp bộ môn/tiểu ban hoặc căn cứ đề xuất thay đổi..."
            className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
          />
          {renderFieldError("lyDo")}
        </div>

        {requiresForceMajeure && (
          <div className="rounded-lg bg-amber-50/80 p-3.5">
            <label
              htmlFor={`${formId}-force-majeure`}
              className="flex min-h-10 cursor-pointer items-start gap-2.5 text-xs font-medium text-amber-950"
            >
              <input
                id={`${formId}-force-majeure`}
                type="checkbox"
                checked={batKhaKhang}
                onChange={(e) => {
                  setBatKhaKhang(e.target.checked);
                  clearFieldError("batKhaKhang");
                }}
                className="mt-0.5 size-4 rounded border-amber-400 text-[#164E9B] focus:ring-[#164E9B]"
              />
              <span>
                Tôi xác nhận đây là trường hợp bất khả kháng / có biên bản hội đồng chuyên môn đề nghị ngoại lệ theo Quy chế đào tạo tiến sĩ.
              </span>
            </label>
            {renderFieldError("batKhaKhang")}
          </div>
        )}

        <div className="space-y-3">
          <PdfUploader
            id={`${formId}-pdf`}
            label="Tờ trình / Biên bản chuyên môn đính kèm (PDF)"
            selectedFile={selectedFile}
            onFileSelect={(file) => {
              setSelectedFile(file);
              clearFieldError("tepDinhKemFile");
            }}
            helperText="Khuyến nghị đính kèm biên bản họp bộ môn hoặc tờ trình có xác nhận Khoa/Viện (tối đa 15MB)."
          />
          {renderFieldError("tepDinhKemFile")}
        </div>

        {isSupervisorChange && isLoadingAssignments && (
          <p role="status" className="text-sm text-muted-foreground">Đang tải phân công và danh sách GVHD...</p>
        )}
        {isSupervisorChange && assignmentError && (
          <p role="alert" className="text-sm text-destructive">{assignmentError.message}</p>
        )}
        {isSupervisorChange && !isLoadingAssignments && !assignmentError && availableCandidates.length === 0 && (
          <p className="text-sm text-muted-foreground">Chưa có GVHD có thể đề xuất.</p>
        )}

        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden="true" />
            <span>{formError}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex min-h-10 items-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] motion-reduce:transition-none"
            >
              Hủy bỏ
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || students.length === 0 || (isSupervisorChange && (isLoadingAssignments || Boolean(assignmentError)))}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0F2744] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <Send className="size-4" aria-hidden="true" />
            <span>Gửi đơn đề xuất thay NCS</span>
          </button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={confirmedValues !== null}
        onClose={() => setConfirmedValues(null)}
        onConfirm={() => void handleConfirmSubmit()}
        variant="info"
        title="Xác nhận nộp đơn đề xuất thay Nghiên cứu sinh"
        description={
          selectedStudent
            ? `Đề xuất ${
                loaiDon === "DOI_DE_TAI" ? "Đổi tên đề tài" : "Đổi GVHD"
              } cho NCS ${selectedStudent.hoTen} (${
                selectedStudent.mshv
              }) sẽ được chuyển tới Phòng Đào tạo Sau đại học để thẩm định và trình ký Quyết định.`
            : ""
        }
        confirmLabel="Xác nhận gửi"
        isLoading={isSubmitting}
      />
    </section>
  );
}

export default SupervisorRequestForm;
