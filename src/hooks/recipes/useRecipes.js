import { useQuery } from "@tanstack/react-query";
import { getRecipes } from "../../api/recipes";

export function useRecipes(search = "") {
  return useQuery({
    queryKey: ["recipes", search],

    queryFn: async () => {
      const { data } = await getRecipes({
        search,
      });

      return data.map((r) => ({
        ...r,
        materials: r.materials || [],
      }));
    },

    staleTime: 10000,
  });
}
