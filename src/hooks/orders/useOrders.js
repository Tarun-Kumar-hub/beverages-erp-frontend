import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../api/orders";

export const useOrders = ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  payment_status = "",
}) => {
  return useQuery({
    queryKey: ["orders", page, limit, search, status, payment_status],

    queryFn: async () => {
      const { data } = await getOrders({
        page,
        limit,
        search,
        status,
        payment_status,
      });

      return data;
    },

    placeholderData: (prev) => prev,
  });
};
