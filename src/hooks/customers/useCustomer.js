import { useQuery } from "@tanstack/react-query";
import { getCustomer } from "../../api/customers";

export const useCustomer = (id) => {
  return useQuery({
    queryKey: ["customer", id],

    queryFn: async () => {
      const { data } = await getCustomer(id);

      return data.data;
    },

    enabled: !!id,
  });
};
