import api from "../lib/axios";

export const getMaterials = ({ page = 1, limit = 5, search = "" }) =>
  api.get("/materials", {
    params: {
      page,
      limit,
      search,
    },
  });

export const createMaterial = (data) => api.post("/materials", data);

export const updateMaterial = (id, data) => api.put(`/materials/${id}`, data);

export const deleteMaterial = (id) => api.delete(`/materials/${id}`);

export const addStock = (id, quantity) =>
  api.put(`/materials/add-stock/${id}`, { quantity });

// ===============================
// INVENTORY HISTORY
// ===============================

export const getInventoryHistory = ({
  page = 1,
  limit = 10,
  search = "",
  type = "",
  startDate = "",
  endDate = "",
}) =>
  api.get("/materials/inventory-history", {
    params: {
      page,
      limit,
      search,
      type,
      start_date: startDate,
      end_date: endDate,
    },
  });
