// hooks/containers/useDeleteContainer.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContainer } from "../../api/containers";
import toast from "react-hot-toast";

export const useDeleteContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await deleteContainer(id);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["containers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete container");
    },
  });
};
