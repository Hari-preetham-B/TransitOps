const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  createDriverValidator,
  updateDriverValidator,
} = require("../validators/driverValidator");

const {
  addDriver,
  getDrivers,
  getDriver,
  editDriver,
  removeDriver,
} = require("../controllers/driverController");

router
  .route("/")
  .post(
    protect,
    authorize("drivers", "write"),
    createDriverValidator,
    validate,
    addDriver,
  )
  .get(protect, authorize("drivers", "read"), getDrivers);

router
  .route("/:id")
  .get(protect, authorize("drivers", "read"), getDriver)
  .put(
    protect,
    authorize("drivers", "write"),
    updateDriverValidator,
    validate,
    editDriver,
  )
  .delete(protect, authorize("drivers", "write"), removeDriver);

module.exports = router;
