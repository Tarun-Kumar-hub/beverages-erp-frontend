import api from "../lib/axios";

export const getRecipes = ({ search = "" }) =>
  api.get("/recipes", {
    params: {
      search,
    },
  });

export const createRecipe = (data) => api.post("/recipes", data);

export const updateRecipe = (id, data) => api.put(`/recipes/${id}`, data);

export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);
