"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { PdfUploader } from "@/src/components/upload/PdfUploader";
import { useUploadDocument } from "@/src/hooks/api/use-documents";
import { useApproveChangeRequest, useChangeRequestDecisions, useRejectChangeRequest } from "@/src/hooks/use-change-requests";
import { parseApiError } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import { DecisionService } from "@/src/services/decision";
import type { ApproveChangeRequestPayload, ChangeRequestDetail } from "@/src/types/api/change-request";
import { REQUEST_TYPES } from "./change-request-labels";

const existingDecisionSchema = z.object({
  quyetDinhId: z.uuid("Vui lòng chọn quyết định hợp lệ."),
  resetTuMoc: z.number().int().min(2).max(7).optional(),
});

const newDecisionSchema = z.object({
  soQuyetDinh: z.string().trim().min(1, "Vui lòng nhập số quyết định.").max(50, "Số quyết định tối đa 50 ký tự."),
  ngayQuyetDinh: z.iso.date("Vui lòng nhập ngày ký hợp lệ."),
  ghiChu: z.string().trim().max(500, "Ghi chú tối đa 500 ký tự."),
});

const rejectionSchema = z.string().trim()
  .min(1, "Vui lòng nhập lý do từ chối.")
  .max(2000, "Lý do từ chối tối đa 2.000 ký tự.");

type ApprovalField = keyof z.infer<typeof existingDecisionSchema> | keyof z.infer<typeof newDecisionSchema>;
type ApprovalErrors = Partial<Record<ApprovalField, string[]>>;

const RESET_OPTIONS = [
  { value: "none", label: "Không đặt lại mốc" },
  ...Array.from({ length: 6 }, (_, index) => ({ value: String(index + 2), label: `Từ mốc ${index + 2}` })),
];
const DECISION_MODES = [{ value: "new", label: "Nhập quyết định mới" }, { value: "existing", label: "Chọn quyết định có sẵn" }];
const DECISION_TYPE_LABELS = { GIAO_DE_TAI: "Giao đề tài", PHAN_CONG_GVHD: "Phân công GVHD", GIA_HAN: "Gia hạn" };

interface RequestFormProps {
  request: ChangeRequestDetail;
  onBack: () => void;
  onSuccess: () => void;
  onBusyChange: (busy: boolean) => void;
}

export function ChangeRequestApprovalForm({
  request, onBack, onSuccess, onBusyChange, area,
}: RequestFormProps & { area: "academic" | "admin" }) {
  const id = useId();
  const extension = request.loai === "GIA_HAN";
  const decisionType = REQUEST_TYPES.find(({ value }) => value === request.loai)!.decisionType;
  const [mode, setMode] = useState(extension ? "new" : "existing");
  const [decisionId, setDecisionId] = useState<string | null>(null);
  const [reset, setReset] = useState("none");
  const [number, setNumber] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string>();
  const [fileError, setFileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ApprovalErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittedDate = request.createdAt.slice(0, 10);

  const decisions = useChangeRequestDecisions(request.ncsId, decisionType, mode === "existing");
  const decisionOptions = (decisions.data ?? [])
    .filter((item) => item.ngayQuyetDinh >= submittedDate)
    .map((item) => ({
      value: item.id,
      label: `${item.soQuyetDinh} · ${formatDate(item.ngayQuyetDinh)}`,
    }));
  const approve = useApproveChangeRequest();
  const upload = useUploadDocument();

  function clearError(field: ApprovalField) {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitError("");
    setErrors({});

    let payload: ApproveChangeRequestPayload;
    if (mode === "existing") {
      const belongsToOptions = decisionOptions.some((option) => option.value === decisionId);
      const result = existingDecisionSchema.safeParse({
        quyetDinhId: belongsToOptions ? decisionId : "",
        resetTuMoc: request.loai === "DOI_DE_TAI" && reset !== "none" ? Number(reset) : undefined,
      });
      if (!result.success) {
        setErrors(z.flattenError(result.error).fieldErrors);
        return;
      }
      payload = result.data;
    } else {
      const result = newDecisionSchema.safeParse({ soQuyetDinh: number, ngayQuyetDinh: date, ghiChu: note });
      if (!result.success) {
        setErrors(z.flattenError(result.error).fieldErrors);
        return;
      }
      if (result.data.ngayQuyetDinh < submittedDate) {
        setErrors({ ngayQuyetDinh: ["Ngày ký không được trước ngày gửi đề nghị."] });
        return;
      }
      if (fileError) return;
      const { ghiChu, ...decision } = result.data;
      payload = { ...decision, ...(ghiChu && { ghiChu }) };
    }

    setIsSubmitting(true);
    onBusyChange(true);
    try {
      if ("soQuyetDinh" in payload) {
        const sameNumber = await DecisionService.list(undefined, { soQuyetDinh: payload.soQuyetDinh });
        const conflict = sameNumber.find((item) =>
          item.loai !== "GIA_HAN" || item.ncsId === request.ncsId || item.ngayQuyetDinh !== date,
        );
        if (conflict) {
          setErrors({ soQuyetDinh: ["Số quyết định đã dùng cho NCS này hoặc đã đăng ký với loại/ngày ký khác."] });
          return;
        }

        if (file) {
          const fileId = uploadedFileId ?? (await upload.mutateAsync({
            file, documentType: "QUYET_DINH", ncsId: request.ncsId,
          })).id;
          setUploadedFileId(fileId);
          payload.fileId = fileId;
        }
      }

      await approve.mutateAsync({ id: request.id, payload });
      toast.success(`Đã duyệt đề nghị của NCS ${request.ncs.hoTen}.`);
      onSuccess();
    } catch (error) {
      setSubmitError(parseApiError(error).message);
    } finally {
      onBusyChange(false);
      setIsSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={submit} className="space-y-4">
      {submitError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{submitError}</p>}
      <fieldset disabled={isSubmitting} className="min-w-0 space-y-4">
        {extension && (
          <div className="space-y-1.5">
            <label htmlFor={`${id}-mode`} className="text-sm font-medium">Cách ban hành quyết định</label>
            <Select items={DECISION_MODES} value={mode} disabled={isSubmitting} onValueChange={(value) => {
              if (!value) return;
              setMode(value);
              setErrors({});
              setSubmitError("");
            }}>
              <SelectTrigger id={`${id}-mode`} className="h-9 w-full"><SelectValue /></SelectTrigger>
              <SelectContent alignItemWithTrigger={false} positionerClassName="z-[60]">
                {DECISION_MODES.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {mode === "existing" ? (
          <div className="space-y-1.5">
            <label htmlFor={`${id}-decision`} className="text-sm font-medium">Quyết định {DECISION_TYPE_LABELS[decisionType]} *</label>
            <Select
              items={decisionOptions}
              value={decisionId}
              disabled={!decisionOptions.length || decisions.isError || isSubmitting}
              onValueChange={(value) => { setDecisionId(value); clearError("quyetDinhId"); }}
            >
              <SelectTrigger id={`${id}-decision`} className="h-9 w-full" aria-invalid={Boolean(errors.quyetDinhId)} aria-describedby={errors.quyetDinhId ? `${id}-decision-error` : undefined}>
                <SelectValue placeholder={decisions.isPending ? "Đang tải quyết định…" : "Chọn quyết định"} />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} positionerClassName="z-[60]">
                {decisionOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.quyetDinhId && <p id={`${id}-decision-error`} className="text-xs text-rose-700">{errors.quyetDinhId[0]}</p>}
            {decisions.isError && (
              <div role="alert" className="flex flex-wrap items-center gap-2 text-xs text-rose-700">
                {parseApiError(decisions.error).message}
                <Button type="button" variant="outline" size="xs" onClick={() => void decisions.refetch()}>Thử lại</Button>
              </div>
            )}
            {decisions.isSuccess && !decisionOptions.length && (
              <p className="text-xs text-slate-600">
                Chưa có quyết định còn hiệu lực của NCS được ký từ ngày gửi đề nghị.{" "}
                <Link href={`/${area}/decisions`} className="font-semibold text-[#164E9B] hover:underline">Mở Quản lý quyết định</Link>
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor={`${id}-number`} className="text-sm font-medium">Số quyết định *</label>
                <Input
                  id={`${id}-number`} value={number} placeholder="125/QĐ-ĐHAG"
                  onChange={(event) => { setNumber(event.target.value); clearError("soQuyetDinh"); }}
                  aria-invalid={Boolean(errors.soQuyetDinh)} aria-describedby={errors.soQuyetDinh ? `${id}-number-error` : undefined}
                />
                {errors.soQuyetDinh && <p id={`${id}-number-error`} className="text-xs text-rose-700">{errors.soQuyetDinh[0]}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor={`${id}-date`} className="text-sm font-medium">Ngày ký *</label>
                <Input
                  id={`${id}-date`} type="date" min={submittedDate} value={date}
                  onInput={(event) => { setDate(event.currentTarget.value); clearError("ngayQuyetDinh"); }}
                  aria-invalid={Boolean(errors.ngayQuyetDinh)} aria-describedby={errors.ngayQuyetDinh ? `${id}-date-error` : undefined}
                />
                {errors.ngayQuyetDinh && <p id={`${id}-date-error`} className="text-xs text-rose-700">{errors.ngayQuyetDinh[0]}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor={`${id}-note`} className="text-sm font-medium">Ghi chú quyết định</label>
              <textarea
                id={`${id}-note`} rows={2} value={note}
                className="w-full rounded-lg border border-input p-2.5 text-sm aria-invalid:border-rose-500"
                onChange={(event) => { setNote(event.target.value); clearError("ghiChu"); }}
                aria-invalid={Boolean(errors.ghiChu)} aria-describedby={errors.ghiChu ? `${id}-note-error` : undefined}
              />
              {errors.ghiChu && <p id={`${id}-note-error`} className="text-xs text-rose-700">{errors.ghiChu[0]}</p>}
            </div>
            <PdfUploader
              id={`${id}-file`} label="File quyết định (không bắt buộc)" selectedFile={file}
              onFileSelect={(value) => { setFile(value); setUploadedFileId(undefined); setSubmitError(""); }}
              onValidationError={setFileError} error={fileError} disabled={isSubmitting}
            />
          </>
        )}

        {request.loai === "DOI_DE_TAI" && (
          <div className="space-y-1.5">
            <label htmlFor={`${id}-reset`} className="text-sm font-medium">Đặt lại tiến trình</label>
            <Select items={RESET_OPTIONS} value={reset} disabled={isSubmitting} onValueChange={(value) => {
              setReset(value ?? "none");
              clearError("resetTuMoc");
            }}>
              <SelectTrigger id={`${id}-reset`} className="h-9 w-full" aria-invalid={Boolean(errors.resetTuMoc)}><SelectValue /></SelectTrigger>
              <SelectContent alignItemWithTrigger={false} positionerClassName="z-[60]">
                {RESET_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.resetTuMoc && <p className="text-xs text-rose-700">{errors.resetTuMoc[0]}</p>}
            {reset !== "none" && <p className="text-xs text-amber-800">Khi duyệt, các mốc từ mốc {reset} trở đi sẽ được đặt lại theo quy trình.</p>}
          </div>
        )}
      </fieldset>
      <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={onBack}>Quay lại</Button>
        <Button
          type="submit" className="bg-[#164E9B] text-white hover:bg-[#123E7C]"
          disabled={isSubmitting || (mode === "existing" && (decisions.isPending || decisions.isError || !decisionOptions.length))}
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          {upload.isPending ? "Đang tải PDF…" : isSubmitting ? "Đang xử lý…" : "Xác nhận duyệt"}
        </Button>
      </div>
    </form>
  );
}

export function ChangeRequestRejectionForm({ request, onBack, onSuccess, onBusyChange }: RequestFormProps) {
  const id = useId();
  const [reason, setReason] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const reject = useRejectChangeRequest();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (reject.isPending) return;
    const result = rejectionSchema.safeParse(reason);
    if (!result.success) {
      setFieldError(result.error.issues[0].message);
      return;
    }

    setFieldError("");
    setSubmitError("");
    onBusyChange(true);
    try {
      await reject.mutateAsync({ id: request.id, lyDoTuChoi: result.data });
      toast.success(`Đã từ chối đề nghị của NCS ${request.ncs.hoTen}.`);
      onSuccess();
    } catch (error) {
      setSubmitError(parseApiError(error).message);
    } finally {
      onBusyChange(false);
    }
  }

  return (
    <form noValidate onSubmit={submit} className="space-y-4">
      {submitError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{submitError}</p>}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={id} className="text-sm font-medium">Lý do từ chối *</label>
          <span className="text-xs tabular-nums text-slate-500">{reason.trim().length}/2000</span>
        </div>
        <textarea
          id={id} rows={4} value={reason} disabled={reject.isPending}
          className="w-full rounded-lg border border-input p-2.5 text-sm aria-invalid:border-rose-500"
          onChange={(event) => { setReason(event.target.value); setFieldError(""); setSubmitError(""); }}
          aria-invalid={Boolean(fieldError)} aria-describedby={fieldError ? `${id}-error` : undefined}
        />
        {fieldError && <p id={`${id}-error`} className="text-xs text-rose-700">{fieldError}</p>}
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" disabled={reject.isPending} onClick={onBack}>Quay lại</Button>
        <Button type="submit" variant="destructive" disabled={reject.isPending}>
          {reject.isPending && <Loader2 className="animate-spin" />}
          {reject.isPending ? "Đang từ chối…" : "Xác nhận từ chối"}
        </Button>
      </div>
    </form>
  );
}
