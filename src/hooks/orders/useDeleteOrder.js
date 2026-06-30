import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrder } from "../../api/orders";
import toast from "react-hot-toast";

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrder,

    onSuccess: () => {
      toast.success("Order deleted");

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer-order-history"],
      });
    },
  });
};
