import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "../../api/orders";
import toast from "react-hot-toast";

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,

    onSuccess: () => {
      toast.success("Order cancelled");

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer-order-history"],
      });
    },
  });
};
