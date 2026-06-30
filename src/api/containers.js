import api from "../lib/axios";

export const getContainers = ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
}) =>
  api.get("/containers", {
    params: {
      page,
      limit,
      search,
      status,
    },
  });

export const createContainer = (data) => api.post("/containers", data);

export const deleteContainer = (id) => api.delete(`/containers/${id}`);

export const markContainerUsed = (id) =>
  api.patch(`/containers/${id}/mark-used`);

export const getContainerPreview = (recipeId, size) =>
  api.get(`/containers/preview/${recipeId}/${size}`);
