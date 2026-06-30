import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../../api/auth";
import { hasAccessToken } from "../../services/token.service";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],

    queryFn: getProfile,

    enabled: !!hasAccessToken(),

    retry: false,

    refetchOnWindowFocus: false,

    staleTime: 5 * 60 * 1000,
  });
};
