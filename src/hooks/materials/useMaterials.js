import { useQuery } from "@tanstack/react-query";
import { getMaterials } from "../../api/materials";

export function useMaterials({ page, search }) {
  return useQuery({
    queryKey: ["materials", page, search],

    queryFn: async () => {
      const { data } = await getMaterials({
        page,
        search,
      });

      return data;
    },

    staleTime: 10000,
  });
}
