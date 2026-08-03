const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  createMaintenanceValidator,
  updateMaintenanceValidator,
} = require("../validators/maintenanceValidator");

const {
  addMaintenance,
  getMaintenance,
  getMaintenanceRecord,
  editMaintenance,
  removeMaintenance,
} = require("../controllers/maintenanceController");

router
  .route("/")
  .post(protect, createMaintenanceValidator, validate, addMaintenance)
  .get(protect, getMaintenance);

router
  .route("/:id")
  .get(protect, getMaintenanceRecord)
  .put(protect, updateMaintenanceValidator, validate, editMaintenance)
  .delete(protect, removeMaintenance);

module.exports = router;
