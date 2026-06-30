import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getProfile } from "../../api/auth";

import {
  restoreSession,
  logout,
  authInitialized,
} from "../../features/auth/authSlice";

import { hasAccessToken, clearTokens } from "../../services/token.service";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      if (!hasAccessToken()) {
        dispatch(authInitialized());
        return;
      }

      try {
        const data = await getProfile();

        dispatch(restoreSession(data.user));
      } catch (error) {
        clearTokens();

        dispatch(logout());
      } finally {
        dispatch(authInitialized());
      }
    };

    bootstrap();
  }, [dispatch]);

  return children;
};

export default AuthBootstrap;
