const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const Maintenance = require("../models/Maintenance");

const getDashboardStats = async (filters = {}) => {
  const vehicleFilter = {};
  const driverFilter = {};
  const tripFilter = {};

  // Optional Filters
  if (filters.region) {
    vehicleFilter.region = filters.region;
    driverFilter.region = filters.region;
  }

  if (filters.vehicleType) {
    vehicleFilter.vehicleType = filters.vehicleType;
  }

  // Vehicle Statistics
  const activeVehicles = await Vehicle.countDocuments({
    ...vehicleFilter,
    status: "Active",
  });

  const availableVehicles = await Vehicle.countDocuments({
    ...vehicleFilter,
    status: "Available",
  });

  // Maintenance Statistics
  const vehiclesInMaintenance = await Maintenance.countDocuments({
    status: "In Progress",
  });

  // Trip Statistics
  const activeTrips = await Trip.countDocuments({
    ...tripFilter,
    status: "Active",
  });

  const pendingTrips = await Trip.countDocuments({
    ...tripFilter,
    status: "Pending",
  });

  // Driver Statistics
  const driversOnDuty = await Driver.countDocuments({
    ...driverFilter,
    status: "On Duty",
  });

  // Fleet Utilization
  const totalVehicles = await Vehicle.countDocuments(vehicleFilter);

  const fleetUtilization =
    totalVehicles === 0
      ? 0
      : Math.round((activeVehicles / totalVehicles) * 100);

  const tripStatus = await Trip.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const vehicleStatus = await Vehicle.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  return {
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilization,

    analytics: {
      tripStatus,
      vehicleStatus,
    },
  };
};
const getRegions = async () => {
  return await Vehicle.distinct("region");
};
module.exports = {
  getDashboardStats,
  getRegions,
};
