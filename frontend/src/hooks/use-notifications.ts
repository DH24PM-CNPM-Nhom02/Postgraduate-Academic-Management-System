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

interface SessionUserWithToken {
  accessToken?: string;
}

/**
 * Helper tự động phát hiện role từ đường dẫn URL hiện tại
 */
export function useDetectedRole(): Exclude<NotificationRole, "all"> {
  const pathname = usePathname();
  if (pathname?.startsWith("/student")) return "student";
  if (pathname?.startsWith("/supervisor")) return "supervisor";
  return "academic";
}

export function useNotifications(filter?: NotificationQueryFilter) {
  const { data: session } = useSession();
  const accessToken = (session?.user as SessionUserWithToken | undefined)?.accessToken;
  const detectedRole = useDetectedRole();
  const effectiveRole = filter?.role || detectedRole;

  return useQuery<NotificationListResponse>({
    queryKey: ["notifications", effectiveRole, filter, accessToken],
    queryFn: () =>
      notificationService.getNotifications(
        { ...filter, role: effectiveRole },
        accessToken
      ),
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 25,
    refetchOnWindowFocus: true,
  });
}

export function useUnreadNotificationCount(roleOverride?: Exclude<NotificationRole, "all">) {
  const { data: session } = useSession();
  const accessToken = (session?.user as SessionUserWithToken | undefined)?.accessToken;
  const detectedRole = useDetectedRole();
  const effectiveRole = roleOverride || detectedRole;

  return useQuery<{ soLuong: number }>({
    queryKey: ["notifications", "unread-count", effectiveRole, accessToken],
    queryFn: () => notificationService.getUnreadCount(effectiveRole, accessToken),
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 25,
    refetchOnWindowFocus: true,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = (session?.user as SessionUserWithToken | undefined)?.accessToken;

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id, accessToken),
    onSuccess: (updatedItem) => {
      // Optimistic update cache
      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: ["notifications"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item) =>
              item.id === updatedItem.id
                ? { ...item, daDoc: true, readAt: new Date().toISOString() }
                : item
            ),
          };
        }
      );
      // Invalidate count và list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsAsRead(roleOverride?: Exclude<NotificationRole, "all">) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = (session?.user as SessionUserWithToken | undefined)?.accessToken;
  const detectedRole = useDetectedRole();
  const effectiveRole = roleOverride || detectedRole;

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(effectiveRole, accessToken),
    onSuccess: () => {
      queryClient.setQueryData<{ soLuong: number }>(
        ["notifications", "unread-count", effectiveRole, accessToken],
        { soLuong: 0 }
      );
      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: ["notifications", effectiveRole] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item) => ({
              ...item,
              daDoc: true,
              readAt: new Date().toISOString(),
            })),
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Hook cho phép kích hoạt thông báo kèm chỉ định rõ targetRole
 */
export function useTriggerNotification() {
  const queryClient = useQueryClient();

  return (newItem: Omit<NotificationItem, "id" | "createdAt" | "daDoc">) => {
    const created = notificationService.addLocalNotification(newItem);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    return created;
  };
}
