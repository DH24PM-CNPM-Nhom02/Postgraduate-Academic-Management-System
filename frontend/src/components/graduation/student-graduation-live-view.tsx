"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { DocumentViewButton } from "@/src/components/student/progress/document-view-button";
import { useMyGraduation, useStudentGraduationOverview } from "@/src/hooks/api/use-graduation";
import type { PersonalGraduatedNcsRecord } from "@/src/types/api/graduation";
import { formatGraduatedRecordField, graduatedRecordFields } from "./graduated-record-fields";
import { GraduationWorkspace } from "./GraduationWorkspace";

function PersonalGraduatedRecord({ record }: { record: PersonalGraduatedNcsRecord }) {
  return (
    <section className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Hồ sơ tốt nghiệp của tôi</h1>
          <p className="mt-1 text-sm text-muted-foreground">{record.hoTen} · {record.mshv}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="size-4" aria-hidden="true" /> Đã tốt nghiệp
        </span>
      </header>
      <dl className="grid gap-5 rounded-2xl border bg-card p-5 shadow-sm sm:grid-cols-2 sm:p-6">
        {graduatedRecordFields.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
            <dd className="break-words text-sm font-medium">
              {formatGraduatedRecordField(record, key) ?? <span className="text-muted-foreground">Chưa có dữ liệu</span>}
            </dd>
          </div>
        ))}
      </dl>
      <section aria-labelledby="graduation-decision-title" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <h2 id="graduation-decision-title" className="mb-3 text-base font-semibold text-foreground">
          Quyết định công nhận tốt nghiệp
        </h2>
        {record.quyetDinhFileId ? (
          <DocumentViewButton
            fileId={record.quyetDinhFileId}
            fileName="Quyet-dinh-cong-nhan-tot-nghiep.pdf"
            title={record.soQuyetDinh ? `Quyết định ${record.soQuyetDinh}` : "Quyết định công nhận tốt nghiệp"}
            label="Xem PDF Quyết định"
          />
        ) : (
          <p className="text-sm text-muted-foreground">Chưa có tệp PDF quyết định công nhận tốt nghiệp.</p>
        )}
      </section>
    </section>
  );
}

function GraduationPending() {
  return (
    <p role="status" className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-8 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Đang tải hồ sơ tốt nghiệp…
    </p>
  );
}

function GraduationUnavailable({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-8">
      <p role="alert" className="text-sm text-rose-700">{message}</p>
      <Button type="button" variant="outline" onClick={onRetry}>Thử lại</Button>
    </div>
  );
}

function StudentGraduationAssessmentView() {
  const { data, isLoading, error, refetch } = useStudentGraduationOverview();

  if (isLoading && !data) return <GraduationPending />;
  if (!data) {
    return (
      <GraduationUnavailable
        message={error?.message ?? "Chưa có dữ liệu xét tốt nghiệp cho tài khoản này."}
        onRetry={() => void refetch()}
      />
    );
  }

  return <GraduationWorkspace overview={data} onRetry={() => void refetch()} />;
}

export function StudentGraduationLiveView() {
  const graduation = useMyGraduation();

  if (graduation.isPending) return <GraduationPending />;
  if (graduation.isError) {
    return <GraduationUnavailable message={graduation.error.message} onRetry={() => void graduation.refetch()} />;
  }
  return graduation.data ? <PersonalGraduatedRecord record={graduation.data} /> : <StudentGraduationAssessmentView />;
}

export default StudentGraduationLiveView;
