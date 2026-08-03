const { body } = require("express-validator");

const MAINTENANCE_TYPES = [
  "Oil Change",
  "Engine Repair",
  "Tyre Replacement",
  "Brake Service",
  "General Service",
  "Other",
];

const MAINTENANCE_STATUS = ["Scheduled", "In Progress", "Completed"];

const createMaintenanceValidator = [
  body("vehicle").isMongoId().withMessage("Invalid vehicle ID"),

  body("maintenanceType")
    .isIn(MAINTENANCE_TYPES)
    .withMessage("Invalid maintenance type"),

  body("description").optional().trim(),

  body("scheduledDate")
    .notEmpty()
    .withMessage("Scheduled date is required")
    .isISO8601()
    .withMessage("Scheduled date must be a valid date"),

  body("completedDate")
    .optional()
    .isISO8601()
    .withMessage("Completed date must be a valid date"),

  body("status")
    .optional()
    .isIn(MAINTENANCE_STATUS)
    .withMessage("Invalid maintenance status"),

  body("cost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Cost must be a non-negative number"),
];

const updateMaintenanceValidator = [
  body("vehicle").optional().isMongoId().withMessage("Invalid vehicle ID"),

  body("maintenanceType")
    .optional()
    .isIn(MAINTENANCE_TYPES)
    .withMessage("Invalid maintenance type"),

  body("description").optional().trim(),

  body("scheduledDate")
    .optional()
    .isISO8601()
    .withMessage("Scheduled date must be a valid date"),

  body("completedDate")
    .optional()
    .isISO8601()
    .withMessage("Completed date must be a valid date"),

  body("status")
    .optional()
    .isIn(MAINTENANCE_STATUS)
    .withMessage("Invalid maintenance status"),

  body("cost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Cost must be a non-negative number"),
];

module.exports = {
  createMaintenanceValidator,
  updateMaintenanceValidator,
};
