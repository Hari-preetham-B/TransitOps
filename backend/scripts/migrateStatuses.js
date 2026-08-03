// One-time migration script: update old status values to new enum values
// Run with: node scripts/migrateStatuses.js
require("dotenv").config();
const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");

const VEHICLE_MAP = {
  "In Use": "On Trip",
  Maintenance: "In Shop",
};

const DRIVER_MAP = {
  "On Duty": "On Trip",
};

const TRIP_MAP = {
  Pending: "Draft",
  Active: "Dispatched",
};

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Vehicles
    let vehicleCount = 0;
    for (const [from, to] of Object.entries(VEHICLE_MAP)) {
      const result = await Vehicle.updateMany(
        { status: from },
        { $set: { status: to } },
      );
      vehicleCount += result.modifiedCount;
    }
    console.log(`Vehicles updated: ${vehicleCount}`);

    // Drivers
    let driverCount = 0;
    for (const [from, to] of Object.entries(DRIVER_MAP)) {
      const result = await Driver.updateMany(
        { status: from },
        { $set: { status: to } },
      );
      driverCount += result.modifiedCount;
    }
    console.log(`Drivers updated: ${driverCount}`);

    // Trips
    let tripCount = 0;
    for (const [from, to] of Object.entries(TRIP_MAP)) {
      const result = await Trip.updateMany(
        { status: from },
        { $set: { status: to } },
      );
      tripCount += result.modifiedCount;
    }
    console.log(`Trips updated: ${tripCount}`);

    console.log("Migration complete");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
