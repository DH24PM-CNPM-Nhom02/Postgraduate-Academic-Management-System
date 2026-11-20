import { apiClient, throwApiError } from "@/src/lib/api";
import {
  NotificationItem,
  NotificationListResponse,
  NotificationQueryFilter,
} from "@/src/types/notification";

class NotificationService {
  /**
   * Lấy danh sách thông báo của người dùng hiện tại, có phân trang và lọc
   * Endpoint: GET /notifications
   */
  async getNotifications(
    filter?: NotificationQueryFilter,
    accessToken?: string
  ): Promise<NotificationListResponse> {
    try {
      const params: Record<string, string | number | boolean> = {};
      if (filter?.unread !== undefined) {
        params.unread = filter.unread;
      }
      if (filter?.group && filter.group !== "ALL") {
        params.group = filter.group;
      }
      if (filter?.page) {
        params.page = filter.page;
      }
      if (filter?.limit) {
        params.limit = filter.limit;
      }
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

      const res = await apiClient.get<NotificationListResponse>("/notifications", {
        params,
        headers,
      });

      return res.data;
    } catch (error) {
      throwApiError(error);
    }
  }

  /**
   * Lấy số lượng thông báo chưa đọc của người dùng hiện tại
   * Endpoint: GET /notifications/unread-count
   */
  async getUnreadCount(accessToken?: string): Promise<{ soLuong: number }> {
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

      const res = await apiClient.get<{ soLuong: number }>("/notifications/unread-count", {
        headers,
      });

      return res.data;
    } catch (error) {
      throwApiError(error);
    }
  }

  /**
   * Đánh dấu 1 thông báo là đã đọc
   * Endpoint: PATCH /notifications/:id/read
   */
  async markAsRead(id: string, accessToken?: string): Promise<NotificationItem> {
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

      const res = await apiClient.patch<NotificationItem>(
        `/notifications/${id}/read`,
        {},
        { headers }
      );

      return res.data;
    } catch (error) {
      throwApiError(error);
    }
  }

  /**
   * Đánh dấu tất cả thông báo của người dùng hiện tại là đã đọc
   * Endpoint: PATCH /notifications/read-all
   */
  async markAllAsRead(accessToken?: string): Promise<{ soLuong: number }> {
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

      const res = await apiClient.patch<{ soLuong: number }>(
        "/notifications/read-all",
        {},
        {
          headers,
        }
      );

      return res.data;
    } catch (error) {
      throwApiError(error);
    }
  }
}

export const notificationService = new NotificationService();
