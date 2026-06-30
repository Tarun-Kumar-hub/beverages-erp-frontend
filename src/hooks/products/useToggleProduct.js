// hooks/products/useToggleProduct.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleProductStatus } from "../../api/products";
import toast from "react-hot-toast";

export const useToggleProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await toggleProductStatus(id);

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["product-summary"],
      });
    },

    onError: (err) => {
      toast.error(err.response?.data?.error || "Update failed");
    },
  });
};
