import api from "./api";

export const getTrips = (params = {}) => api.get("/trips", { params });

export const getTrip = (id) => api.get(`/trips/${id}`);

export const createTrip = (data) => api.post("/trips", data);

export const updateTrip = (id, data) => api.put(`/trips/${id}`, data);

export const deleteTrip = (id) => api.delete(`/trips/${id}`);

export const getRecentTrips = async () => {
  const { data } = await api.get("/trips?limit=5&sortBy=createdAt&order=desc");

  return data.trips;
};
