import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { login } from "../../api/auth";
import { setTokens } from "../../services/token.service";

import { loginSuccess } from "../../features/auth/authSlice";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      dispatch(loginSuccess(data.user));
    },
  });
};
