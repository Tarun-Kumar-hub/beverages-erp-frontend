import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../../api/customers";

export const useCustomers = ({ page = 1, limit = 10 }) => {
  return useQuery({
    queryKey: ["customers", page, limit],

    queryFn: async () => {
      const { data } = await getCustomers({
        page,
        limit,
      });

      return data;
    },

    placeholderData: (prev) => prev,
  });
};
