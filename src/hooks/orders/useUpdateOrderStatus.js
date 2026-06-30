import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "../../api/orders";
import toast from "react-hot-toast";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,

    onSuccess: () => {
      toast.success("Order status updated");

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order"],
      });
    },
  });
};
