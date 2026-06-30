import { useQuery } from "@tanstack/react-query";
import { getOrderStatus } from "../../api/dashboard";

export const useOrderStatus = () => {
  return useQuery({
    queryKey: ["order-status"],
    queryFn: async () => {
      const { data } = await getOrderStatus();
      return data;
    },
  });
};
