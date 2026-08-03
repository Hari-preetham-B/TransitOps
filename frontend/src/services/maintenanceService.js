import api from "./api";

export const getMaintenance = (params = {}) =>
  api.get("/maintenance", { params });

export const getMaintenanceRecord = (id) => api.get(`/maintenance/${id}`);

export const createMaintenance = (data) => api.post("/maintenance", data);

export const updateMaintenance = (id, data) =>
  api.put(`/maintenance/${id}`, data);

export const deleteMaintenance = (id) => api.delete(`/maintenance/${id}`);
