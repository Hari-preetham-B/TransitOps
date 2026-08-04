const FuelLog = require("../models/FuelLog");
const Vehicle = require("../models/Vehicle");
const ApiError = require("../utils/ApiError");

const createFuelLog = async (data) => {
  const vehicle = await Vehicle.findById(data.vehicle);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  const log = await FuelLog.create(data);

  return await log
    .populate("vehicle", "vehicleNumber vehicleType status region")
    .exec();
};

const getAllFuelLogs = async ({
  page = 1,
  limit = 10,
  search = "",
  vehicle,
  sortBy = "createdAt",
  order = "desc",
}) => {
  const query = {};

  if (vehicle) {
    query.vehicle = vehicle;
  }

  if (search) {
    query.$or = [{ notes: { $regex: search, $options: "i" } }];
  }

  const sort = {
    [sortBy]: order === "asc" ? 1 : -1,
  };

  const fuelLogs = await FuelLog.find(query)
    .populate("vehicle", "vehicleNumber vehicleType status region")
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await FuelLog.countDocuments(query);

  return {
    fuelLogs,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

const getFuelLogById = async (id) => {
  const log = await FuelLog.findById(id).populate(
    "vehicle",
    "vehicleNumber vehicleType status region",
  );

  if (!log) {
    throw new ApiError(404, "Fuel log not found");
  }

  return log;
};

const updateFuelLog = async (id, updateData) => {
  const log = await FuelLog.findById(id);

  if (!log) {
    throw new ApiError(404, "Fuel log not found");
  }

  return await FuelLog.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("vehicle", "vehicleNumber vehicleType status region")
    .exec();
};

const deleteFuelLog = async (id) => {
  const log = await FuelLog.findById(id);

  if (!log) {
    throw new ApiError(404, "Fuel log not found");
  }

  await FuelLog.findByIdAndDelete(id);

  return {
    message: "Fuel log deleted successfully",
  };
};

module.exports = {
  createFuelLog,
  getAllFuelLogs,
  getFuelLogById,
  updateFuelLog,
  deleteFuelLog,
};
