import { useQuery } from "@tanstack/react-query";
import { searchCustomers } from "../../api/customers";

export const useSearchCustomers = ({ q, page = 1, limit = 10 }) => {
  return useQuery({
    queryKey: ["customer-search", q, page, limit],

    queryFn: async () => {
      const { data } = await searchCustomers({
        q,
        page,
        limit,
      });

      return data;
    },

    enabled: !!q,

    placeholderData: (prev) => prev,
  });
};
