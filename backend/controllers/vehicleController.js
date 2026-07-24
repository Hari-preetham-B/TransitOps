const asyncHandler = require("../middleware/asyncHandler");
const { createVehicle } = require("../services/vehicleService");

const addVehicle = asyncHandler(async (req, res) => {
  const vehicle = await createVehicle(req.body);

  res.status(201).json({
    success: true,
    message: "Vehicle created successfully",
    data: vehicle,
  });
});

module.exports = {
  addVehicle,
};
