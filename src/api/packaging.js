import api from "../lib/axios";

export const getPackagingContainers = () => api.get("/packaging/containers");

export const getPackagingMaterials = () => api.get("/packaging/materials");

export const getPackagingStock = () => api.get("/packaging/stock");

export const packContainer = (data) => api.post("/packaging/pack", data);

export const getPackagingLogs = ({ page = 1, limit = 5 }) =>
  api.get("/packaging/logs", {
    params: {
      page,
      limit,
    },
  });
