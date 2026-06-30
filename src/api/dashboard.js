import api from "../lib/axios";

export const getDashboardKpis = () => api.get("/dashboard/kpis");

export const getOrderStatus = () => api.get("/dashboard/order-status");

export const getLowStock = () => api.get("/dashboard/low-stock");

export const getContainerStatus = () => api.get("/dashboard/container-status");

export const getTopProducts = (limit = 5) =>
  api.get("/dashboard/top-products", {
    params: { limit },
  });
