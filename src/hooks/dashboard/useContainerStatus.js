import { useQuery } from "@tanstack/react-query";
import { getContainerStatus } from "../../api/dashboard";

export const useContainerStatus = () => {
  return useQuery({
    queryKey: ["container-status"],
    queryFn: async () => {
      const { data } = await getContainerStatus();
      return data;
    },
  });
};
