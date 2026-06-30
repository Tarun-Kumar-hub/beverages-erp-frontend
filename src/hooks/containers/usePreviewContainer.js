// hooks/containers/usePreviewContainer.js

import { useQuery } from "@tanstack/react-query";
import { getContainerPreview } from "../../api/containers";

export const usePreviewContainer = (recipeId, size, enabled = true) =>
  useQuery({
    queryKey: ["container-preview", recipeId, size],

    queryFn: async () => {
      const { data } = await getContainerPreview(recipeId, size);

      return data;
    },

    enabled: enabled && !!recipeId && !!size,
  });
