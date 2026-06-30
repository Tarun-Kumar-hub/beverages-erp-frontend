import { useQuery } from "@tanstack/react-query";
import { getPackagingMaterials } from "../../api/packaging";

export const usePackagingMaterials = () =>
  useQuery({
    queryKey: ["packaging-materials"],

    queryFn: async () => {
      const { data } = await getPackagingMaterials();
      return data;
    },
  });
