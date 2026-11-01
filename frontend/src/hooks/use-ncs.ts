import { useQuery } from "@tanstack/react-query";
import { NcsService } from "../services/ncs";
import type { StudentDossier } from "@/src/types/academic";

export function useNCS() {
  return useQuery<StudentDossier[]>({
    queryKey: ["ncs"],
    queryFn: async () => {
      const data = await NcsService.getAllStudentsWithPagination();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
