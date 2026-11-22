import { apiClient, throwApiError } from "@/src/lib/api";
import type {
  CreateUserInput,
  InitialUserCredential,
  UserAccount,
} from "@/src/types/api/user";

const USERS_PATH = "/auth/users";

export const UsersService = {
  async list(signal?: AbortSignal): Promise<UserAccount[]> {
    try {
      // Omitting page and limit returns the full list for TanStack filtering and statistics.
      const { data } = await apiClient.get<UserAccount[]>(USERS_PATH, { signal });
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async get(id: string, signal?: AbortSignal): Promise<UserAccount> {
    try {
      const { data } = await apiClient.get<UserAccount>(`${USERS_PATH}/${id}`, { signal });
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async create(users: CreateUserInput[]): Promise<InitialUserCredential[]> {
    try {
      const { data } = await apiClient.post<InitialUserCredential[]>(USERS_PATH, { users });
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async setStatus(id: string, isActive: boolean): Promise<void> {
    try {
      await apiClient.patch(`${USERS_PATH}/${id}/status`, { isActive });
    } catch (error) {
      throwApiError(error);
    }
  },

  async resetPassword(id: string): Promise<InitialUserCredential> {
    try {
      const { data } = await apiClient.patch<InitialUserCredential>(
        `${USERS_PATH}/${id}/reset-password`
      );
      return data;
    } catch (error) {
      throwApiError(error);
    }
  },
};
