"use client";

import { useQueries } from "@tanstack/react-query";
import { myNcsDetailOptions, useMySupervisedStudents } from "@/src/hooks/use-academic";
import type { EvidenceStatus } from "@/src/types/ui/progress";
import type { SupervisorProgressReportItem } from "@/src/types/ui/supervisor";
import { SupervisorProgressReportsWorkspace } from "./supervisor-progress-reports-workspace";

export function SupervisorProgressReportsLiveView() {
  const studentsQuery = useMySupervisedStudents();
  const students = studentsQuery.data ?? [];
  const details = useQueries({ queries: students.map(({ id }) => myNcsDetailOptions(id)) });

  const reports = students.flatMap((student, index): SupervisorProgressReportItem[] =>
    (details[index].data?.tienTrinhs ?? []).flatMap(({ moc, minhChungs }) => {
      if (!moc) return [];
      return (minhChungs ?? []).map((evidence) => ({
        id: evidence.id,
        studentId: student.id,
        mshv: student.mshv,
        hoTenNcs: student.hoTen,
        khoaDaoTao: student.khoaDaoTao,
        tenDeTai: student.tenDeTai,
        vaiTro: student.vaiTro,
        mocSo: moc.thuTu,
        tenMoc: moc.tenMoc,
        lanNop: evidence.lanNop,
        ngayNop: evidence.ngayNop,
        ngayDuyet: evidence.ngayDuyet ?? undefined,
        diemTrungBinh: evidence.diemTrungBinh ?? undefined,
        trangThai: evidence.trangThai as EvidenceStatus,
        ghiChuNcs: evidence.ghiChuNcs ?? undefined,
        lyDoTuChoi: evidence.lyDoTuChoi ?? undefined,
        fileId: evidence.fileId,
        fileName: "Minh chứng PDF",
      }));
    }),
  ).sort((a, b) => b.ngayNop.localeCompare(a.ngayNop));

  const detailErrorIndex = details.findIndex((query) => query.isError);
  const error = studentsQuery.error?.message ?? (detailErrorIndex >= 0
    ? `Không tải được báo cáo của ${students[detailErrorIndex].hoTen}. ${details[detailErrorIndex].error?.message ?? ""}`
    : null);

  return (
    <SupervisorProgressReportsWorkspace
      reports={reports}
      students={students}
      isLoading={studentsQuery.isLoading || details.some((query) => query.isLoading)}
      error={error}
      onRetry={() => void Promise.all([studentsQuery.refetch(), ...details.map((query) => query.refetch())])}
    />
  );
}
