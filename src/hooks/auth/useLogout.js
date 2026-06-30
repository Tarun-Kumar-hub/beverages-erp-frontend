import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logout } from "../../api/auth";
import { clearTokens } from "../../services/token.service";
import { logout as logoutAction } from "../../features/auth/authSlice";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,

    onSettled: () => {
      clearTokens();

      dispatch(logoutAction());

      toast.success("Logged out successfully");

      navigate("/login", {
        replace: true,
      });
    },
  });
};
