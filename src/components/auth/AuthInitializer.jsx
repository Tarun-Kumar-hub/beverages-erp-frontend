import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useProfile } from "../../hooks/auth/useProfile";

import {
  restoreSession,
  logout,
  finishLoading,
} from "../../features/auth/authSlice";

import { clearTokens } from "../../services/token.service";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  const { data, isSuccess, isError, isLoading } = useProfile();

  useEffect(() => {
    if (isSuccess) {
      dispatch(restoreSession(data.user));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      clearTokens();

      dispatch(logout());
    }
  }, [isError, dispatch]);

  useEffect(() => {
    if (!isLoading && !isSuccess && !isError) {
      dispatch(finishLoading());
    }
  }, [isLoading, isSuccess, isError, dispatch]);

  return children;
};

export default AuthInitializer;
