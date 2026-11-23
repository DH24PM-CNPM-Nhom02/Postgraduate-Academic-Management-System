"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { mapChangeRequestApiToUi } from "@/src/adapters/change-request";
import { useMySupervisedStudents } from "@/src/hooks/use-academic";
import { changeRequestKeys, useCancelChangeRequest, useCreateChangeRequest } from "@/src/hooks/api/use-change-requests";
import { throwApiError } from "@/src/lib/api";
import { ChangeRequestService } from "@/src/services/change-request";
import { DocumentService } from "@/src/services/document";
import type { SupervisorProxyRequestItem } from "@/src/types/ui/supervisor";
import { SupervisorRequestsWorkspace } from "./SupervisorRequestsWorkspace";

export function SupervisorRequestsLiveView() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const studentsQuery = useMySupervisedStudents();
  const requestsQuery = useQuery({
    queryKey: changeRequestKeys.list({ scope: "supervisor-sent", userId }),
    queryFn: ({ signal }) => ChangeRequestService.listForSearch({}, signal).catch(throwApiError),
    enabled: Boolean(userId),
  });
  const create = useCreateChangeRequest();
  const cancel = useCancelChangeRequest();
  const lastUpload = useRef<{ file: File; ncsId: string; fileId: string } | null>(null);
  const students = studentsQuery.data ?? [];
  const studentsById = new Map(students.map((student) => [student.id, student]));
  const requests = (requestsQuery.data ?? []).flatMap((item): SupervisorProxyRequestItem[] => {
    if (!userId || item.nguoiDeNghiId !== userId || item.loai === "GIA_HAN") return [];
    const mapped = mapChangeRequestApiToUi(item);
    const student = studentsById.get(item.ncsId);
    return [{
      ...mapped,
      loaiDon: item.loai,
      studentId: item.ncsId,
      mshv: item.ncs.mshv,
      hoTenNcs: item.ncs.hoTen,
      khoaDaoTao: student?.khoaDaoTao ?? "",
      nguoiDeXuat: session.user.fullName,
      vaiTroCuaToi: student?.vaiTro,
      vaiTroGvhdCanThay: mapped.vaiTroGvhdCu,
    }];
  });

  return (
    <SupervisorRequestsWorkspace
      requests={requests}
      students={students}
      isLoading={requestsQuery.isLoading || studentsQuery.isLoading}
      error={(requestsQuery.error ?? studentsQuery.error)?.message}
      onRetry={() => void Promise.all([requestsQuery.refetch(), studentsQuery.refetch()])}
      onCreateRequest={async (values) => {
        const file = values.tepDinhKemFile;
        let fileId: string | undefined;
        if (file) {
          const previous = lastUpload.current;
          if (previous?.file === file && previous.ncsId === values.studentId) {
            fileId = previous.fileId;
          } else {
            const attachment = await DocumentService.uploadPdf({
              file,
              documentType: "DON_TU",
              ncsId: values.studentId,
            });
            fileId = attachment.id;
            lastUpload.current = { file, ncsId: values.studentId, fileId };
          }
        }
        await create.mutateAsync({
          loai: values.loaiDon,
          ncsId: values.studentId,
          lyDo: values.lyDo,
          batKhaKhang: values.batKhaKhang,
          tenDeTaiMoi: values.tenDeTaiMoi,
          phanCongCuId: values.phanCongCuId,
          gvhdMoiId: values.gvhdMoiId,
          fileId,
        });
        lastUpload.current = null;
      }}
      onWithdrawRequest={async (id) => {
        await cancel.mutateAsync(id);
      }}
    />
  );
}
