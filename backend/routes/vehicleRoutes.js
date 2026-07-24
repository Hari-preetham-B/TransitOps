const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  createVehicleValidator,
  updateVehicleValidator,
} = require("../validators/vehicleValidator");

const {
  addVehicle,
  getVehicles,
  getVehicle,
  editVehicle,
  removeVehicle,
} = require("../controllers/vehicleController");

router
  .route("/")
  .get(protect, getVehicles)
  .post(protect, createVehicleValidator, validate, addVehicle);

router
  .route("/:id")
  .get(protect, getVehicle)
  .put(protect, updateVehicleValidator, validate, editVehicle)
  .delete(protect, removeVehicle);

module.exports = router;
