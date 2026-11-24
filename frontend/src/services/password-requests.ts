import { apiClient, throwApiError } from "@/src/lib/api";
import type { PasswordRequest, PasswordRequestStatus } from "@/src/types/api/password-request";
import type { InitialUserCredential } from "@/src/types/api/user";

const PASSWORD_REQUESTS_PATH = "/auth/forgot-password-requests";

export const PasswordRequestsService = {
  async list(status?: PasswordRequestStatus, signal?: AbortSignal): Promise<PasswordRequest[]> {
    try {
      const { data } = await apiClient.get<PasswordRequest[]>(PASSWORD_REQUESTS_PATH, {
        params: status ? { trangThai: status } : undefined,
        signal,
      });
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async approve(id: string): Promise<InitialUserCredential> {
    try {
      const { data } = await apiClient.patch<InitialUserCredential>(`${PASSWORD_REQUESTS_PATH}/${id}/approve`);
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async reject(id: string, lyDoTuChoi?: string): Promise<Pick<PasswordRequest, "id" | "trangThai">> {
    try {
      const { data } = await apiClient.patch<Pick<PasswordRequest, "id" | "trangThai">>(
        `${PASSWORD_REQUESTS_PATH}/${id}/reject`,
        { lyDoTuChoi },
      );
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },
};
