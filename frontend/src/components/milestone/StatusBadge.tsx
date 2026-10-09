/**
 * StatusBadge
 *
 * 5 trạng thái mốc: Khóa / Đang mở / Chờ duyệt / Từ chối / Đạt.
 * Luôn có icon + màu + chữ (không chỉ dùng màu — WCAG AA).
 *
 * Status Color Tokens:
 * - Khóa (Locked):       bg #F3F4F6, text #6B7280, icon 🔒
 * - Đang mở (Unlocked):  bg #EFF6FF, text #2563EB, icon 🔓
 * - Chờ duyệt (Pending): bg #FFFBEB, text #D97706, icon ⏳
 * - Từ chối (Rejected):  bg #FEF2F2, text #DC2626, icon ✕
 * - Đạt (Passed):        bg #F0FDF4, text #16A34A, icon ✓
 */

export type MilestoneStatus =
  | "locked"
  | "unlocked"
  | "pending"
  | "rejected"
  | "passed";

interface StatusBadgeProps {
  status: MilestoneStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // TODO: Implement StatusBadge with color tokens above
  return (
    <span>
      {status}
    </span>
  );
}
