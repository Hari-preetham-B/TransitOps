const asyncHandler = require("../middleware/asyncHandler");
const {
  createFuelLog,
  getAllFuelLogs,
  getFuelLogById,
  updateFuelLog,
  deleteFuelLog,
} = require("../services/fuelLogService");

const addFuelLog = asyncHandler(async (req, res) => {
  const log = await createFuelLog(req.body);

  res.status(201).json({
    success: true,
    message: "Fuel log created successfully",
    data: log,
  });
});

const getFuelLogs = asyncHandler(async (req, res) => {
  const result = await getAllFuelLogs(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

const getFuelLog = asyncHandler(async (req, res) => {
  const log = await getFuelLogById(req.params.id);

  res.status(200).json({
    success: true,
    data: log,
  });
});

const editFuelLog = asyncHandler(async (req, res) => {
  const log = await updateFuelLog(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Fuel log updated successfully",
    data: log,
  });
});

const removeFuelLog = asyncHandler(async (req, res) => {
  const result = await deleteFuelLog(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

module.exports = {
  addFuelLog,
  getFuelLogs,
  getFuelLog,
  editFuelLog,
  removeFuelLog,
};
