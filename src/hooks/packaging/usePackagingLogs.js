import { useQuery } from "@tanstack/react-query";
import { getPackagingLogs } from "../../api/packaging";

export const usePackagingLogs = ({ page, limit }) =>
  useQuery({
    queryKey: ["packaging-logs", page, limit],

    queryFn: async () => {
      const { data } = await getPackagingLogs({
        page,
        limit,
      });

      return data;
    },
  });
