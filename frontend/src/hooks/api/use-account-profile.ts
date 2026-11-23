"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { authService, unwrapUserProfile } from "@/src/services/auth";

const accountProfileKey = (userId?: string) => ["auth", "me", userId] as const;

export function useAccountProfile(userId?: string, accessToken?: string) {
  return useQuery({
    queryKey: accountProfileKey(userId),
    queryFn: async () => {
      if (!accessToken) throw new Error("Phiên đăng nhập đã hết hạn.");
      return unwrapUserProfile(await authService.getMe(accessToken));
    },
    enabled: Boolean(userId && accessToken),
    staleTime: 60_000,
  });
}

export function useUpdateAccountProfile() {
  const queryClient = useQueryClient();
  const { update } = useSession();

  return useMutation({
    mutationFn: authService.updateMyProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(accountProfileKey(profile.id), profile);
      void update({});
    },
  });
}
