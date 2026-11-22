"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeRequestService } from "@/src/services/change-request";
import { DecisionService, type DecisionType } from "@/src/services/decision";
import type { ApproveChangeRequestPayload, ChangeRequestListQuery } from "@/src/types/api/change-request";

const keys = {
  all: ["academic", "change-requests"] as const,
  list: (params: ChangeRequestListQuery) => [...keys.all, "list", params] as const,
  search: (filters: Omit<ChangeRequestListQuery, "page" | "limit">) => [...keys.all, "search", filters] as const,
  detail: (id: string | null) => [...keys.all, "detail", id] as const,
};

export function useChangeRequests(params: ChangeRequestListQuery, enabled = true) {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: ({ signal }) => ChangeRequestService.list(params, signal),
    enabled,
    staleTime: 30_000,
  });
}

export function useChangeRequestsForSearch(
  filters: Omit<ChangeRequestListQuery, "page" | "limit">,
  enabled: boolean,
) {
  return useQuery({
    queryKey: keys.search(filters),
    queryFn: ({ signal }) => ChangeRequestService.listForSearch(filters, signal),
    enabled,
    staleTime: 30_000,
  });
}

export function useChangeRequestDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: ({ signal }) => ChangeRequestService.detail(id, signal),
    enabled,
  });
}

export function useChangeRequestDecisions(ncsId: string, loai: DecisionType, enabled: boolean) {
  const filters = { ncsId, loai, trangThai: "HIEU_LUC" } as const;
  return useQuery({
    queryKey: ["academic", "decisions", "change-request", filters],
    queryFn: ({ signal }) => DecisionService.list(signal, filters),
    enabled,
  });
}

export function useApproveChangeRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveChangeRequestPayload }) =>
      ChangeRequestService.approve(id, payload),
    onSuccess: () => Promise.all(
      [["academic"], ["thesis"], ["ncs"], ["progress"]].map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    ),
  });
}

export function useRejectChangeRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lyDoTuChoi }: { id: string; lyDoTuChoi: string }) =>
      ChangeRequestService.reject(id, lyDoTuChoi),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
  });
}
