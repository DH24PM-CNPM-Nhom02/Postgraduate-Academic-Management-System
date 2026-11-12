import { apiClient, throwApiError } from "@/src/lib/api";
import {
  NotificationItem,
  NotificationListResponse,
  NotificationQueryFilter,
} from "@/src/types/notification";
import {
  getLocalNotifications,
  saveLocalNotifications,
} from "./mock-notifications";

class NotificationService {
  /**
   * Lấy danh sách thông báo phân trang và lọc theo nhóm / chưa đọc / role
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
      if (filter?.role) {
        params.role = filter.role;
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
   * Lấy số lượng thông báo chưa đọc theo role để hiển thị Badge đỏ
   * Endpoint: GET /notifications/unread-count
   */
  async getUnreadCount(role?: string, accessToken?: string): Promise<{ soLuong: number }> {
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

      const res = await apiClient.get<{ soLuong: number }>("/notifications/unread-count", {
        params: role ? { role } : undefined,
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
        null,
        { headers }
      );

      return res.data;
    } catch (error) {
      throwApiError(error);
    }
  }

  /**
   * Đánh dấu tất cả thông báo của 1 role là đã đọc
   * Endpoint: PATCH /notifications/read-all
   */
  async markAllAsRead(role?: string, accessToken?: string): Promise<{ soLuong: number }> {
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

      const res = await apiClient.patch<{ soLuong: number }>(
        "/notifications/read-all",
        null,
        {
          params: role ? { role } : undefined,
          headers,
        }
      );

      return res.data;
    } catch (error) {
      throwApiError(error);
    }
  }

  /**
   * Thêm thông báo mới vào bộ nhớ cục bộ (hỗ trợ mô phỏng kích hoạt thông báo tức thì)
   */
  addLocalNotification(newItem: Omit<NotificationItem, "id" | "createdAt" | "daDoc">): NotificationItem {
    const all = getLocalNotifications();
    const created: NotificationItem = {
      ...newItem,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      daDoc: false,
      targetRole: newItem.targetRole || "all",
      createdAt: new Date().toISOString(),
      duLieu: {
        ...newItem.duLieu,
        _isMockFallback: true,
      },
    };
    saveLocalNotifications([created, ...all]);
    return created;
  }

  /**
   * Bộ lọc giả lập cho mock data theo role và tab khi backend không khả dụng
   */
  private getMockNotifications(filter?: NotificationQueryFilter): NotificationListResponse {
    let all = getLocalNotifications();

    // 1. Lọc theo Role
    if (filter?.role) {
      all = all.filter(
        (n) => n.targetRole === filter.role || n.targetRole === "all" || !n.targetRole
      );
    }

    // 2. Lọc theo trạng thái chưa đọc
    if (filter?.unread !== undefined) {
      all = all.filter((n) => (filter.unread ? !n.daDoc : true));
    }

    // 3. Lọc theo Nhóm thông báo
    if (filter?.group && filter.group !== "ALL") {
      all = all.filter((n) => n.nhom === filter.group);
    }

    const page = filter?.page || 1;
    const limit = filter?.limit || 20;
    const total = all.length;
    const startIndex = (page - 1) * limit;
    const paginated = all.slice(startIndex, startIndex + limit).map((item) => ({
      ...item,
      duLieu: {
        ...item.duLieu,
        _isMockFallback: true,
      },
    }));

    return {
      items: paginated,
      tong: total,
      trang: page,
      soLuong: limit,
    };
  }
}

export const notificationService = new NotificationService();
