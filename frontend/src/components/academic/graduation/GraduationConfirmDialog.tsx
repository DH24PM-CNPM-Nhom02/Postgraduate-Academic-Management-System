"use client";

import { useState, type FormEvent } from "react";
import { useQueries } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { graduationDecisionOptions, useConfirmGraduation } from "@/src/hooks/api/use-graduation";
import { parseApiError } from "@/src/lib/api";
import { formatDate } from "@/src/lib/utils";
import type { GraduationCheckApiResponse, GraduationConfirmationIssue } from "@/src/types/api/graduation";
import { GraduationDialog, GraduationDialogFooter, GraduationLoadError, graduationPrimaryButton } from "./GraduationDialog";
import { GraduationDocumentButton } from "./GraduationDocumentButton";
import { isGraduationDate } from "./graduation-status";

type DecisionChoice = {
  quyetDinhId: string;
  ngayTotNghiep: string;
  ngayBaoVeCapTruong: string;
  soHieuBang: string;
  ngayCapBang: string;
};
const EMPTY_CHOICE: DecisionChoice = {
  quyetDinhId: "",
  ngayTotNghiep: "",
  ngayBaoVeCapTruong: "",
  soHieuBang: "",
  ngayCapBang: "",
};

export function GraduationConfirmDialog({ students, decisionsHref, onClose, onConfirmed }: {
  students: GraduationCheckApiResponse[];
  decisionsHref: string;
  onClose: () => void;
  onConfirmed: (ids: string[]) => void;
}) {
  const [included, setIncluded] = useState(students);
  const [choices, setChoices] = useState<Record<string, DecisionChoice>>({});
  const [failure, setFailure] = useState<{ message: string; issues: GraduationConfirmationIssue[] }>();
  const confirm = useConfirmGraduation();
  const decisionQueries = useQueries({
    queries: included.map(({ ncsId }) => graduationDecisionOptions(ncsId)),
  });
  const rows = included.map((student, index) => {
    const query = decisionQueries[index];
    const choice = choices[student.ncsId] ?? EMPTY_CHOICE;
    const decisions = query.data ?? [];
    const decision = decisions.find(({ id }) => id === choice.quyetDinhId);
    const invalidDate = Boolean(choice.ngayTotNghiep && !isGraduationDate(choice.ngayTotNghiep));
    return { student, query, choice, decisions, decision, invalidDate };
  });
  const canSubmit = rows.length > 0 && rows.every(({ decision, query, invalidDate }) =>
    decision && !query.isError && !invalidDate,
  );

  function changeChoice(ncsId: string, change: Partial<DecisionChoice>) {
    setChoices((current) => ({ ...current, [ncsId]: { ...(current[ncsId] ?? EMPTY_CHOICE), ...change } }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || confirm.isPending) return;
    setFailure(undefined);
    confirm.mutate(rows.map(({ student, choice }) => ({
      ncsId: student.ncsId,
      quyetDinhId: choice.quyetDinhId,
      ngayTotNghiep: choice.ngayTotNghiep || undefined,
      ngayBaoVeCapTruong: choice.ngayBaoVeCapTruong || undefined,
      soHieuBang: choice.soHieuBang.trim() || undefined,
      ngayCapBang: choice.ngayCapBang || undefined,
    })), {
      onSuccess: ({ ketQua }) => {
        toast.success(`Đã xác nhận tốt nghiệp cho ${ketQua.length} nghiên cứu sinh.`);
        onConfirmed(ketQua.map(({ ncsId }) => ncsId));
      },
      onError: (error) => {
        const parsed = parseApiError(error);
        const body = isAxiosError<{ chiTiet?: GraduationConfirmationIssue[] }>(parsed.raw)
          ? parsed.raw.response?.data
          : undefined;
        setFailure({ message: parsed.message, issues: Array.isArray(body?.chiTiet) ? body.chiTiet : [] });
      },
    });
  }

  return (
    <GraduationDialog
      title="Xác nhận tốt nghiệp"
      description={`Chọn quyết định công nhận cho từng nghiên cứu sinh trong ${rows.length} hồ sơ đã chọn.`}
      busy={confirm.isPending}
      onClose={onClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-col">
        <div className="space-y-4 overflow-y-auto p-5 sm:p-6">
          {failure && (
            <div role="alert" className="space-y-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
              <p className="font-semibold">{failure.message}</p>
              {failure.issues.length > 0 && (
                <ul className="list-disc space-y-1 pl-4">
                  {failure.issues.map((issue) => (
                    <li key={issue.ncsId}><strong>{issue.mshv} · {issue.hoTen}</strong> · {issue.lyDo}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {rows.map(({ student, choice, query, decisions, decision, invalidDate }) => {
            const id = student.ncsId;
            const items = decisions.map((item) => ({
              value: item.id,
              label: `${item.soQuyetDinh} · ${formatDate(item.ngayQuyetDinh)}`,
            }));
            return (
              <section key={id} className="space-y-3 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{student.hoTen} <span className="font-normal text-slate-500">· {student.mshv}</span></h3>
                  {rows.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={confirm.isPending}
                      aria-label={`Bỏ chọn ${student.mshv}`}
                      onClick={() => setIncluded((current) => current.filter(({ ncsId }) => ncsId !== id))}
                    >
                      Bỏ chọn
                    </Button>
                  )}
                </div>
                {query.isPending && <p role="status" className="text-sm text-slate-500">Đang tải quyết định…</p>}
                {query.isError && <GraduationLoadError message={query.error.message} onRetry={() => void query.refetch()} />}
                {query.isSuccess && decisions.length === 0 && (
                  <div className="space-y-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                    <p>Chưa có quyết định công nhận tốt nghiệp còn hiệu lực, chưa sử dụng cho NCS này.</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link href={decisionsHref} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
                        Mở Quản lý Quyết định
                      </Link>
                      <Button type="button" variant="outline" size="sm" disabled={query.isFetching} onClick={() => void query.refetch()}>
                        Tải lại quyết định
                      </Button>
                    </div>
                  </div>
                )}
                {query.isSuccess && decisions.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label id={`graduation-decision-${id}`} className="block text-xs font-semibold text-slate-700">Quyết định công nhận *</label>
                      <Select
                        items={items}
                        value={decision?.id ?? null}
                        disabled={confirm.isPending}
                        onValueChange={(value) => changeChoice(id, { quyetDinhId: value ?? "" })}
                      >
                        <SelectTrigger aria-labelledby={`graduation-decision-${id}`} className="h-9 w-full">
                          <SelectValue placeholder="Chọn quyết định" />
                        </SelectTrigger>
                        <SelectContent positionerClassName="z-[70]" alignItemWithTrigger={false}>
                          {items.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                      <span>Ngày tốt nghiệp</span>
                      <Input
                        type="date"
                        max="9999-12-31"
                        value={choice.ngayTotNghiep}
                        disabled={confirm.isPending}
                        aria-invalid={invalidDate || undefined}
                        onChange={(event) => changeChoice(id, { ngayTotNghiep: event.target.value })}
                      />
                      <span className="block font-normal text-slate-500">
                        {decision ? `Mặc định ${formatDate(decision.ngayQuyetDinh)} theo quyết định.` : "Bỏ trống để dùng ngày quyết định."}
                      </span>
                      {invalidDate && <span className="block text-rose-700">Ngày tốt nghiệp không hợp lệ.</span>}
                    </label>
                    {decision?.fileId && (
                      <div className="sm:col-span-2">
                        <GraduationDocumentButton fileId={decision.fileId} label="Xem quyết định PDF" />
                      </div>
                    )}
                  </div>
                )}
                <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <summary className="cursor-pointer text-xs font-semibold text-slate-700">
                    Ngày bảo vệ và thông tin cấp bằng (tùy chọn)
                  </summary>
                  <fieldset disabled={confirm.isPending} className="mt-3 grid gap-3 sm:grid-cols-3">
                    <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                      <span>Ngày bảo vệ cấp trường</span>
                      <Input
                        type="date"
                        max="9999-12-31"
                        value={choice.ngayBaoVeCapTruong}
                        onChange={(event) => changeChoice(id, { ngayBaoVeCapTruong: event.target.value })}
                      />
                    </label>
                    <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                      <span>Số hiệu bằng</span>
                      <Input
                        maxLength={100}
                        value={choice.soHieuBang}
                        onChange={(event) => changeChoice(id, { soHieuBang: event.target.value })}
                      />
                    </label>
                    <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                      <span>Ngày cấp bằng</span>
                      <Input
                        type="date"
                        max="9999-12-31"
                        value={choice.ngayCapBang}
                        onChange={(event) => changeChoice(id, { ngayCapBang: event.target.value })}
                      />
                    </label>
                  </fieldset>
                </details>
              </section>
            );
          })}
        </div>
        <GraduationDialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={confirm.isPending}>Hủy</Button>
          <Button type="submit" className={graduationPrimaryButton} disabled={!canSubmit || confirm.isPending}>
            {confirm.isPending ? "Đang xác nhận…" : "Xác nhận tốt nghiệp"}
          </Button>
        </GraduationDialogFooter>
      </form>
    </GraduationDialog>
  );
}
