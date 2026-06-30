import { useQuery } from "@tanstack/react-query";
import { getPackagingStock } from "../../api/packaging";

export const usePackagingStock = () =>
  useQuery({
    queryKey: ["packaging-stock"],

    queryFn: async () => {
      const { data } = await getPackagingStock();
      return data;
    },
  });
