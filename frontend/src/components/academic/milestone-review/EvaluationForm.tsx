"use client";

import { toast } from "sonner";

import { useState, type FormEvent } from "react";
import { ClipboardPenLine, FileText, RotateCcw, Unlink } from "lucide-react";
import { PdfUploader } from "@/src/components/upload/PdfUploader";
import { ApiClientError } from "@/src/lib/api";
import { useSaveMilestoneEvaluation } from "@/src/hooks/api/use-milestone-review";
import { useDocumentMetadata, useUploadDocument } from "@/src/hooks/api/use-documents";
import type { ReviewEvaluation } from "@/src/types/api/progress";
import { MilestoneFormDialog } from "./MilestoneFormDialog";

interface EvaluationFormProps {
  evidenceId: string;
  ncsId: string;
  evaluation?: ReviewEvaluation;
  onClose: () => void;
}

const inputClass = "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#164E9B]";

export function EvaluationForm({ evidenceId, ncsId, evaluation, onClose }: EvaluationFormProps) {
  const { data: existingFile } = useDocumentMetadata(evaluation?.fileId);
  const [file, setFile] = useState<File | null>(null);
  const [uploaderVersion, setUploaderVersion] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadedId, setUploadedId] = useState<string>();
  const [removeFile, setRemoveFile] = useState(false);
  const [error, setError] = useState<ApiClientError | Error | null>(null);
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const upload = useUploadDocument();
  const save = useSaveMilestoneEvaluation(evidenceId);
  const busy = upload.isPending || save.isPending;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || fileError) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("reviewer") ?? "").trim();
    if (!name) {
      setError(new Error("Vui lòng nhập họ tên người chấm."));
      return;
    }

    setError(null);
    try {
      let fileId: string | null | undefined = removeFile ? null : uploadedId;
      if (file && !uploadedId) {
        const uploaded = await upload.mutateAsync({ file, documentType: "PHIEU_NHAN_XET", ncsId });
        setUploadedId(uploaded.id);
        fileId = uploaded.id;
      }
      await save.mutateAsync({
        id: evaluation?.id,
        payload: {
          tenNguoiCham: name,
          donViNguoiCham: String(form.get("unit") ?? "").trim() || null,
          diem: Number(form.get("score")),
          nhanXet: String(form.get("comment") ?? "").trim() || null,
          fileId,
          xacNhanTrung: allowDuplicate,
        },
      });
      toast.success(evaluation ? "Đã cập nhật phiếu nhận xét." : "Đã nhập phiếu nhận xét.");
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error : new Error("Không thể lưu phiếu nhận xét."));
    }
  }

  return (
    <MilestoneFormDialog
      title={evaluation ? "Sửa phiếu nhận xét" : "Nhập phiếu nhận xét"}
      description="Ghi nhận điểm và nhận xét của thành viên chấm mốc tiến độ."
      icon={<ClipboardPenLine className="size-5" />}
      submitLabel={evaluation ? "Lưu thay đổi" : "Lưu phiếu"}
      busyLabel={upload.isPending ? "Đang tải PDF..." : "Đang lưu phiếu..."}
      busy={busy}
      submitDisabled={!!fileError}
      onClose={onClose}
      onSubmit={submit}
    >
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-rose-700">{error.message}</p>}
      {error instanceof ApiClientError && error.code === "PHIEU_TRUNG_NGUOI_CHAM" && (
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={allowDuplicate} onChange={(event) => setAllowDuplicate(event.target.checked)} />
          Xác nhận đây là người chấm khác trùng tên
        </label>
      )}
      <fieldset disabled={busy} className="min-w-0 space-y-3">
        <label className="block font-semibold">Họ tên người chấm
          <input name="reviewer" required maxLength={150} defaultValue={evaluation?.tenNguoiCham} onChange={() => setAllowDuplicate(false)} className={inputClass} />
        </label>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <label className="block font-semibold">Đơn vị công tác
            <input name="unit" maxLength={255} defaultValue={evaluation?.donViNguoiCham ?? ""} onChange={() => setAllowDuplicate(false)} className={inputClass} />
          </label>
          <label className="block font-semibold">Điểm (thang 10)
            <input name="score" type="number" min="0" max="10" step="0.1" required defaultValue={evaluation?.diem} className={inputClass} />
          </label>
        </div>
        <label className="block font-semibold">Nhận xét
          <textarea name="comment" rows={3} maxLength={2000} defaultValue={evaluation?.nhanXet ?? ""} className={inputClass} />
        </label>
        <div className="space-y-2 border-t border-slate-100 pt-3">
          {evaluation?.fileId && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="size-4 shrink-0 text-[#164E9B]" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-800">{existingFile?.originalName ?? "Tệp PDF hiện tại"}</p>
                  <p className="mt-0.5 text-slate-600">
                    {file ? "Sẽ được thay khi lưu phiếu" : removeFile ? "Sẽ được gỡ khi lưu phiếu" : "Đang đính kèm"}
                  </p>
                </div>
              </div>
              {!file && (
                <button type="button" onClick={() => setRemoveFile(!removeFile)} disabled={busy}
                  className={`inline-flex items-center gap-1.5 rounded-lg border bg-white px-2.5 py-1.5 font-semibold ${removeFile ? "border-blue-200 text-[#164E9B] hover:bg-blue-50" : "border-rose-200 text-rose-700 hover:bg-rose-50"}`}>
                  {removeFile ? <RotateCcw className="size-3.5" /> : <Unlink className="size-3.5" />}
                  {removeFile ? "Giữ tệp" : "Gỡ tệp"}
                </button>
              )}
            </div>
          )}
          <PdfUploader
            key={uploaderVersion}
            label={evaluation?.fileId ? "Thay tệp PDF" : "Đính kèm PDF (không bắt buộc)"}
            selectedFile={file}
            disabled={busy}
            error={fileError}
            onValidationError={setFileError}
            onFileSelect={(nextFile) => {
              setFile(nextFile);
              setUploadedId(undefined);
              if (nextFile) setRemoveFile(false);
            }}
          />
          {fileError && (
            <button type="button" onClick={() => { setFileError(null); setUploaderVersion((version) => version + 1); }} className="font-semibold text-[#164E9B] underline">
              Bỏ qua tệp không hợp lệ
            </button>
          )}
        </div>
      </fieldset>
    </MilestoneFormDialog>
  );
}
