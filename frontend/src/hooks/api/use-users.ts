"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiClientError } from "@/src/lib/api";
import { UsersService } from "@/src/services/users";
import type {
  CreateUserInput,
  InitialUserCredential,
  UserAccount,
} from "@/src/types/api/user";

const usersKey = ["admin-users"] as const;

export function useUsers() {
  return useQuery<UserAccount[], ApiClientError>({
    queryKey: usersKey,
    queryFn: ({ signal }) => UsersService.list(signal),
  });
}

export function useUserDetail(id: string) {
  return useQuery<UserAccount, ApiClientError>({
    queryKey: [...usersKey, id],
    queryFn: ({ signal }) => UsersService.get(id, signal),
  });
}

export function useCreateUsers() {
  const queryClient = useQueryClient();

  return useMutation<InitialUserCredential[], ApiClientError, CreateUserInput[]>({
    mutationFn: UsersService.create,
    gcTime: 0,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersKey, exact: true });
    },
  });
}

export function useSetUserStatus() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiClientError, { id: string; isActive: boolean }>({
    mutationFn: ({ id, isActive }) => UsersService.setStatus(id, isActive),
    onSuccess: (_result, { id }) => Promise.all([
      queryClient.invalidateQueries({ queryKey: usersKey, exact: true }),
      queryClient.invalidateQueries({ queryKey: [...usersKey, id] }),
    ]),
  });
}

export function useResetUserPassword() {
  const queryClient = useQueryClient();

  return useMutation<InitialUserCredential, ApiClientError, string>({
    mutationFn: UsersService.resetPassword,
    gcTime: 0,
    onSuccess: (_result, id) => {
      void queryClient.invalidateQueries({ queryKey: usersKey, exact: true });
      void queryClient.invalidateQueries({ queryKey: [...usersKey, id] });
    },
  });
}
