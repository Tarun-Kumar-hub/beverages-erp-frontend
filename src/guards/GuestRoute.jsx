import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsAuthenticated,
  selectIsLoading,
} from "../features/auth/authSelectors";

import SplashScreen from "../components/ui/SplashScreen";

const GuestRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
