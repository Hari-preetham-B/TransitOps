const { body } = require("express-validator");
const { TRIP_STATUS } = require("../utils/constants");

const createTripValidator = [
  body("tripCode").trim().notEmpty().withMessage("Trip code is required"),

  body("origin").trim().notEmpty().withMessage("Origin is required"),

  body("destination").trim().notEmpty().withMessage("Destination is required"),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Start time must be a valid date"),

  body("endTime")
    .optional()
    .isISO8601()
    .withMessage("End time must be a valid date"),

  body("distance")
    .isFloat({ min: 0 })
    .withMessage("Distance must be a non-negative number"),

  body("driver").isMongoId().withMessage("Invalid driver ID"),

  body("vehicle").isMongoId().withMessage("Invalid vehicle ID"),

  body("status")
    .optional()
    .isIn(Object.values(TRIP_STATUS))
    .withMessage("Invalid trip status"),

  body("remarks").optional().trim(),
];

const updateTripValidator = [
  body("tripCode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Trip code cannot be empty"),

  body("origin")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Origin cannot be empty"),

  body("destination")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Destination cannot be empty"),

  body("startTime")
    .optional()
    .isISO8601()
    .withMessage("Start time must be a valid date"),

  body("endTime")
    .optional()
    .isISO8601()
    .withMessage("End time must be a valid date"),

  body("distance")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Distance must be a non-negative number"),

  body("driver").optional().isMongoId().withMessage("Invalid driver ID"),

  body("vehicle").optional().isMongoId().withMessage("Invalid vehicle ID"),

  body("status")
    .optional()
    .isIn(Object.values(TRIP_STATUS))
    .withMessage("Invalid trip status"),

  body("remarks").optional().trim(),
];

module.exports = {
  createTripValidator,
  updateTripValidator,
};
