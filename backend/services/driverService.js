const Driver = require("../models/Driver");

const createDriver = async (driverData) => {
  const existingDriver = await Driver.findOne({
    licenseNumber: driverData.licenseNumber,
  });

  if (existingDriver) {
    throw new Error("Driver with this license number already exists");
  }

  return await Driver.create(driverData);
};

const getAllDrivers = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  region,
  sortBy = "createdAt",
  order = "desc",
}) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { licenseNumber: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  if (region) {
    query.region = region;
  }

  const sort = {
    [sortBy]: order === "asc" ? 1 : -1,
  };

  const drivers = await Driver.find(query)
    .populate("assignedVehicle", "vehicleNumber vehicleType")
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Driver.countDocuments(query);

  return {
    drivers,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

const getDriverById = async (id) => {
  const driver = await Driver.findById(id).populate(
    "assignedVehicle",
    "vehicleNumber vehicleType",
  );

  if (!driver) {
    throw new Error("Driver not found");
  }

  return driver;
};

const updateDriver = async (id, updateData) => {
  const driver = await Driver.findById(id);

  if (!driver) {
    throw new Error("Driver not found");
  }

  if (
    updateData.licenseNumber &&
    updateData.licenseNumber !== driver.licenseNumber
  ) {
    const existing = await Driver.findOne({
      licenseNumber: updateData.licenseNumber,
    });

    if (existing) {
      throw new Error("Driver with this license number already exists");
    }
  }

  return await Driver.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("assignedVehicle", "vehicleNumber vehicleType");
};

const deleteDriver = async (id) => {
  const driver = await Driver.findById(id);

  if (!driver) {
    throw new Error("Driver not found");
  }

  await Driver.findByIdAndDelete(id);

  return {
    message: "Driver deleted successfully",
  };
};

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};
