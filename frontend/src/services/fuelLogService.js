import api from "./api";

export const getFuelLogs = (params = {}) => api.get("/fuel-logs", { params });

export const getFuelLog = (id) => api.get(`/fuel-logs/${id}`);

export const createFuelLog = (data) => api.post("/fuel-logs", data);

export const updateFuelLog = (id, data) => api.put(`/fuel-logs/${id}`, data);

export const deleteFuelLog = (id) => api.delete(`/fuel-logs/${id}`);
