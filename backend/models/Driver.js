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
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    experience: {
      type: Number,
      default: 0,
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
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Driver", driverSchema);
