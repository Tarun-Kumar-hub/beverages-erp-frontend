// hooks/materials/useInventoryHistory.js

import { useQuery } from "@tanstack/react-query";
import { getInventoryHistory } from "../../api/materials";

export function useInventoryHistory(filters) {
  return useQuery({
    queryKey: ["inventory-history", filters],

    queryFn: async () => {
      const { data } = await getInventoryHistory(filters);

      return data;
    },

    placeholderData: (prev) => prev,
  });
}
