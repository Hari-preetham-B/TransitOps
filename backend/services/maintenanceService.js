const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");
const ApiError = require("../utils/ApiError");
const { VEHICLE_STATUS } = require("../utils/constants");

const MAINTENANCE_STATUS = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const createMaintenance = async (maintenanceData) => {
  const vehicle = await Vehicle.findById(maintenanceData.vehicle);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  // Creating an active maintenance record auto-changes vehicle status to In Shop
  const status = maintenanceData.status || MAINTENANCE_STATUS.SCHEDULED;

  const maintenance = await Maintenance.create({
    ...maintenanceData,
    status,
  });

  // If the maintenance is active (In Progress), set vehicle to In Shop
  if (status === MAINTENANCE_STATUS.IN_PROGRESS) {
    vehicle.status = VEHICLE_STATUS.IN_SHOP;
    await vehicle.save();
  }

  return await Maintenance.findById(maintenance._id).populate(
    "vehicle",
    "vehicleNumber vehicleType status",
  );
};

const getAllMaintenance = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  vehicle,
  sortBy = "createdAt",
  order = "desc",
}) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (vehicle) {
    query.vehicle = vehicle;
  }

  if (search) {
    query.$or = [
      { maintenanceType: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sort = {
    [sortBy]: order === "asc" ? 1 : -1,
  };

  const maintenance = await Maintenance.find(query)
    .populate("vehicle", "vehicleNumber vehicleType status")
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Maintenance.countDocuments(query);

  return {
    maintenance,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

const getMaintenanceById = async (id) => {
  const maintenance = await Maintenance.findById(id).populate(
    "vehicle",
    "vehicleNumber vehicleType status",
  );

  if (!maintenance) {
    throw new ApiError(404, "Maintenance record not found");
  }

  return maintenance;
};

const updateMaintenance = async (id, updateData) => {
  const maintenance = await Maintenance.findById(id);

  if (!maintenance) {
    throw new ApiError(404, "Maintenance record not found");
  }

  const previousStatus = maintenance.status;
  const newStatus = updateData.status || previousStatus;

  const updatedMaintenance = await Maintenance.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  ).populate("vehicle", "vehicleNumber vehicleType status");

  // If maintenance becomes In Progress, set vehicle to In Shop
  if (
    previousStatus !== MAINTENANCE_STATUS.IN_PROGRESS &&
    newStatus === MAINTENANCE_STATUS.IN_PROGRESS
  ) {
    await Vehicle.findByIdAndUpdate(updatedMaintenance.vehicle._id, {
      status: VEHICLE_STATUS.IN_SHOP,
    });
  }

  // Closing maintenance (Completed) restores vehicle to Available (unless retired)
  if (
    previousStatus !== MAINTENANCE_STATUS.COMPLETED &&
    newStatus === MAINTENANCE_STATUS.COMPLETED
  ) {
    const vehicle = await Vehicle.findById(updatedMaintenance.vehicle._id);

    if (vehicle && vehicle.status !== VEHICLE_STATUS.RETIRED) {
      vehicle.status = VEHICLE_STATUS.AVAILABLE;
      await vehicle.save();
    }
  }

  return updatedMaintenance;
};

const deleteMaintenance = async (id) => {
  const maintenance = await Maintenance.findById(id);

  if (!maintenance) {
    throw new ApiError(404, "Maintenance record not found");
  }

  // If deleting an active maintenance, restore vehicle to Available (unless retired)
  if (maintenance.status === MAINTENANCE_STATUS.IN_PROGRESS) {
    const vehicle = await Vehicle.findById(maintenance.vehicle);

    if (vehicle && vehicle.status !== VEHICLE_STATUS.RETIRED) {
      vehicle.status = VEHICLE_STATUS.AVAILABLE;
      await vehicle.save();
    }
  }

  await Maintenance.findByIdAndDelete(id);

  return {
    message: "Maintenance record deleted successfully",
  };
};

module.exports = {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  MAINTENANCE_STATUS,
};
