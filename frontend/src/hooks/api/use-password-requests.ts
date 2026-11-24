"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { ApiClientError } from "@/src/lib/api";
import { PasswordRequestsService } from "@/src/services/password-requests";
import type { PasswordRequest, PasswordRequestStatus } from "@/src/types/api/password-request";
import type { InitialUserCredential } from "@/src/types/api/user";

const passwordRequestsKey = ["auth", "password-requests"] as const;

export function usePasswordRequests(status?: PasswordRequestStatus) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<PasswordRequest[], ApiClientError>({
    queryKey: [...passwordRequestsKey, userId, status],
    queryFn: ({ signal }) => PasswordRequestsService.list(status, signal),
    enabled: Boolean(userId),
  });
}

export function useApprovePasswordRequest() {
  const queryClient = useQueryClient();

  return useMutation<InitialUserCredential, ApiClientError, string>({
    mutationFn: PasswordRequestsService.approve,
    gcTime: 0,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: passwordRequestsKey });
    },
  });
}

export function useRejectPasswordRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, lyDoTuChoi }: { id: string; lyDoTuChoi?: string }) =>
      PasswordRequestsService.reject(id, lyDoTuChoi),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: passwordRequestsKey });
    },
  });
}
