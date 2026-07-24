const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    region: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Available", "On Duty", "Off Duty"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Driver", driverSchema);
