const asyncHandler = require("../middleware/asyncHandler");
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../services/vehicleService");

const addVehicle = asyncHandler(async (req, res) => {
  const vehicle = await createVehicle(req.body);

  res.status(201).json({
    success: true,
    message: "Vehicle created successfully",
    data: vehicle,
  });
});

const getVehicles = asyncHandler(async (req, res) => {
  const data = await getAllVehicles(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});

const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await getVehicleById(req.params.id);

  res.status(200).json({
    success: true,
    data: vehicle,
  });
});

const editVehicle = asyncHandler(async (req, res) => {
  const vehicle = await updateVehicle(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Vehicle updated successfully",
    data: vehicle,
  });
});

const removeVehicle = asyncHandler(async (req, res) => {
  const result = await deleteVehicle(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

module.exports = {
  addVehicle,
  getVehicles,
  getVehicle,
  editVehicle,
  removeVehicle,
};
