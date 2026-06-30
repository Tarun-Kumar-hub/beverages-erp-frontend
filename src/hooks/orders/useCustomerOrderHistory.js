import { useQuery } from "@tanstack/react-query";
import { getCustomerOrderHistory } from "../../api/orders";

export const useCustomerOrderHistory = ({
  customerId,
  page = 1,
  limit = 10,
}) => {
  return useQuery({
    queryKey: ["customer-order-history", customerId, page, limit],

    queryFn: async () => {
      const { data } = await getCustomerOrderHistory({
        customerId,
        page,
        limit,
      });

      return data;
    },

    enabled: !!customerId,

    placeholderData: (prev) => prev,
  });
};
