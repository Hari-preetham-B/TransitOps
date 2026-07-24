const mongoose = require("mongoose");
const { VEHICLE_STATUS, VEHICLE_TYPES } = require("../utils/constants");
const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    vehicleType: {
      type: String,
      required: true,
      enum: VEHICLE_TYPES,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: Object.values(VEHICLE_STATUS),
      default: VEHICLE_STATUS.AVAILABLE,
    },

    region: {
      type: String,
      required: true,
      trim: true,
    },

    fuelType: {
      type: String,
      enum: ["Diesel", "Petrol", "Electric", "CNG"],
      default: "Diesel",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
