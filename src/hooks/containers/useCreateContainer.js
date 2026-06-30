// hooks/containers/useCreateContainer.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContainer } from "../../api/containers";
import toast from "react-hot-toast";

export const useCreateContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await createContainer(data);
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
      toast.error(err.response?.data?.message || "Failed to create container");
    },
  });
};
