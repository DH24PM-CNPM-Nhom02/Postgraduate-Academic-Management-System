import type {
  AdminUserItem,
  AdminUserStatus,
  SystemRole,
} from "@/src/types/ui/admin";

/**
 * Mở rộng nhẹ AdminUserItem cho tầng UI bảng người dùng để hỗ trợ cờ đổi mật khẩu lần đầu
 * mà không làm thay đổi contract tại `src/types/ui/admin.ts`.
 */
export interface AdminUserViewItem extends AdminUserItem {
  mustChangePassword?: boolean;
}

export interface RoleMeta {
  label: string;
  shortLabel: string;
  description: string;
  badgeClass: string;
}

export const SYSTEM_ROLE_META: Record<SystemRole, RoleMeta> = {
  ADMIN: {
    label: "Quản trị viên",
    shortLabel: "ADMIN",
    description: "Toàn quyền quản trị tài khoản, phân quyền và nhật ký hệ thống",
    badgeClass:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300",
  },
  GIAO_VU: {
    label: "Giáo vụ SĐH",
    shortLabel: "GIAO_VU",
    description: "Quản lý hồ sơ NCS, đề tài, phân công hướng dẫn và quyết định",
    badgeClass:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800/70 dark:bg-indigo-950/60 dark:text-indigo-300",
  },
  GVHD: {
    label: "Giảng viên HD",
    shortLabel: "GVHD",
    description: "Theo dõi tiến độ, thẩm định đơn đề nghị và định mức hướng dẫn",
    badgeClass:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/70 dark:bg-sky-950/60 dark:text-sky-300",
  },
  NCS: {
    label: "Nghiên cứu sinh",
    shortLabel: "NCS",
    description: "Nộp minh chứng tiến độ 9 mốc, đề nghị điều chỉnh và tốt nghiệp",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
};

export const USER_STATUS_META: Record<
  AdminUserStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  ACTIVE: {
    label: "Đang hoạt động",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-700 dark:text-emerald-400",
  },
  LOCKED: {
    label: "Đã khóa",
    dotClass: "bg-rose-500",
    textClass: "text-rose-700 dark:text-rose-400",
  },
};

/**
 * Sinh mật khẩu tạm thời ngẫu nhiên đảm bảo đủ chữ hoa, chữ thường, số và ký tự đặc biệt.
 */
export function generateStrongPassword(length = 12): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const symbols = "@#$%&*!";
  const all = upper + lower + digits + symbols;

  const chars = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  for (let i = chars.length; i < length; i += 1) {
    chars.push(all[Math.floor(Math.random() * all.length)]);
  }

  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}

/**
 * Định dạng thời điểm ISO sang chuỗi ngày/giờ tiếng Việt gọn gàng.
 */
export function formatAdminDateTime(
  iso?: string | null,
  emptyFallback = "Chưa đăng nhập"
): string {
  if (!iso) return emptyFallback;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return emptyFallback;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
