import api from "./api";

export const getRecentTrips = async () => {
  const { data } = await api.get("/trips?limit=5&sortBy=createdAt&order=desc");

  return data.trips;
};
