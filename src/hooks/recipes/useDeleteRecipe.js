import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecipe } from "../../api/recipes";

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecipe,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recipes"],
      });
    },
  });
}
