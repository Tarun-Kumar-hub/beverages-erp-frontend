// hooks/products/useProducts.js

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/products";

export const useProducts = (params) =>
  useQuery({
    queryKey: ["products", params],

    queryFn: async () => {
      const { data } = await getProducts(params);
      return data;
    },

    keepPreviousData: true,
  });
