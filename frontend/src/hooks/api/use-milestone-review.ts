"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProgressService } from "@/src/services/progress";
import type { EvaluationPayload } from "@/src/types/api/progress";
import { progressKeys } from "./use-progress";

const pendingKey = [...progressKeys.all, "pending"] as const;
const evaluationsKey = (id: string) => [...progressKeys.all, "evaluations", id] as const;
const historyKey = (id: string) => [...progressKeys.all, "ncs", id] as const;

export function usePendingMilestoneReviews(thuTu?: number) {
  return useQuery({
    queryKey: [...pendingKey, thuTu ?? "all"],
    queryFn: ({ signal }) => ProgressService.listPendingReviews(signal, thuTu),
    retry: false,
  });
}

export function useMilestoneReviewHistory(ncsId: string) {
  return useQuery({
    queryKey: historyKey(ncsId),
    queryFn: ({ signal }) => ProgressService.getNcsProgress(ncsId, signal),
  });
}

export function useMilestoneEvaluations(evidenceId: string, enabled: boolean) {
  return useQuery({
    queryKey: evaluationsKey(evidenceId),
    queryFn: ({ signal }) => ProgressService.listEvaluations(evidenceId, signal),
    enabled,
  });
}

export function useSaveMilestoneEvaluation(evidenceId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, id }: { payload: EvaluationPayload; id?: string }) =>
      ProgressService.saveEvaluation(evidenceId, payload, id),
    onSuccess: () => client.invalidateQueries({ queryKey: progressKeys.all }),
  });
}

export function useDeleteMilestoneEvaluation(evidenceId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ProgressService.deleteEvaluation(evidenceId, id),
    onSuccess: () => client.invalidateQueries({ queryKey: progressKeys.all }),
  });
}

export function useReviewMilestone(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (review: { quyetDinhId: string } | { lyDo: string }) => ProgressService.reviewMilestone(id, review),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: progressKeys.all });
    },
  });
}
