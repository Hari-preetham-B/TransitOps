const { body } = require("express-validator");
const { VEHICLE_TYPES, VEHICLE_STATUS } = require("../utils/constants");
const createVehicleValidator = [
  body("vehicleNumber")
    .trim()
    .notEmpty()
    .withMessage("Vehicle number is required"),

  body("vehicleType").isIn(VEHICLE_TYPES).withMessage("Invalid vehicle type"),

  body("capacity")
    .isInt({ min: 1 })
    .withMessage("Capacity must be greater than 0"),

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

  body("vehicleType")
    .optional()
    .isIn(VEHICLE_TYPES)
    .withMessage("Invalid vehicle type"),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be greater than 0"),

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
