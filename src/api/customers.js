import api from "../lib/axios";
export const getCustomers = (params) => api.get("/customers", { params });

export const searchCustomers = (params) =>
  api.get("/customers/search", { params });

export const getCustomer = (id) => api.get(`/customers/${id}`);

export const createCustomer = (payload) => api.post("/customers", payload);

export const updateCustomer = ({ id, payload }) =>
  api.put(`/customers/${id}`, payload);

export const deleteCustomer = (id) => api.delete(`/customers/${id}`);
