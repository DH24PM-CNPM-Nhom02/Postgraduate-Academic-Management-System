import { apiClient } from "../lib/api/axios";

export const NcsService = {
  getAllStudentsWithPagination: async () => {
    try {
      const response = await apiClient.get("/ncs");
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
