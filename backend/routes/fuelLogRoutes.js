const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  createFuelLogValidator,
  updateFuelLogValidator,
} = require("../validators/fuelLogValidator");

const {
  addFuelLog,
  getFuelLogs,
  getFuelLog,
  editFuelLog,
  removeFuelLog,
} = require("../controllers/fuelLogController");

router
  .route("/")
  .get(protect, authorize("fuelLogs", "read"), getFuelLogs)
  .post(
    protect,
    authorize("fuelLogs", "write"),
    createFuelLogValidator,
    validate,
    addFuelLog,
  );

router
  .route("/:id")
  .get(protect, authorize("fuelLogs", "read"), getFuelLog)
  .put(
    protect,
    authorize("fuelLogs", "write"),
    updateFuelLogValidator,
    validate,
    editFuelLog,
  )
  .delete(protect, authorize("fuelLogs", "write"), removeFuelLog);

module.exports = router;
