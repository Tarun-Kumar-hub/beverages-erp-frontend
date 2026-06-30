import api, { refreshClient } from "../lib/axios";

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const login = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export const register = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};

/*
|--------------------------------------------------------------------------
| Refresh Token
|--------------------------------------------------------------------------
*/

export const refreshToken = async (refresh_token) => {
  const { data } = await refreshClient.post("/auth/refresh", {
    refresh_token,
  });

  return data;
};

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};
