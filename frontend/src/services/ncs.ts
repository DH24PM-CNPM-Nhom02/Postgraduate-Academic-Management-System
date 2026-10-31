import { apiClient } from "@/src/lib/api";

export const NcsService = {
  getAllStudentsWithPagination: async () => {
    try {
      const response = await apiClient.get("/ncs");
      return response.data;
    } catch (error: unknown) {
      throw new Error((error as Error).message);
    }
  },
};
