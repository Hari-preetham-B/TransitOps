const Vehicle = require("../models/Vehicle");
const ApiError = require("../utils/ApiError");
const createVehicle = async (vehicleData) => {
  const existingVehicle = await Vehicle.findOne({
    vehicleNumber: vehicleData.vehicleNumber.toUpperCase(),
  });

  if (existingVehicle) {
    throw new ApiError(409, "Vehicle with this number already exists");
  }

  const vehicle = await Vehicle.create(vehicleData);

  return vehicle;
};

const getAllVehicles = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    vehicleType,
    region,
    sortBy = "createdAt",
    order = "desc",
  } = query;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (vehicleType) {
    filter.vehicleType = vehicleType;
  }

  if (region) {
    filter.region = region;
  }

  if (search) {
    filter.$or = [
      { vehicleNumber: { $regex: search, $options: "i" } },
      { region: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const sort = {
    [sortBy]: order === "asc" ? 1 : -1,
  };

  const vehicles = await Vehicle.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Vehicle.countDocuments(filter);

  return {
    vehicles,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

const getVehicleById = async (id) => {
  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  return vehicle;
};

const updateVehicle = async (id, vehicleData) => {
  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  // Prevent duplicate vehicle numbers
  if (
    vehicleData.vehicleNumber &&
    vehicleData.vehicleNumber.toUpperCase() !== vehicle.vehicleNumber
  ) {
    const existingVehicle = await Vehicle.findOne({
      vehicleNumber: vehicleData.vehicleNumber.toUpperCase(),
    });

    if (existingVehicle) {
      throw new ApiError(409, "Vehicle number already exists");
    }

    vehicleData.vehicleNumber = vehicleData.vehicleNumber.toUpperCase();
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(id, vehicleData, {
    new: true,
    runValidators: true,
  });

  return updatedVehicle;
};

const deleteVehicle = async (id) => {
  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  await Vehicle.findByIdAndDelete(id);

  return {
    message: "Vehicle deleted successfully",
  };
};
module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
