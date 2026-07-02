import { useQuery } from "@tanstack/react-query";
import { getMaterials } from "../../api/materials";

export function useMaterials({ page, limit = 5, search }) {
  return useQuery({
    queryKey: ["materials", page, limit, search],

    queryFn: async () => {
      const { data } = await getMaterials({
        page,
        limit,
        search,
      });

      return data;
    },

    staleTime: 10000,
  });
}
