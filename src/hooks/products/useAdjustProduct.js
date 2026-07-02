import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adjustProductStock } from "../../api/products";
import toast from "react-hot-toast";

export const useAdjustProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await adjustProductStock(id, payload);
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

      queryClient.invalidateQueries({
        queryKey: ["product-history"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Update failed",
      );
    },
  });
};
