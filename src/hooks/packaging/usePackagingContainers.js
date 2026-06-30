import { useQuery } from "@tanstack/react-query";
import { getPackagingContainers } from "../../api/packaging";

export const usePackagingContainers = () =>
  useQuery({
    queryKey: ["packaging-containers"],

    queryFn: async () => {
      const { data } = await getPackagingContainers();
      return data;
    },
  });
