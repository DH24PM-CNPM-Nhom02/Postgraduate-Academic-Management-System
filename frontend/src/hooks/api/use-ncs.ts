"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiClientError } from "@/src/lib/api";
import { GvhdService, mapBackendMySupervisorToItem } from "@/src/services/gvhd";
import { NcsService } from "@/src/services/ncs";
import type { BackendNcsMeResponse } from "@/src/types/api/progress";
import type { SupervisorAssignmentItem } from "@/src/types/ui/thesis";

/**
 * Bộ queryKey chuẩn cho hồ sơ cá nhân của NCS đang đăng nhập
 */
export const ncsSelfKeys = {
  all: ["ncs"] as const,
  me: () => [...ncsSelfKeys.all, "me"] as const,
  supervisors: () => [...ncsSelfKeys.all, "my-supervisors"] as const,
};

/**
 * Lấy thông tin hồ sơ chi tiết của chính NCS đang đăng nhập (GET /ncs/me).
 * Dùng cho phần đầu trang Tiến độ 9 mốc, Đề tài, GVHD, Đơn đề nghị và Hồ sơ cá nhân.
 */
export function useMyNcsProfile() {
  return useQuery<BackendNcsMeResponse, ApiClientError>({
    queryKey: ncsSelfKeys.me(),
    queryFn: () => NcsService.getMyProfile(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

/**
 * Lấy danh sách GVHD đang hướng dẫn của chính NCS (GET /gvhd/my-supervisors).
 * Dùng cho màn hình Giảng viên hướng dẫn của tôi (/student/supervisors)
 * và các quy trình liên quan (Đổi GVHD).
 */
export function useMySupervisors(options?: { enabled?: boolean }) {
  return useQuery<SupervisorAssignmentItem[], ApiClientError>({
    queryKey: ncsSelfKeys.supervisors(),
    queryFn: async () => {
      const rawList = await GvhdService.getMySupervisors();
      return rawList.map(mapBackendMySupervisorToItem);
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    refetchOnWindowFocus: false,
    enabled: options?.enabled,
  });
}
