"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiClientError } from "@/src/lib/api";
import { NcsService } from "@/src/services/ncs";
import type { BackendNcsMeResponse } from "@/src/types/api/progress";

/**
 * Bộ queryKey chuẩn cho hồ sơ cá nhân của NCS đang đăng nhập
 */
export const ncsSelfKeys = {
  all: ["ncs"] as const,
  me: () => [...ncsSelfKeys.all, "me"] as const,
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
