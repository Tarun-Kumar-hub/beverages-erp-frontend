// 🔑 Key Idea:
// Create material
// Refresh materials list automatically

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMaterial } from "../../api/materials";

export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMaterial,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },
  });
}
