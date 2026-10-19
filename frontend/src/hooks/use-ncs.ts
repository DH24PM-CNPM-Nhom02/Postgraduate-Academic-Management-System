import { useQuery } from "@tanstack/react-query";
import { NcsService } from "../services/ncs";

export function useNCS() {
  const queryInfo = useQuery({
    queryKey: ["ncs"],
    queryFn: async () => {
      const data = await NcsService.getAllStudentsWithPagination();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  console.log("useNCS queryInfo:", queryInfo);

  return queryInfo;
}
