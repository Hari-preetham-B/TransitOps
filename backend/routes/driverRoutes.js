const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
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
  .post(protect, createDriverValidator, validate, addDriver)
  .get(protect, getDrivers);

router
  .route("/:id")
  .get(protect, getDriver)
  .put(protect, updateDriverValidator, validate, editDriver)
  .delete(protect, removeDriver);

module.exports = router;
