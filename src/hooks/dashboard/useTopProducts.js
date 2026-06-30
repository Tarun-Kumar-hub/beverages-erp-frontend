import { useQuery } from "@tanstack/react-query";
import { getTopProducts } from "../../api/dashboard";

export const useTopProducts = (limit = 3) => {
  return useQuery({
    queryKey: ["top-products", limit],
    queryFn: async () => {
      const { data } = await getTopProducts(limit);
      return data;
    },
  });
};
