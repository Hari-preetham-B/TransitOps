const { body } = require("express-validator");

const EXPENSE_TYPES = [
  "Insurance",
  "Tax",
  "Tolls",
  "License",
  "Repair",
  "Tyre Replacement",
  "Other",
];

const createExpenseValidator = [
  body("vehicle")
    .notEmpty()
    .withMessage("Vehicle is required")
    .isMongoId()
    .withMessage("Invalid vehicle ID"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(EXPENSE_TYPES)
    .withMessage("Invalid expense type"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a non-negative number"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date"),

  body("description").optional().trim(),
];

const updateExpenseValidator = [
  body("vehicle")
    .optional()
    .isMongoId()
    .withMessage("Invalid vehicle ID"),

  body("type")
    .optional()
    .isIn(EXPENSE_TYPES)
    .withMessage("Invalid expense type"),

  body("amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Amount must be a non-negative number"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date"),

  body("description").optional().trim(),
];

module.exports = {
  createExpenseValidator,
  updateExpenseValidator,
  EXPENSE_TYPES,
};
