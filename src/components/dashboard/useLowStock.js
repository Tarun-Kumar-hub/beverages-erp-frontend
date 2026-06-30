import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useLowStock() {
  return useQuery({
    queryKey: ["dashboard-low-stock"],

    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/low-stock");
      return data;
    },

    staleTime: 60000,
  });
}
