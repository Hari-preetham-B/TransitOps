const Vehicle = require("../models/Vehicle");

const createVehicle = async (vehicleData) => {
  const existingVehicle = await Vehicle.findOne({
    vehicleNumber: vehicleData.vehicleNumber.toUpperCase(),
  });

  if (existingVehicle) {
    throw new Error("Vehicle with this number already exists");
  }

  const vehicle = await Vehicle.create(vehicleData);

  return vehicle;
};

module.exports = {
  createVehicle,
};
