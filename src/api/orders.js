// api/orders.js

import api from "../lib/axios";
export const getOrders = (params) => api.get("/orders", { params });

export const getOrder = (id) => api.get(`/orders/${id}`);

export const getCustomerOrderHistory = ({ customerId, page, limit }) =>
  api.get(`/orders/customer/${customerId}/history`, {
    params: { page, limit },
  });

export const createOrder = (payload) => api.post("/orders", payload);

export const updateOrderStatus = ({ id, payload }) =>
  api.patch(`/orders/${id}/status`, payload);

export const updatePaymentStatus = ({ id, payload }) =>
  api.patch(`/orders/${id}/payment`, payload);

export const cancelOrder = (id) => api.patch(`/orders/${id}/cancel`);

export const deleteOrder = (id) => api.delete(`/orders/${id}`);
