"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DecisionService } from "@/src/services/decision";

export const decisionKeys = {
  all: ["academic", "decisions"] as const,
};

export function useDecisions() {
  return useQuery({
    queryKey: decisionKeys.all,
    queryFn: ({ signal }) => DecisionService.list(signal),
    staleTime: 60_000,
    retry: false,
  });
}

export function useDeactivateDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lyDo }: { id: string; lyDo: string }) => DecisionService.deactivate(id, lyDo),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["academic"] }),
        queryClient.invalidateQueries({ queryKey: ["thesis"] }),
      ]);
    },
  });
}
