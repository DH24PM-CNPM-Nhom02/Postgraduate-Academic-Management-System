import {
  NotificationItem,
  NotificationListResponse,
  NotificationQueryFilter,
} from "@/src/types/notification";
import {
  getLocalNotifications,
  saveLocalNotifications,
} from "./mock-notifications";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class NotificationService {
  /**
   * Lấy danh sách thông báo phân trang và lọc theo nhóm / chưa đọc / role
   */
  async getNotifications(
    filter?: NotificationQueryFilter,
    accessToken?: string
  ): Promise<NotificationListResponse> {
    try {
      const params = new URLSearchParams();
      if (filter?.unread !== undefined) {
        params.append("unread", String(filter.unread));
      }
      if (filter?.group && filter.group !== "ALL") {
        params.append("group", filter.group);
      }
      if (filter?.page) {
        params.append("page", String(filter.page));
      }
      if (filter?.limit) {
        params.append("limit", String(filter.limit));
      }
      if (filter?.role) {
        params.append("role", filter.role);
      }

      const url = `${API_BASE_URL}/notifications?${params.toString()}`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const res = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch {
      // Fallback thông minh sang Mock notifications khi backend chưa bật hoặc fetch fail
      return this.getMockNotifications(filter);
    }
  }

  /**
   * Lấy số lượng thông báo chưa đọc theo role để hiển thị Badge đỏ
   */
  async getUnreadCount(role?: string, accessToken?: string): Promise<{ soLuong: number }> {
    try {
      const params = role ? `?role=${role}` : "";
      const url = `${API_BASE_URL}/notifications/unread-count${params}`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const res = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      return await res.json();
    } catch {
      let all = getLocalNotifications();
      if (role) {
        all = all.filter(
          (n) => n.targetRole === role || n.targetRole === "all" || !n.targetRole
        );
      }
      const unreadCount = all.filter((n) => !n.daDoc).length;
      return { soLuong: unreadCount };
    }
  }

  /**
   * Đánh dấu 1 thông báo là đã đọc
   */
  async markAsRead(id: string, accessToken?: string): Promise<NotificationItem> {
    try {
      const url = `${API_BASE_URL}/notifications/${id}/read`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const res = await fetch(url, {
        method: "PATCH",
        headers,
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      return await res.json();
    } catch {
      const all = getLocalNotifications();
      const updated = all.map((item) =>
        item.id === id ? { ...item, daDoc: true, readAt: new Date().toISOString() } : item
      );
      saveLocalNotifications(updated);
      const found = updated.find((item) => item.id === id);
      return (
        found || {
          id,
          nhom: "TIEN_DO",
          loai: "HE_THONG_CHUNG",
          tieuDe: "Đã đọc",
          noiDung: "",
          daDoc: true,
          createdAt: new Date().toISOString(),
        }
      );
    }
  }

  /**
   * Đánh dấu tất cả thông báo của 1 role là đã đọc
   */
  async markAllAsRead(role?: string, accessToken?: string): Promise<{ soLuong: number }> {
    try {
      const url = `${API_BASE_URL}/notifications/read-all`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const res = await fetch(url, {
        method: "PATCH",
        headers,
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      return await res.json();
    } catch {
      const all = getLocalNotifications();
      let count = 0;
      const updated = all.map((item) => {
        const matchesRole = !role || item.targetRole === role || item.targetRole === "all" || !item.targetRole;
        if (matchesRole && !item.daDoc) {
          count++;
          return {
            ...item,
            daDoc: true,
            readAt: new Date().toISOString(),
          };
        }
        return item;
      });
      saveLocalNotifications(updated);
      return { soLuong: count };
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
    };
    saveLocalNotifications([created, ...all]);
    return created;
  }

  /**
   * Bộ lọc giả lập cho mock data theo role và tab
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
    const paginated = all.slice(startIndex, startIndex + limit);

    return {
      items: paginated,
      tong: total,
      trang: page,
      soLuong: limit,
    };
  }
}

export const notificationService = new NotificationService();
