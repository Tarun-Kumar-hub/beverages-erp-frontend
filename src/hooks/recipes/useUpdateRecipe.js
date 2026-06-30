import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRecipe } from "../../api/recipes";

export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateRecipe(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipes"],
      });
    },
  });
}
