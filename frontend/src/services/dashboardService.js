import api from "./api";

export const getDashboardStats = async (filters = {}) => {
  const { data } = await api.get("/dashboard", {
    params: filters,
  });

  return data.data;
};
