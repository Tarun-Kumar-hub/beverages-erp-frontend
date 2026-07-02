import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePaymentStatus } from "../../api/orders";
import toast from "react-hot-toast";

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePaymentStatus,

    onSuccess: () => {
      toast.success("Payment updated");

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

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update Payment status",
      );
    },
  });
};
