"use client";

import { useRef, type FormEvent } from "react";
import { CircleX } from "lucide-react";
import { MilestoneFormDialog } from "./MilestoneFormDialog";

interface RejectMilestoneDialogProps {
  pending: boolean;
  error?: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function RejectMilestoneDialog({ pending, error, onClose, onConfirm }: RejectMilestoneDialogProps) {
  const reason = useRef<HTMLTextAreaElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = reason.current?.value.trim();
    if (!value) {
      reason.current?.setCustomValidity("Vui lòng nhập lý do từ chối.");
      reason.current?.reportValidity();
      return;
    }
    onConfirm(value);
  }

  return (
    <MilestoneFormDialog
      title="Từ chối minh chứng"
      description="Lý do sẽ được hiển thị cho nghiên cứu sinh khi nộp lại minh chứng."
      icon={<CircleX className="size-5" />}
      submitLabel="Xác nhận từ chối"
      busyLabel="Đang xử lý..."
      busy={pending}
      danger
      onClose={onClose}
      onSubmit={submit}
    >
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-rose-700">{error}</p>}
      <label className="block font-semibold">
        Lý do từ chối <span className="text-rose-600" aria-hidden="true">*</span>
        <textarea
          ref={reason}
          required
          rows={5}
          maxLength={1000}
          disabled={pending}
          placeholder="Nêu rõ nội dung cần bổ sung hoặc điều chỉnh..."
          onChange={(event) => event.target.setCustomValidity("")}
          className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-[#164E9B]"
        />
      </label>
    </MilestoneFormDialog>
  );
}
