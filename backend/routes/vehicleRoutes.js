const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");
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
  .get(protect, authorize("vehicles", "read"), getVehicles)
  .post(
    protect,
    authorize("vehicles", "write"),
    createVehicleValidator,
    validate,
    addVehicle,
  );

router
  .route("/:id")
  .get(protect, authorize("vehicles", "read"), getVehicle)
  .put(
    protect,
    authorize("vehicles", "write"),
    updateVehicleValidator,
    validate,
    editVehicle,
  )
  .delete(protect, authorize("vehicles", "write"), removeVehicle);

module.exports = router;
