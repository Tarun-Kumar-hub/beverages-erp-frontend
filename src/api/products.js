import api from "../lib/axios";

export const getProducts = ({
  page = 1,
  limit = 10,
  search = "",
  filter = "",
  status = "active",
}) =>
  api.get("/products", {
    params: {
      page,
      limit,
      search,
      filter,
      status,
    },
  });

export const getProductSummary = () => api.get("/products/summary");

export const getProductHistory = ({ id, page = 1, limit = 10 }) =>
  api.get(`/products/${id}/history`, {
    params: {
      page,
      limit,
    },
  });

export const adjustProductStock = (id, data) =>
  api.patch(`/products/${id}/adjust`, data);

export const toggleProductStatus = (id) => api.patch(`/products/${id}/toggle`);

export const searchProducts = ({ search, page = 1, limit = 10 }) =>
  api.get("/products", {
    params: {
      search,
      page,
      limit,
    },
  });
