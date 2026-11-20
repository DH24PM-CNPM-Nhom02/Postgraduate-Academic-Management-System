"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { notificationService } from "@/src/services/notification.service";
import type {
  NotificationItem,
  NotificationListResponse,
  NotificationQueryFilter,
  NotificationRole,
} from "@/src/types/notification";

function isUnreadFilter(queryKey: readonly unknown[]) {
  const filter = queryKey[2] as NotificationQueryFilter | undefined;
  return filter?.unread === true;
}

function markCachedNotificationRead(
  data: NotificationListResponse,
  id: string,
  readAt: string,
  removeFromUnreadList: boolean
): NotificationListResponse {
  if (removeFromUnreadList) {
    const items = data.items.filter((item) => item.id !== id);
    return {
      ...data,
      items,
      tong: Math.max(0, data.tong - (data.items.length - items.length)),
    };
  }

  return {
    ...data,
    items: data.items.map((item) =>
      item.id === id ? { ...item, daDoc: true, readAt } : item
    ),
  };
}

/**
 * Helper tự động phát hiện role từ đường dẫn URL hiện tại
 */
export function useDetectedRole(): NotificationRole {
  const pathname = usePathname();
  if (pathname?.startsWith("/student")) return "student";
  if (pathname?.startsWith("/supervisor")) return "supervisor";
  return "academic";
}

export function useNotifications(filter?: NotificationQueryFilter) {
  const { data: session } = useSession();
  const accessToken = session?.access_token;
  const userId = session?.user?.id ?? "anonymous";

  return useQuery<NotificationListResponse>({
    queryKey: ["notifications", userId, filter],
    queryFn: () => notificationService.getNotifications(filter, accessToken),
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 25,
    refetchOnWindowFocus: true,
  });
}

export function useUnreadNotificationCount() {
  const { data: session } = useSession();
  const accessToken = session?.access_token;
  const userId = session?.user?.id ?? "anonymous";
  return useQuery<{ soLuong: number }>({
    queryKey: ["notifications", "unread-count", userId],
    queryFn: () => notificationService.getUnreadCount(accessToken),
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 25,
    refetchOnWindowFocus: true,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.access_token;
  const userId = session?.user?.id ?? "anonymous";
  const listQueryKey = ["notifications", userId];
  const unreadCountQueryKey = ["notifications", "unread-count", userId];

  return useMutation({
    mutationFn: ({ id }: { id: string; readAt: string }) =>
      notificationService.markAsRead(id, accessToken),
    onMutate: async ({ id, readAt }) => {
      await queryClient.cancelQueries({ queryKey: listQueryKey });
      await queryClient.cancelQueries({ queryKey: unreadCountQueryKey });

      const previousLists = queryClient.getQueriesData<NotificationListResponse>({
        queryKey: listQueryKey,
      });
      const previousCounts = queryClient.getQueriesData<{ soLuong: number }>({
        queryKey: unreadCountQueryKey,
      });
      const wasUnread = previousLists.some(([, data]) =>
        data?.items.some((item) => item.id === id && !item.daDoc)
      );

      for (const [queryKey, data] of previousLists) {
        if (!data) continue;
        queryClient.setQueryData<NotificationListResponse>(
          queryKey,
          markCachedNotificationRead(data, id, readAt, isUnreadFilter(queryKey))
        );
      }
      if (wasUnread) {
        queryClient.setQueriesData<{ soLuong: number }>(
          { queryKey: unreadCountQueryKey },
          (count) => count && { soLuong: Math.max(0, count.soLuong - 1) }
        );
      }

      return { previousLists, previousCounts, readAt };
    },
    onError: (_error, _variables, context) => {
      context?.previousLists.forEach(([queryKey, data]) =>
        queryClient.setQueryData(queryKey, data)
      );
      context?.previousCounts.forEach(([queryKey, data]) =>
        queryClient.setQueryData(queryKey, data)
      );
    },
    onSuccess: (updatedItem, variables, context) => {
      const readAt = context?.readAt ?? updatedItem.readAt ?? new Date().toISOString();
      const lists = queryClient.getQueriesData<NotificationListResponse>({
        queryKey: listQueryKey,
      });
      for (const [queryKey, data] of lists) {
        if (!data) continue;
        queryClient.setQueryData<NotificationListResponse>(
          queryKey,
          markCachedNotificationRead(data, variables.id, readAt, isUnreadFilter(queryKey))
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.access_token;
  const userId = session?.user?.id ?? "anonymous";
  const listQueryKey = ["notifications", userId];
  const unreadCountQueryKey = ["notifications", "unread-count", userId];

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(accessToken),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: listQueryKey });
      await queryClient.cancelQueries({ queryKey: unreadCountQueryKey });

      const previousLists = queryClient.getQueriesData<NotificationListResponse>({
        queryKey: listQueryKey,
      });
      const previousCounts = queryClient.getQueriesData<{ soLuong: number }>({
        queryKey: unreadCountQueryKey,
      });
      const readAt = new Date().toISOString();

      for (const [queryKey, data] of previousLists) {
        if (!data) continue;
        queryClient.setQueryData<NotificationListResponse>(
          queryKey,
          isUnreadFilter(queryKey)
            ? { ...data, tong: 0, items: [] }
            : {
                ...data,
                items: data.items.map((item) => ({ ...item, daDoc: true, readAt })),
              }
        );
      }
      queryClient.setQueriesData<{ soLuong: number }>(
        { queryKey: unreadCountQueryKey },
        () => ({ soLuong: 0 })
      );

      return { previousLists, previousCounts };
    },
    onError: (_error, _variables, context) => {
      context?.previousLists.forEach(([queryKey, data]) =>
        queryClient.setQueryData(queryKey, data)
      );
      context?.previousCounts.forEach(([queryKey, data]) =>
        queryClient.setQueryData(queryKey, data)
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listQueryKey });
      queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
    },
  });
}
