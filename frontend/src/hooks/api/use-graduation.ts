"use client";

import { useMemo } from "react";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
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
  list: () => [...graduationKeys.all, "list"] as const,
  detail: (ncsId: string) => [...graduationKeys.all, "detail", ncsId] as const,
  decisions: (ncsId: string) => [...graduationKeys.all, "decisions", ncsId] as const,
  graduated: () => [...graduationKeys.all, "graduated"] as const,
  me: (userId?: string) => [...graduationKeys.all, "me", userId] as const,
};

export function useGraduatedNcs() {
  return useQuery({ queryKey: graduationKeys.graduated(), queryFn: GraduationService.listGraduated });
}

export function useMyGraduation() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  return useQuery({
    queryKey: graduationKeys.me(userId),
    queryFn: GraduationService.getMyGraduation,
    enabled: Boolean(userId),
  });
}

export function useExportGraduatedNcs() {
  return useMutation({ mutationFn: GraduationService.exportGraduated });
}

export function useGraduationList() {
  return useQuery({ queryKey: graduationKeys.list(), queryFn: GraduationService.list });
}

export function useGraduationDetail(ncsId: string) {
  return useQuery({
    queryKey: graduationKeys.detail(ncsId),
    queryFn: () => GraduationService.detail(ncsId),
  });
}

export function graduationDecisionOptions(ncsId: string) {
  return queryOptions({
    queryKey: graduationKeys.decisions(ncsId),
    queryFn: () => GraduationService.decisions(ncsId),
  });
}

export function useUpdateGraduationEvidence() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: GraduationService.updateEvidence,
    onSuccess: (_, { ncsId }) => Promise.all([
      client.invalidateQueries({ queryKey: graduationKeys.list() }),
      client.invalidateQueries({ queryKey: graduationKeys.detail(ncsId) }),
      client.invalidateQueries({ queryKey: graduationKeys.check(ncsId) }),
    ]),
  });
}

export function useConfirmGraduation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: GraduationService.confirm,
    onSettled: () => client.invalidateQueries({ queryKey: graduationKeys.all }),
  });
}

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
    if (!profileQuery.data || !progressQuery.data || !requestsQuery.data) return undefined;
    return buildStudentGraduationOverview(
      profileQuery.data,
      progressQuery.data,
      requestsQuery.data?.data,
      graduationCheckQuery.data
    );
  }, [
    profileQuery.data,
    progressQuery.data,
    requestsQuery.data,
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
    isLoading: profileQuery.isLoading || progressQuery.isLoading || requestsQuery.isLoading,
    isError: profileQuery.isError || progressQuery.isError || requestsQuery.isError,
    error: profileQuery.error || progressQuery.error || requestsQuery.error,
    refetch,
  };
}
