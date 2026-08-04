const { body } = require("express-validator");

const createFuelLogValidator = [
  body("vehicle")
    .notEmpty()
    .withMessage("Vehicle is required")
    .isMongoId()
    .withMessage("Invalid vehicle ID"),

  body("liters")
    .notEmpty()
    .withMessage("Liters is required")
    .isFloat({ min: 0 })
    .withMessage("Liters must be a non-negative number"),

  body("cost")
    .notEmpty()
    .withMessage("Cost is required")
    .isFloat({ min: 0 })
    .withMessage("Cost must be a non-negative number"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date"),

  body("notes").optional().trim(),
];

const updateFuelLogValidator = [
  body("vehicle")
    .optional()
    .isMongoId()
    .withMessage("Invalid vehicle ID"),

  body("liters")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Liters must be a non-negative number"),

  body("cost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Cost must be a non-negative number"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date"),

  body("notes").optional().trim(),
];

module.exports = {
  createFuelLogValidator,
  updateFuelLogValidator,
};
