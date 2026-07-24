const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const { createVehicleValidator } = require("../validators/vehicleValidator");

const { addVehicle } = require("../controllers/vehicleController");

router.post("/", protect, createVehicleValidator, validate, addVehicle);

module.exports = router;
