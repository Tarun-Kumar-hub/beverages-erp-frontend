// hooks/containers/useContainers.js

import { useQuery } from "@tanstack/react-query";
import { getContainers } from "../../api/containers";

export const useContainers = (params) =>
  useQuery({
    queryKey: ["containers", params],

    queryFn: async () => {
      const { data } = await getContainers(params);
      return data;
    },

    keepPreviousData: true,
  });
