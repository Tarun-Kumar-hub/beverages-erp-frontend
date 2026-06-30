// hooks/products/useProductHistory.js

import { useQuery } from "@tanstack/react-query";
import { getProductHistory } from "../../api/products";

export const useProductHistory = ({ id, page, limit }) =>
  useQuery({
    queryKey: ["product-history", id, page, limit],

    queryFn: async () => {
      const { data } = await getProductHistory({
        id,
        page,
        limit,
      });

      return data;
    },

    enabled: !!id,
  });
