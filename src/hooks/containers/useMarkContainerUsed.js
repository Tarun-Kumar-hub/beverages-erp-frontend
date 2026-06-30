// hooks/containers/useMarkContainerUsed.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markContainerUsed } from "../../api/containers";
import toast from "react-hot-toast";

export const useMarkContainerUsed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await markContainerUsed(id);
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["containers"],
      });
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update container");
    },
  });
};
