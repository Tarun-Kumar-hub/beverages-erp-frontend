// 🔑 Key Idea:
// Add stock to material
// Refresh materials list automatically

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStock } from "../../api/materials";

export function useAddStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }) => addStock(id, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },
  });
}
