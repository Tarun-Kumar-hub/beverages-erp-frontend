// 🔑 Key Idea:
// Delete material
// Automatically refresh materials list after success

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMaterial } from "../../api/materials";

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMaterial,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },
  });
}
