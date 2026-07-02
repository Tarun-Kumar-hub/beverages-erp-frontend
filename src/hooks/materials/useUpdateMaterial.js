import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMaterial } from "../../api/materials";
import toast from "react-hot-toast";

export function useUpdateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateMaterial(id, data),

    onSuccess: () => {
      toast.success("Material updated");

      queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },
  });
}
