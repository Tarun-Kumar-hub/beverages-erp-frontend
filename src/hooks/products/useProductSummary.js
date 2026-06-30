// hooks/products/useProductSummary.js

import { useQuery } from "@tanstack/react-query";
import { getProductSummary } from "../../api/products";

export const useProductSummary = () =>
  useQuery({
    queryKey: ["product-summary"],

    queryFn: async () => {
      const { data } = await getProductSummary();
      return data;
    },
  });
