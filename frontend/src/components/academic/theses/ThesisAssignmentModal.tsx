"use client";

import { useId, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui/react/dialog";
import Link from "next/link";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { useAssignThesisMutation, useThesisDecisions } from "@/src/hooks/use-theses";
import { parseApiError } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type { AcademicThesisNcsItem } from "@/src/types/api/thesis";

const assignmentSchema = z.object({
  ncsId: z.uuid("Vui lòng chọn nghiên cứu sinh."),
  tenDeTai: z.string().trim().min(1, "Vui lòng nhập tên đề tài.").max(500, "Tên đề tài tối đa 500 ký tự."),
  quyetDinhId: z.uuid("Vui lòng chọn quyết định giao đề tài."),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof assignmentSchema>, string[]>>;

interface ThesisAssignmentModalProps {
  onClose: () => void;
  student: AcademicThesisNcsItem | null;
  students: AcademicThesisNcsItem[];
}

function getAssignmentBlock(student: AcademicThesisNcsItem) {
  if (student.trangThaiDeTai === "HIEU_LUC") return "NCS đã có đề tài đang hiệu lực.";
  if (student.hasPendingChangeRequest) return "NCS đang có đề nghị điều chỉnh chờ duyệt.";
  if (student.trangThaiHocTap && !["DANG_HOC", "GIA_HAN"].includes(student.trangThaiHocTap)) {
    return "Chỉ có thể giao đề tài cho NCS đang học hoặc gia hạn.";
  }
  return null;
}

export function ThesisAssignmentModal({ onClose, student, students }: ThesisAssignmentModalProps) {
  const formId = useId();
  const [ncsId, setNcsId] = useState<string | null>(student?.id ?? null);
  const [tenDeTai, setTenDeTai] = useState("");
  const [quyetDinhId, setQuyetDinhId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState("");
  const eligibleStudents = students.filter((candidate) => !getAssignmentBlock(candidate));
  const selectedStudent = (student && students.find(({ id }) => id === student.id)) ?? student
    ?? eligibleStudents.find(({ id }) => id === ncsId);
  const blockReason = selectedStudent ? getAssignmentBlock(selectedStudent) : null;

  const decisions = useThesisDecisions(!blockReason && selectedStudent ? selectedStudent.id : null);
  const studentOptions = eligibleStudents.map(({ id, mshv, hoTen, khoaHoc }) => ({
    value: id,
    label: khoaHoc ? `${mshv} · ${hoTen} · ${khoaHoc}` : `${mshv} · ${hoTen}`,
  }));
  const decisionOptions = (decisions.data ?? []).map((decision) => ({
    value: decision.id,
    label: `${decision.soQuyetDinh} · ${formatDate(decision.ngayQuyetDinh)}`,
  }));
  const mutation = useAssignThesisMutation();

  function clearErrors(...fields: (keyof FieldErrors)[]) {
    setErrors((current) => ({ ...current, ...Object.fromEntries(fields.map((field) => [field, undefined])) }));
    setApiError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mutation.isPending || blockReason) return;
    setApiError("");

    const result = assignmentSchema.safeParse({
      ncsId: selectedStudent?.id ?? "",
      tenDeTai,
      quyetDinhId: decisionOptions.some(({ value }) => value === quyetDinhId) ? quyetDinhId : "",
    });
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setErrors({});
    try {
      await mutation.mutateAsync(result.data);
      toast.success(`Đã giao đề tài cho NCS ${selectedStudent?.hoTen}.`);
      onClose();
    } catch (error) {
      setApiError(parseApiError(error).message);
    }
  }

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/45" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border bg-white shadow-xl">
          <div className="flex items-start justify-between gap-3 border-b p-5">
            <div>
              <Dialog.Title className="text-base font-bold text-[#0F2744]">Giao đề tài luận án</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-slate-500">
                Chọn quyết định giao đề tài đang hiệu lực của nghiên cứu sinh.
              </Dialog.Description>
            </div>
            <Dialog.Close render={<Button type="button" variant="ghost" size="icon-sm" aria-label="Đóng" disabled={mutation.isPending} />}>
              <X />
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <fieldset disabled={mutation.isPending} className="min-w-0 space-y-4 p-5">
              {apiError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{apiError}</p>}
              {blockReason && <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{blockReason}</p>}

              <div className="space-y-1.5">
                {student ? (
                  <>
                    <p className="text-sm font-medium text-slate-700">Nghiên cứu sinh</p>
                    <p className="rounded-lg bg-slate-50 p-3 text-sm">
                      <span className="font-mono text-[#164E9B]">{student.mshv}</span> · {student.hoTen}
                    </p>
                  </>
                ) : (
                  <>
                    <label htmlFor={`${formId}-ncs`} className="text-sm font-medium">Nghiên cứu sinh *</label>
                    <Select
                      items={studentOptions}
                      value={ncsId}
                      onValueChange={(value) => {
                        setNcsId(value);
                        setQuyetDinhId(null);
                        clearErrors("ncsId", "quyetDinhId");
                      }}
                      disabled={!studentOptions.length || mutation.isPending}
                    >
                      <SelectTrigger id={`${formId}-ncs`} className="h-9 w-full" aria-invalid={Boolean(errors.ncsId)} aria-describedby={errors.ncsId ? `${formId}-ncs-error` : undefined}>
                        <SelectValue placeholder="Chọn nghiên cứu sinh" />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false} positionerClassName="z-[60]" className="max-h-60">
                        {studentOptions.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {!studentOptions.length && <p className="text-xs text-slate-500">Không có NCS chưa được giao đề tài.</p>}
                  </>
                )}
                {errors.ncsId && <p id={`${formId}-ncs-error`} className="text-xs text-rose-700">{errors.ncsId[0]}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor={`${formId}-title`} className="text-sm font-medium">Tên đề tài *</label>
                  <span className="text-xs tabular-nums text-slate-500">{tenDeTai.trim().length}/500</span>
                </div>
                <textarea
                  id={`${formId}-title`}
                  rows={3}
                  value={tenDeTai}
                  onChange={(event) => { setTenDeTai(event.target.value); clearErrors("tenDeTai"); }}
                  aria-invalid={Boolean(errors.tenDeTai)}
                  aria-describedby={errors.tenDeTai ? `${formId}-title-error` : undefined}
                  className="w-full rounded-lg border border-input p-2.5 text-sm aria-invalid:border-rose-500"
                />
                {errors.tenDeTai && <p id={`${formId}-title-error`} className="text-xs text-rose-700">{errors.tenDeTai[0]}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor={`${formId}-decision`} className="text-sm font-medium">Quyết định giao đề tài *</label>
                <Select
                  items={decisionOptions}
                  value={quyetDinhId}
                  onValueChange={(value) => { setQuyetDinhId(value); clearErrors("quyetDinhId"); }}
                  disabled={!decisionOptions.length || decisions.isError || mutation.isPending}
                >
                  <SelectTrigger id={`${formId}-decision`} className="h-9 w-full" aria-invalid={Boolean(errors.quyetDinhId)} aria-describedby={errors.quyetDinhId ? `${formId}-decision-error` : undefined}>
                    <SelectValue placeholder={decisions.isLoading ? "Đang tải quyết định…" : "Chọn quyết định"} />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false} positionerClassName="z-[60]">
                    {decisionOptions.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.quyetDinhId && <p id={`${formId}-decision-error`} className="text-xs text-rose-700">{errors.quyetDinhId[0]}</p>}
                {decisions.isError && (
                  <div role="alert" className="flex flex-wrap items-center gap-2 text-xs text-rose-700">
                    <p>{parseApiError(decisions.error).message}</p>
                    <Button type="button" variant="outline" size="xs" onClick={() => void decisions.refetch()}>Thử lại</Button>
                  </div>
                )}
                {decisions.isSuccess && !decisionOptions.length && (
                  <p className="text-xs text-slate-600">
                    NCS chưa có quyết định giao đề tài hiệu lực.{" "}
                    <Link href="/academic/decisions" className="font-semibold text-[#164E9B] hover:underline">
                      Mở Quản lý quyết định
                    </Link>
                  </p>
                )}
              </div>
            </fieldset>
            <div className="flex justify-end gap-2 border-t p-4">
              <Dialog.Close render={<Button type="button" variant="outline" disabled={mutation.isPending} />}>Đóng</Dialog.Close>
              <Button type="submit" className="bg-[#164E9B] text-white hover:bg-[#123E7C]" disabled={Boolean(blockReason) || mutation.isPending || decisions.isLoading || decisions.isError}>
                {mutation.isPending && <Loader2 className="animate-spin" />}
                {mutation.isPending ? "Đang giao đề tài…" : "Giao đề tài"}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
