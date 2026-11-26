"use client";

import { useId, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { canDeactivateThesis } from "./thesis-eligibility";
import { useDeactivateThesisMutation } from "@/src/hooks/use-theses";
import { parseApiError } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type { AcademicThesisNcsItem, BackendThesisItem } from "@/src/types/api/thesis";

const deactivateSchema = z.object({
  lyDo: z.string().trim().min(1, "Vui lòng nhập lý do hủy đề tài."),
});

interface ThesisDeactivateModalProps {
  onClose: () => void;
  item: AcademicThesisNcsItem;
  thesis: BackendThesisItem;
}

export function ThesisDeactivateModal({ onClose, item, thesis }: ThesisDeactivateModalProps) {
  const formId = useId();
  const [lyDo, setLyDo] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [apiError, setApiError] = useState("");
  const mutation = useDeactivateThesisMutation();

  const allowed = canDeactivateThesis(item) && item.deTaiHienTai?.id === thesis.id;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mutation.isPending || !allowed) return;
    setApiError("");
    const result = deactivateSchema.safeParse({ lyDo });
    if (!result.success) {
      setFieldError(z.flattenError(result.error).fieldErrors.lyDo?.[0] ?? "");
      return;
    }

    setFieldError("");
    try {
      await mutation.mutateAsync({ id: thesis.id, payload: result.data });
      toast.success(`Đã hủy đề tài của NCS ${item.hoTen}.`);
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
              <Dialog.Title className="text-base font-bold text-[#0F2744]">Hủy đề tài luận án</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-slate-500">
                Đề tài sẽ chuyển sang trạng thái đã hủy và được lưu trong lịch sử.
              </Dialog.Description>
            </div>
            <Dialog.Close render={<Button type="button" variant="ghost" size="icon-sm" aria-label="Đóng" disabled={mutation.isPending} />}>
              <X />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4 p-5">
              <div className="space-y-1 rounded-lg bg-slate-50 p-3 text-sm">
                <p className="font-semibold text-slate-900">{thesis.tenDeTai}</p>
                <p className="text-xs text-slate-600">{item.hoTen} · {item.mshv}</p>
                {thesis.quyetDinh && (
                  <p className="text-xs text-slate-600">
                    QĐ {thesis.quyetDinh.soQuyetDinh} · {formatDate(thesis.quyetDinh.ngayQuyetDinh)}
                  </p>
                )}
              </div>
              {!allowed && <p role="alert" className="text-xs text-rose-700">Hồ sơ hiện không đủ điều kiện hủy đề tài.</p>}
              {apiError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{apiError}</p>}
              <div className="space-y-1.5">
                <label htmlFor={`${formId}-reason`} className="text-sm font-medium">Lý do hủy *</label>
                <textarea
                  id={`${formId}-reason`}
                  rows={3}
                  value={lyDo}
                  onChange={(event) => { setLyDo(event.target.value); setFieldError(""); setApiError(""); }}
                  disabled={mutation.isPending}
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? `${formId}-error` : undefined}
                  className="w-full rounded-lg border border-input p-2.5 text-sm aria-invalid:border-rose-500"
                />
                {fieldError && <p id={`${formId}-error`} className="text-xs text-rose-700">{fieldError}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t p-4">
              <Dialog.Close render={<Button type="button" variant="outline" disabled={mutation.isPending} />}>Đóng</Dialog.Close>
              <Button type="submit" variant="destructive" disabled={mutation.isPending || !allowed}>
                {mutation.isPending && <Loader2 className="animate-spin" />}
                {mutation.isPending ? "Đang hủy đề tài…" : "Xác nhận hủy đề tài"}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
