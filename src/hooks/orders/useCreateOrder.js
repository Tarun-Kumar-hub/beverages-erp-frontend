import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../../api/orders";
import toast from "react-hot-toast";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,

    onSuccess: () => {
      toast.success("Order created");

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create order");
    },
  });
};
