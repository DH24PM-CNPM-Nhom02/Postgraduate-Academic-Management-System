"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
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
import { UploadProgress } from "@/src/components/upload/UploadProgress";
import type { CandidateSupervisorOption } from "@/src/types/ui/change-request";
import type {
  SupervisedStudent,
  SupervisorProfile,
  SupervisorProxyRequestFormValues,
  SupervisorProxyRequestType,
  SupervisorRole,
} from "@/src/types/ui/supervisor";
import type { UploadStatus } from "@/src/types/ui/upload";

export interface SupervisorRequestFormProps {
  students: SupervisedStudent[];
  candidateSupervisors: CandidateSupervisorOption[];
  supervisorProfile?: SupervisorProfile;
  initialStudentId?: string;
  initialType?: SupervisorProxyRequestType;
  isSubmitting?: boolean;
  onSubmit: (values: SupervisorProxyRequestFormValues) => void | Promise<void>;
  onCancel?: () => void;
}

function normalizeName(value?: string): string {
  return (value ?? "")
    .replace(/^(PGS\.TS\.|GS\.TS\.|TS\.|ThS\.)\s*/i, "")
    .trim()
    .toLowerCase();
}

export function SupervisorRequestForm({
  students,
  candidateSupervisors,
  supervisorProfile,
  initialStudentId,
  initialType = "DOI_DE_TAI",
  isSubmitting = false,
  onSubmit,
  onCancel,
}: SupervisorRequestFormProps) {
  const formId = useId();
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
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("success");
  const [uploadProgress, setUploadProgress] = useState(100);
  const uploadTimerRef = useRef<number | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (uploadTimerRef.current !== null) {
        window.clearInterval(uploadTimerRef.current);
      }
    };
  }, []);

  const selectedStudent = useMemo(
    () => students.find((st) => st.id === studentId) ?? null,
    [students, studentId]
  );

  const currentSupervisorForRole = useMemo(() => {
    if (!selectedStudent) return "";
    const myFullName = supervisorProfile?.hoTen || "PGS.TS. Trần Quốc Tuấn";
    if (vaiTroGvhdCanThay === "HUONG_DAN_CHINH") {
      return selectedStudent.vaiTro === "HUONG_DAN_CHINH"
        ? myFullName
        : "Chờ cập nhật GVHD chính";
    }
    if (selectedStudent.vaiTro === "DONG_HUONG_DAN") {
      return myFullName;
    }
    return selectedStudent.gvhdDongHuongDan || "Chưa có GVHD đồng hướng dẫn";
  }, [selectedStudent, supervisorProfile, vaiTroGvhdCanThay]);

  const availableCandidates = useMemo(() => {
    if (!selectedStudent) return candidateSupervisors;
    const excludedNames = new Set(
      [
        normalizeName(supervisorProfile?.hoTen),
        normalizeName(selectedStudent.gvhdDongHuongDan),
      ].filter(Boolean)
    );
    return candidateSupervisors.filter(
      (cand) => !excludedNames.has(normalizeName(cand.hoTen))
    );
  }, [candidateSupervisors, selectedStudent, supervisorProfile]);

  const selectedCandidate = useMemo(
    () => availableCandidates.find((c) => c.giangVienId === gvhdMoiId) ?? null,
    [availableCandidates, gvhdMoiId]
  );

  const requiresForceMajeure = useMemo(() => {
    if (!selectedStudent) return false;
    if (loaiDon === "DOI_DE_TAI") {
      return selectedStudent.mocHienTai >= 8;
    }
    return selectedStudent.soThangConLai < 12;
  }, [loaiDon, selectedStudent]);

  const handleSelectFile = (file: File | null) => {
    if (uploadTimerRef.current !== null) {
      window.clearInterval(uploadTimerRef.current);
      uploadTimerRef.current = null;
    }

    setSelectedFile(file);
    if (!file) {
      setUploadProgress(0);
      setUploadStatus("success");
      return;
    }

    setUploadStatus("uploading");
    setUploadProgress(25);
    uploadTimerRef.current = window.setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          if (uploadTimerRef.current !== null) {
            window.clearInterval(uploadTimerRef.current);
            uploadTimerRef.current = null;
          }
          setUploadStatus("success");
          return 100;
        }
        const next = Math.min(100, prev + 35);
        if (next === 100) {
          setUploadStatus("success");
          if (uploadTimerRef.current !== null) {
            window.clearInterval(uploadTimerRef.current);
            uploadTimerRef.current = null;
          }
        }
        return next;
      });
    }, 180);
  };

  const handleValidateAndAskConfirm = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!selectedStudent) {
      setFormError("Vui lòng chọn Nghiên cứu sinh cần lập đơn đề xuất.");
      return;
    }

    if (loaiDon === "DOI_DE_TAI") {
      const trimmedTitle = tenDeTaiMoi.trim();
      if (trimmedTitle.length < 15) {
        setFormError("Vui lòng nhập tên đề tài mới tối thiểu 15 ký tự.");
        return;
      }
      if (trimmedTitle.length > 500) {
        setFormError("Tên đề tài mới không được vượt quá 500 ký tự.");
        return;
      }
      if (trimmedTitle.toLowerCase() === selectedStudent.tenDeTai.trim().toLowerCase()) {
        setFormError("Tên đề tài mới đang trùng với tên đề tài hiện tại của NCS.");
        return;
      }
    }

    if (loaiDon === "DOI_GVHD" && !gvhdMoiId) {
      setFormError("Vui lòng chọn Giảng viên hướng dẫn mới được đề xuất.");
      return;
    }

    if (lyDo.trim().length < 15) {
      setFormError("Vui lòng nhập lý do & cơ sở chuyên môn tối thiểu 15 ký tự.");
      return;
    }

    if (requiresForceMajeure && !batKhaKhang) {
      setFormError(
        "Trường hợp này yêu cầu tick xác nhận điều kiện bất khả kháng theo Quy chế đào tạo tiến sĩ."
      );
      return;
    }

    if (selectedFile && uploadStatus === "uploading") {
      setFormError("Tệp PDF đang tải lên, vui lòng chờ hoàn tất trong giây lát.");
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedStudent) return;
    await onSubmit({
      studentId: selectedStudent.id,
      loaiDon,
      lyDo: lyDo.trim(),
      batKhaKhang,
      tenDeTaiMoi: loaiDon === "DOI_DE_TAI" ? tenDeTaiMoi.trim() : undefined,
      vaiTroGvhdCanThay: loaiDon === "DOI_GVHD" ? vaiTroGvhdCanThay : undefined,
      tenGvhdCu: loaiDon === "DOI_GVHD" ? currentSupervisorForRole : undefined,
      gvhdMoiId: loaiDon === "DOI_GVHD" ? gvhdMoiId : undefined,
      tepDinhKemFile: selectedFile,
    });
    setConfirmOpen(false);
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
            <select
              id={`${formId}-student`}
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setGvhdMoiId("");
                setFormError(null);
              }}
              className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
            >
              {students.length === 0 ? (
                <option value="">Không có NCS nào trong danh sách</option>
              ) : (
                students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.hoTen} ({st.mshv}) — Mốc {st.mocHienTai}/9
                  </option>
                ))
              )}
            </select>
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
                {selectedStudent.khoaDaoTao} • Còn lại {selectedStudent.soThangConLai} tháng
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
            {selectedStudent.mocHienTai >= 8 && (
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
                value={tenDeTaiMoi}
                onChange={(e) => {
                  setTenDeTaiMoi(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="Nhập đầy đủ tên đề tài luận án đề xuất điều chỉnh..."
                className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
              />
            </div>
          </div>
        )}

        {loaiDon === "DOI_GVHD" && selectedStudent && (
          <div className="space-y-4">
            {selectedStudent.soThangConLai < 12 && (
              <DeadlineWarningBanner
                severity="warning"
                remainingMonths={selectedStudent.soThangConLai}
                alwaysShow
                title="Thời gian đào tạo còn dưới 12 tháng"
                message="NCS có thời hạn khóa học còn lại dưới 12 tháng. Cần xác nhận lý do bất khả kháng khi đề xuất thay đổi GVHD."
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
                <select
                  id={`${formId}-role`}
                  value={vaiTroGvhdCanThay}
                  onChange={(e) =>
                    setVaiTroGvhdCanThay(e.target.value as SupervisorRole)
                  }
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
                >
                  <option value="DONG_HUONG_DAN">Đồng hướng dẫn (0.5)</option>
                  <option value="HUONG_DAN_CHINH">Hướng dẫn chính (1.0)</option>
                </select>
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
                <select
                  id={`${formId}-candidate`}
                  value={gvhdMoiId}
                  onChange={(e) => {
                    setGvhdMoiId(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
                >
                  <option value="">-- Chọn Giảng viên hướng dẫn thay thế --</option>
                  {availableCandidates.map((cand) => (
                    <option key={cand.giangVienId} value={cand.giangVienId}>
                      {cand.hocHamHocVi} {cand.hoTen} (Còn {cand.slotConLai ?? 0} điểm)
                    </option>
                  ))}
                </select>
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
            value={lyDo}
            onChange={(e) => {
              setLyDo(e.target.value);
              if (formError) setFormError(null);
            }}
            placeholder="Trình bày rõ lý do khoa học, biên bản cuộc họp bộ môn/tiểu ban hoặc căn cứ đề xuất thay đổi..."
            className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]"
          />
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
                onChange={(e) => setBatKhaKhang(e.target.checked)}
                className="mt-0.5 size-4 rounded border-amber-400 text-[#164E9B] focus:ring-[#164E9B]"
              />
              <span>
                Tôi xác nhận đây là trường hợp bất khả kháng / có biên bản hội đồng chuyên môn đề nghị ngoại lệ theo Quy chế đào tạo tiến sĩ.
              </span>
            </label>
          </div>
        )}

        <div className="space-y-3">
          <PdfUploader
            id={`${formId}-pdf`}
            label="Tờ trình / Biên bản chuyên môn đính kèm (PDF)"
            selectedFile={selectedFile}
            onFileSelect={handleSelectFile}
            helperText="Khuyến nghị đính kèm biên bản họp bộ môn hoặc tờ trình có xác nhận Khoa/Viện (tối đa 15MB)."
          />

          {selectedFile && (
            <UploadProgress
              fileName={selectedFile.name}
              fileSize={selectedFile.size}
              progress={uploadProgress}
              status={uploadStatus}
              onRemove={() => handleSelectFile(null)}
            />
          )}
        </div>

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
            disabled={isSubmitting || students.length === 0}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#164E9B] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0F2744] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B] focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <Send className="size-4" aria-hidden="true" />
            <span>Gửi đơn đề xuất thay NCS</span>
          </button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
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
