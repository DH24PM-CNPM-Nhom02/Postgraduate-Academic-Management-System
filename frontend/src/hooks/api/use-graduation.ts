"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GraduationService } from "@/src/services/graduation";
import { buildStudentGraduationOverview } from "@/src/adapters/graduation";
import type { GraduationCheckApiResponse } from "@/src/types/api/graduation";
import type { StudentGraduationOverview } from "@/src/types/ui/graduation";
import { useMyNcsProfile } from "./use-ncs";
import { useMyProgress } from "./use-progress";
import { useChangeRequests } from "./use-change-requests";

export const graduationKeys = {
  all: ["graduation"] as const,
  check: (ncsId?: string) => [...graduationKeys.all, "check", ncsId] as const,
};

/**
 * Hook kiểm tra kết quả xét tốt nghiệp từ API Backend
 */
export function useGraduationCheck(ncsId?: string) {
  return useQuery<GraduationCheckApiResponse | null>({
    queryKey: graduationKeys.check(ncsId),
    queryFn: () => (ncsId ? GraduationService.checkGraduation(ncsId) : Promise.resolve(null)),
    enabled: Boolean(ncsId),
    staleTime: 1000 * 60 * 5, // 5 phút
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook tổng hợp dữ liệu cho Tab Xét tốt nghiệp cá nhân (/student/graduation)
 */
export function useStudentGraduationOverview() {
  const profileQuery = useMyNcsProfile();
  const progressQuery = useMyProgress();
  const requestsQuery = useChangeRequests();
  const graduationCheckQuery = useGraduationCheck(profileQuery.data?.id);

  const data: StudentGraduationOverview | undefined = useMemo(() => {
    if (!profileQuery.data && !progressQuery.data) return undefined;
    return buildStudentGraduationOverview(
      profileQuery.data,
      progressQuery.data,
      requestsQuery.data?.data,
      graduationCheckQuery.data
    );
  }, [
    profileQuery.data,
    progressQuery.data,
    requestsQuery.data?.data,
    graduationCheckQuery.data,
  ]);

  const refetch = async () => {
    await Promise.all([
      profileQuery.refetch(),
      progressQuery.refetch(),
      requestsQuery.refetch(),
      graduationCheckQuery.refetch(),
    ]);
  };

  return {
    data,
    isLoading: profileQuery.isLoading || progressQuery.isLoading,
    isError: profileQuery.isError || progressQuery.isError,
    error: profileQuery.error || progressQuery.error,
    refetch,
  };
}
