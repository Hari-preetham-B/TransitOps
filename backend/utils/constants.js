const DRIVER_STATUS = {
  AVAILABLE: "Available",
  ON_DUTY: "On Duty",
  OFF_DUTY: "Off Duty",
};

const VEHICLE_STATUS = {
  AVAILABLE: "Available",
  IN_USE: "In Use",
  MAINTENANCE: "Maintenance",
};

const TRIP_STATUS = {
  PENDING: "Pending",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const VEHICLE_TYPES = ["Bus", "Truck", "Van", "Car"];

module.exports = {
  DRIVER_STATUS,
  VEHICLE_STATUS,
  TRIP_STATUS,
  VEHICLE_TYPES,
};
