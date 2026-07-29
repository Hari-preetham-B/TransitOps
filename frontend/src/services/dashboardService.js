import api from "./api";

export const getDashboardStats = async (filters = {}) => {
  const { data } = await api.get("/dashboard", {
    params: filters,
  });

  return data.data;
};
export const getRegions = async () => {
  const { data } = await api.get("/dashboard/regions");
  return data.data;
};
