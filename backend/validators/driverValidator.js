const { body } = require("express-validator");
const { DRIVER_STATUS } = require("../utils/constants");
const createDriverValidator = [
  body("name").trim().notEmpty().withMessage("Driver name is required"),

  body("licenseNumber")
    .trim()
    .notEmpty()
    .withMessage("License number is required"),

  body("licenseCategory").optional().trim(),

  body("licenseExpiryDate")
    .optional()
    .isISO8601()
    .withMessage("License expiry date must be a valid date"),

  body("safetyScore")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Safety score must be between 0 and 100"),

  body("phone").trim().notEmpty().withMessage("Phone number is required"),

  body("email").optional().isEmail().withMessage("Invalid email address"),

  body("experience")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Experience must be a non-negative number"),

  body("region").trim().notEmpty().withMessage("Region is required"),

  body("status")
    .optional()
    .isIn(Object.values(DRIVER_STATUS))
    .withMessage("Invalid driver status"),

  body("assignedVehicle")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Invalid vehicle ID"),
];

const updateDriverValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Driver name cannot be empty"),

  body("licenseNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("License number cannot be empty"),

  body("licenseCategory").optional().trim(),

  body("licenseExpiryDate")
    .optional()
    .isISO8601()
    .withMessage("License expiry date must be a valid date"),

  body("safetyScore")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Safety score must be between 0 and 100"),

  body("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone number cannot be empty"),

  body("email").optional().isEmail().withMessage("Invalid email address"),

  body("experience")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Experience must be a non-negative number"),

  body("region")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Region cannot be empty"),

  body("status")
    .optional()
    .isIn(Object.values(DRIVER_STATUS))
    .withMessage("Invalid driver status"),

  body("assignedVehicle")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Invalid vehicle ID"),
];

module.exports = {
  createDriverValidator,
  updateDriverValidator,
};
