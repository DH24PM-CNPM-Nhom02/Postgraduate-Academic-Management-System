"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { PdfUploader } from "@/src/components/upload/PdfUploader";
import { useUploadDocument } from "@/src/hooks/api/use-documents";
import { useGraduationDetail, useUpdateGraduationEvidence } from "@/src/hooks/api/use-graduation";
import { parseApiError } from "@/src/lib/api";
import type { GraduationCheckApiResponse, GraduationDetail } from "@/src/types/api/graduation";
import { GraduationDialog, GraduationDialogFooter, GraduationLoadError, graduationPrimaryButton } from "./GraduationDialog";
import { GraduationDocumentButton } from "./GraduationDocumentButton";
import { canConfirmGraduation, hasGraduated, isGraduationDate, studyStatusLabel } from "./graduation-status";

const evidence = {
  "ngoai-ngu": { code: "NGOAI_NGU", type: "MINH_CHUNG_NGOAI_NGU", title: "Xác nhận ngoại ngữ" },
  "cong-no": { code: "CONG_NO", type: "MINH_CHUNG_CONG_NO", title: "Xác nhận công nợ" },
} as const;
type EvidenceKind = keyof typeof evidence;

function GraduationEvidenceForm({ detail, kind, onBack, onSaving }: {
  detail: GraduationDetail;
  kind: EvidenceKind;
  onBack: () => void;
  onSaving: (saving: boolean) => void;
}) {
  const isLanguage = kind === "ngoai-ngu";
  const savedLanguage = detail.xacNhan.ngoaiNgu;
  const savedDebt = detail.xacNhan.congNo;
  const condition = detail.dieuKien.find(({ ma }) => ma === evidence[kind].code);
  const savedResult = isLanguage ? savedLanguage?.dat : savedDebt?.khongConCongNo;
  const [result, setResult] = useState<string | null>(
    savedResult === undefined ? null : String(savedResult),
  );
  const [standard, setStandard] = useState(savedLanguage?.chuanDauRa ?? "");
  const [recognizedDate, setRecognizedDate] = useState(savedLanguage?.ngayCongNhanNgoaiNgu ?? "");
  const [notes, setNotes] = useState((isLanguage ? savedLanguage?.ghiChu : savedDebt?.ghiChu) ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const upload = useUploadDocument();
  const update = useUpdateGraduationEvidence();
  const items = isLanguage
    ? { true: "Đạt chuẩn", false: "Chưa đạt chuẩn" }
    : { true: "Không còn công nợ", false: "Còn công nợ" };
  const needsLanguageDetails = isLanguage && result === "true";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || result === null) return;
    if (needsLanguageDetails && (!standard.trim() || !isGraduationDate(recognizedDate))) {
      setFormError("Nhập chuẩn đầu ra và ngày công nhận ngoại ngữ hợp lệ.");
      return;
    }

    setSaving(true);
    onSaving(true);
    setFormError(undefined);
    try {
      // Keep the uploaded ID if saving the assessment fails and the operator retries.
      let fileId = uploadedFileId;
      if (file && !fileId) {
        const uploaded = await upload.mutateAsync({
          file,
          documentType: evidence[kind].type,
          ncsId: detail.ncsId,
        });
        fileId = uploaded.id;
        setUploadedFileId(fileId);
      }
      const common = { ncsId: detail.ncsId, fileId, ghiChu: notes.trim() || undefined };
      await update.mutateAsync(isLanguage
        ? {
            ...common,
            kind: "ngoai-ngu",
            dat: result === "true",
            chuanDauRa: needsLanguageDetails ? standard.trim() : undefined,
            ngayCongNhanNgoaiNgu: needsLanguageDetails ? recognizedDate : undefined,
          }
        : { ...common, kind: "cong-no", khongConCongNo: result === "true" });
      toast.success(isLanguage ? "Đã lưu xác nhận ngoại ngữ." : "Đã lưu xác nhận công nợ.");
      onBack();
    } catch (error) {
      setFormError(parseApiError(error).message);
    } finally {
      setSaving(false);
      onSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex min-h-0 flex-col">
      <div className="space-y-4 overflow-y-auto p-5 sm:p-6">
        <div className="space-y-1.5">
          <label id="graduation-evidence-result" className="block text-xs font-semibold text-slate-700">Kết quả xác nhận</label>
          <Select items={items} value={result} onValueChange={setResult} disabled={saving}>
            <SelectTrigger aria-labelledby="graduation-evidence-result" className="h-9 w-full">
              <SelectValue placeholder="Chọn kết quả" />
            </SelectTrigger>
            <SelectContent positionerClassName="z-[70]" alignItemWithTrigger={false}>
              {Object.entries(items).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {needsLanguageDetails && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-xs font-semibold text-slate-700">
              <span>Chuẩn đầu ra ngoại ngữ *</span>
              <Input value={standard} maxLength={100} required disabled={saving} onChange={(event) => setStandard(event.target.value)} />
            </label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-700">
              <span>Ngày công nhận *</span>
              <Input type="date" value={recognizedDate} required disabled={saving} onChange={(event) => setRecognizedDate(event.target.value)} />
            </label>
          </div>
        )}
        <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
          <span>Ghi chú</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={500}
            disabled={saving}
            rows={2}
            className="w-full rounded-lg border border-input px-3 py-2 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-[#164E9B]/30 disabled:opacity-60"
          />
        </label>
        <PdfUploader
          label={condition?.fileId ? "Thay minh chứng PDF (tùy chọn)" : "Minh chứng PDF (tùy chọn)"}
          selectedFile={file}
          onFileSelect={(nextFile) => {
            setFile(nextFile);
            setUploadedFileId(undefined);
          }}
          disabled={saving}
        />
        {condition?.fileId && !file && !saving && (
          <GraduationDocumentButton fileId={condition.fileId} label="Xem minh chứng hiện tại" />
        )}
        {formError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{formError}</p>}
      </div>
      <GraduationDialogFooter>
        <Button type="button" variant="outline" onClick={onBack} disabled={saving}>Quay lại</Button>
        <Button type="submit" disabled={saving || result === null} className={graduationPrimaryButton}>
          {saving ? "Đang lưu…" : "Lưu xác nhận"}
        </Button>
      </GraduationDialogFooter>
    </form>
  );
}

export function GraduationDetailDialog({ student, onClose, onConfirm }: {
  student: GraduationCheckApiResponse;
  onClose: () => void;
  onConfirm: (detail: GraduationDetail) => void;
}) {
  const query = useGraduationDetail(student.ncsId);
  const [editing, setEditing] = useState<EvidenceKind | null>(null);
  const [saving, setSaving] = useState(false);
  const detail = query.data;
  const editKind = editing && detail && !hasGraduated(detail) ? editing : null;
  const description = `${student.hoTen} · ${student.mshv}`;

  return (
    <GraduationDialog
      title={editKind ? evidence[editKind].title : "Chi tiết xét tốt nghiệp"}
      description={description}
      busy={saving}
      onClose={onClose}
    >
      {detail && editKind ? (
        <GraduationEvidenceForm
          key={editKind}
          detail={detail}
          kind={editKind}
          onBack={() => setEditing(null)}
          onSaving={setSaving}
        />
      ) : (
        <>
          <div className="space-y-4 overflow-y-auto p-5 sm:p-6">
            {query.isPending && <p role="status" className="text-sm text-slate-500">Đang kiểm tra điều kiện…</p>}
            {query.isError && <GraduationLoadError message={query.error.message} onRetry={() => void query.refetch()} />}
            {detail && !query.isError && (
              <>
                <div className="flex flex-wrap justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span>Trạng thái học tập <strong>{studyStatusLabel(detail.trangThaiHocTap)}</strong></span>
                  <strong>{hasGraduated(detail) ? "Đã tốt nghiệp" : detail.duDieuKien ? "Đủ điều kiện" : "Chưa đủ điều kiện"}</strong>
                </div>
                <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
                  {detail.dieuKien.map((condition) => {
                    const kind = condition.ma === "NGOAI_NGU" ? "ngoai-ngu" : condition.ma === "CONG_NO" ? "cong-no" : null;
                    return (
                      <li key={condition.ma} className="space-y-2 p-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{condition.ten}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {condition.ma === "TRANG_THAI_HOC_TAP" ? studyStatusLabel(detail.trangThaiHocTap) : condition.ghiChu}
                            </p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${condition.dat ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>
                            {condition.dat ? "Đạt" : "Chưa đạt"}
                          </span>
                        </div>
                        {(condition.fileId || (kind && detail.xacNhan && !hasGraduated(detail))) && (
                          <div className="flex flex-wrap gap-2">
                            {condition.fileId && <GraduationDocumentButton fileId={condition.fileId} label="Xem minh chứng" />}
                            {kind && detail.xacNhan && !hasGraduated(detail) && (
                              <Button type="button" size="sm" variant="outline" onClick={() => setEditing(kind)}>
                                <Pencil className="size-3.5" />{evidence[kind].title}
                              </Button>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
          <GraduationDialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Đóng</Button>
            {detail && !query.isError && canConfirmGraduation(detail) && (
              <Button type="button" onClick={() => onConfirm(detail)} className={graduationPrimaryButton}>
                <CheckCircle2 className="size-4" /> Xác nhận tốt nghiệp
              </Button>
            )}
          </GraduationDialogFooter>
        </>
      )}
    </GraduationDialog>
  );
}
