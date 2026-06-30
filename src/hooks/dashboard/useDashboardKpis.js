import { useQuery } from "@tanstack/react-query";
import { getDashboardKpis } from "../../api/dashboard";

export const useDashboardKpis = () => {
  return useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: async () => {
      const { data } = await getDashboardKpis();
      return data;
    },
  });
};
