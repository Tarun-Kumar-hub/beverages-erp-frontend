import { store } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { clearTokens } from "./token.service";

export const logoutUser = () => {
  clearTokens();

  store.dispatch(logout());
};
