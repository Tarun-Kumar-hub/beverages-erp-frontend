import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
} from "../features/auth/authSelectors";

import SplashScreen from "../components/ui/SplashScreen";

const RoleRoute = ({ allowedRoles, children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const user = useSelector(selectUser);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;
