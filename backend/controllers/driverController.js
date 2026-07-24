const asyncHandler = require("express-async-handler");

const {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} = require("../services/driverService");

const addDriver = asyncHandler(async (req, res) => {
  const driver = await createDriver(req.body);

  res.status(201).json({
    success: true,
    data: driver,
  });
});

const getDrivers = asyncHandler(async (req, res) => {
  const result = await getAllDrivers(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

const getDriver = asyncHandler(async (req, res) => {
  const driver = await getDriverById(req.params.id);

  res.status(200).json({
    success: true,
    data: driver,
  });
});

const editDriver = asyncHandler(async (req, res) => {
  const driver = await updateDriver(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: driver,
  });
});

const removeDriver = asyncHandler(async (req, res) => {
  const result = await deleteDriver(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

module.exports = {
  addDriver,
  getDrivers,
  getDriver,
  editDriver,
  removeDriver,
};
