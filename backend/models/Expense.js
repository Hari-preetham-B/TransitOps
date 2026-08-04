const mongoose = require("mongoose");

const EXPENSE_TYPES = [
  "Insurance",
  "Tax",
  "Tolls",
  "License",
  "Repair",
  "Tyre Replacement",
  "Other",
];

const expenseSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: EXPENSE_TYPES,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Expense", expenseSchema);
