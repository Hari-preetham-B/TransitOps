const { body } = require("express-validator");
const { VEHICLE_TYPES, VEHICLE_STATUS } = require("../utils/constants");
const createVehicleValidator = [
  body("vehicleNumber")
    .trim()
    .notEmpty()
    .withMessage("Vehicle number is required"),

  body("name").optional().trim(),

  body("model").optional().trim(),

  body("vehicleType").isIn(VEHICLE_TYPES).withMessage("Invalid vehicle type"),

  body("maxLoadCapacity")
    .isInt({ min: 1 })
    .withMessage("Max load capacity must be greater than 0"),

  body("odometer")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Odometer must be a non-negative number"),

  body("acquisitionCost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Acquisition cost must be a non-negative number"),

  body("status")
    .optional()
    .isIn(Object.values(VEHICLE_STATUS))
    .withMessage("Invalid vehicle status"),

  body("region").trim().notEmpty().withMessage("Region is required"),

  body("fuelType")
    .optional()
    .isIn(["Diesel", "Petrol", "Electric", "CNG"])
    .withMessage("Invalid fuel type"),
];

const updateVehicleValidator = [
  body("vehicleNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Vehicle number cannot be empty"),

  body("name").optional().trim(),

  body("model").optional().trim(),

  body("vehicleType")
    .optional()
    .isIn(VEHICLE_TYPES)
    .withMessage("Invalid vehicle type"),

  body("maxLoadCapacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max load capacity must be greater than 0"),

  body("odometer")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Odometer must be a non-negative number"),

  body("acquisitionCost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Acquisition cost must be a non-negative number"),

  body("status")
    .optional()
    .isIn(Object.values(VEHICLE_STATUS))
    .withMessage("Invalid vehicle status"),

  body("region")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Region cannot be empty"),

  body("fuelType")
    .optional()
    .isIn(["Diesel", "Petrol", "Electric", "CNG"])
    .withMessage("Invalid fuel type"),
];

module.exports = {
  createVehicleValidator,
  updateVehicleValidator,
};
