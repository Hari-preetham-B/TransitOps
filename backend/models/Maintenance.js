const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    maintenanceType: {
      type: String,
      required: true,
      enum: [
        "Oil Change",
        "Engine Repair",
        "Tyre Replacement",
        "Brake Service",
        "General Service",
        "Other",
      ],
    },

    description: {
      type: String,
      trim: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    completedDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed"],
      default: "Scheduled",
    },

    cost: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
