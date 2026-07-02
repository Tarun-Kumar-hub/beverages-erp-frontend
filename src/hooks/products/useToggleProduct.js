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

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Update failed",
      );
    },
  });
};
