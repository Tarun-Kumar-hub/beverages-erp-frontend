import { useMutation, useQueryClient } from "@tanstack/react-query";
import { packContainer } from "../../api/packaging";
import toast from "react-hot-toast";

export const usePackContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await packContainer(payload);
      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["packaging-stock"],
      });

      queryClient.invalidateQueries({
        queryKey: ["packaging-containers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["packaging-logs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["containers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },

    onError: (err) => {
      toast.error(err.response?.data?.error || "Packaging failed");
    },
  });
};
