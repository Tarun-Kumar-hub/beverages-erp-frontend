import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomer } from "../../api/customers";
import toast from "react-hot-toast";

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomer,

    onSuccess: (_, variables) => {
      toast.success("Customer updated successfully ✅");

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer", variables.id],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update customer ❌",
      );
    },
  });
};
