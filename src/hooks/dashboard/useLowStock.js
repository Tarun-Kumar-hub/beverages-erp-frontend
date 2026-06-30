import { useQuery } from "@tanstack/react-query";
import { getLowStock } from "../../api/dashboard";

export const useLowStock = () => {
  return useQuery({
    queryKey: ["low-stock"],
    queryFn: async () => {
      const { data } = await getLowStock();
      return data;
    },
  });
};
