const { body } = require("express-validator");

const createVehicleValidator = [
  body("vehicleNumber")
    .trim()
    .notEmpty()
    .withMessage("Vehicle number is required"),

  body("vehicleType")
    .isIn(["Bus", "Truck", "Van", "Car"])
    .withMessage("Invalid vehicle type"),

  body("capacity")
    .isInt({ min: 1 })
    .withMessage("Capacity must be greater than 0"),

  body("status")
    .optional()
    .isIn(["Available", "Active", "Maintenance"])
    .withMessage("Invalid vehicle status"),

  body("region").trim().notEmpty().withMessage("Region is required"),

  body("fuelType")
    .optional()
    .isIn(["Diesel", "Petrol", "Electric", "CNG"])
    .withMessage("Invalid fuel type"),
];

module.exports = {
  createVehicleValidator,
};
