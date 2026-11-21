"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { thesisKeys } from "@/src/hooks/api/use-thesis";
import { academicStudentKeys } from "@/src/hooks/use-academic-students";
import { ThesisService } from "@/src/services/thesis";
import type { DeactivateThesisPayload } from "@/src/types/api/thesis";

export const academicThesisKeys = {
  all: ["academic", "theses"] as const,
  list: () => [...academicThesisKeys.all, "list"] as const,
  detail: (ncsId: string | null) =>
    [...academicThesisKeys.all, "detail", ncsId] as const,
  decisions: (ncsId: string | null) =>
    [...academicThesisKeys.all, "decisions", ncsId] as const,
};

export function useAcademicTheses() {
  return useQuery({
    queryKey: academicThesisKeys.list(),
    queryFn: ({ signal }) => ThesisService.listTheses(signal),
    staleTime: 60_000,
  });
}

export function useAcademicThesisDetail(ncsId: string | null) {
  return useQuery({
    queryKey: academicThesisKeys.detail(ncsId),
    queryFn: () => (ncsId ? ThesisService.getAdminThesisDetail(ncsId) : null),
    enabled: Boolean(ncsId),
    staleTime: 60_000,
  });
}

export function useThesisDecisions(ncsId: string | null) {
  return useQuery({
    queryKey: academicThesisKeys.decisions(ncsId),
    queryFn: ({ signal }) =>
      ncsId ? ThesisService.getAvailableDecisionsForThesis(ncsId, signal) : [],
    enabled: Boolean(ncsId),
  });
}

function useInvalidateThesisData() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: academicThesisKeys.all }),
      queryClient.invalidateQueries({ queryKey: academicStudentKeys.all }),
      queryClient.invalidateQueries({ queryKey: thesisKeys.all }),
    ]);
}

export function useAssignThesisMutation() {
  const invalidate = useInvalidateThesisData();
  return useMutation({
    mutationFn: ThesisService.assignThesis,
    onSuccess: invalidate,
  });
}

export function useDeactivateThesisMutation() {
  const invalidate = useInvalidateThesisData();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DeactivateThesisPayload }) =>
      ThesisService.deactivateThesis(id, payload),
    onSuccess: invalidate,
  });
}
