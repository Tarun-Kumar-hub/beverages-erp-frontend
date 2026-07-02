import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMaterial } from "../../api/materials";
import toast from "react-hot-toast";

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMaterial,

    onSuccess: () => {
      toast.success("Material deleted");

      queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },
  });
}
