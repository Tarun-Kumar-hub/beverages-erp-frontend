import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./app/store";

import AuthBootstrap from "./components/auth/AuthBootstrap";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>
          <App />
        </AuthBootstrap>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
