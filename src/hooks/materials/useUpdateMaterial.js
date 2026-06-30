// 🔑 Key Idea:
// Update material
// Refresh materials list automatically

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMaterial } from "../../api/materials";

export function useUpdateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateMaterial(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },
  });
}
