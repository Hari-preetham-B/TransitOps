const asyncHandler = require("express-async-handler");

const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
} = require("../services/maintenanceService");

const addMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await createMaintenance(req.body);

  res.status(201).json({
    success: true,
    data: maintenance,
  });
});

const getMaintenance = asyncHandler(async (req, res) => {
  const result = await getAllMaintenance(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

const getMaintenanceRecord = asyncHandler(async (req, res) => {
  const maintenance = await getMaintenanceById(req.params.id);

  res.status(200).json({
    success: true,
    data: maintenance,
  });
});

const editMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await updateMaintenance(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: maintenance,
  });
});

const removeMaintenance = asyncHandler(async (req, res) => {
  const result = await deleteMaintenance(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

module.exports = {
  addMaintenance,
  getMaintenance,
  getMaintenanceRecord,
  editMaintenance,
  removeMaintenance,
};
