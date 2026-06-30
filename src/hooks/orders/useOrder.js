import { useQuery } from "@tanstack/react-query";
import { getOrder } from "../../api/orders";

export const useOrder = (id) => {
  return useQuery({
    queryKey: ["order", id],

    queryFn: async () => {
      const { data } = await getOrder(id);

      return data.data;
    },

    enabled: !!id,
  });
};
