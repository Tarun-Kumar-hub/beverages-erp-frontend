import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomer } from "../../api/customers";
import toast from "react-hot-toast";

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,

    onSuccess: () => {
      toast.success("Customer deleted");

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer-search"],
      });
    },
  });
};