"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ApiClientError } from "@/src/lib/api";
import { ThesisService } from "@/src/services/thesis";
import { mapMyThesisToUi } from "@/src/adapters/thesis";
import type { BackendThesisNcsMeResponse } from "@/src/types/api/thesis";
import type { StudentThesisOverview } from "@/src/types/ui/thesis";
import { useMyNcsProfile } from "./use-ncs";

export const thesisKeys = {
  all: ["thesis"] as const,
  me: () => [...thesisKeys.all, "ncs-me"] as const,
};

/**
 * Hook gọi API lấy thông tin đề tài của NCS (GET /thesis/ncs/me)
 */
export function useMyThesis() {
  return useQuery<BackendThesisNcsMeResponse, ApiClientError>({
    queryKey: thesisKeys.me(),
    queryFn: () => ThesisService.getMyThesis(),
    staleTime: 1000 * 60 * 5, // 5 phút
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook tổng hợp dữ liệu cho màn hình Tab Đề tài Luận án (/student/thesis)
 * Kết hợp thông tin đề tài từ `useMyThesis` và thông tin chuyên ngành/thời hạn từ `useMyNcsProfile`
 */
export function useStudentThesisData() {
  const thesisQuery = useMyThesis();
  const profileQuery = useMyNcsProfile();

  const data: StudentThesisOverview | undefined = useMemo(() => {
    if (!thesisQuery.data) return undefined;
    return mapMyThesisToUi(thesisQuery.data, profileQuery.data);
  }, [thesisQuery.data, profileQuery.data]);

  const refetch = async () => {
    await Promise.all([thesisQuery.refetch(), profileQuery.refetch()]);
  };

  return {
    data,
    rawThesis: thesisQuery.data,
    ncsProfile: profileQuery.data,
    isLoading:
      thesisQuery.isLoading || (profileQuery.isLoading && !thesisQuery.data),
    isFetching: thesisQuery.isFetching || profileQuery.isFetching,
    error:
      thesisQuery.error ?? (!thesisQuery.data ? profileQuery.error : null) ?? null,
    refetch,
  };
}
