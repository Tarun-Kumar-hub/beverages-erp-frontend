import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },

    restoreSession: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    finishLoading: (state) => {
      state.isLoading = false;
    },
    authInitialized(state) {
      state.isLoading = false;
    },
  },
});

export const {
  loginSuccess,
  logout,
  restoreSession,
  finishLoading,
  authInitialized,
} = authSlice.actions;

export default authSlice.reducer;
