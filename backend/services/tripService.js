const Trip = require("../models/Trip");
const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");
const ApiError = require("../utils/ApiError");
const {
  DRIVER_STATUS,
  VEHICLE_STATUS,
  TRIP_STATUS,
} = require("../utils/constants");

const createTrip = async (tripData) => {
  const existingTrip = await Trip.findOne({
    tripCode: tripData.tripCode,
  });

  if (existingTrip) {
    throw new ApiError(409, "Trip code already exists");
  }

  const driver = await Driver.findById(tripData.driver);

  if (!driver) {
    throw new ApiError(404, "Driver not found");
  }

  const vehicle = await Vehicle.findById(tripData.vehicle);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  // Cargo weight must not exceed the vehicle's max load capacity
  if (tripData.cargoWeight && tripData.cargoWeight > vehicle.maxLoadCapacity) {
    throw new ApiError(
      400,
      `Cargo weight (${tripData.cargoWeight}) exceeds vehicle max load capacity (${vehicle.maxLoadCapacity})`,
    );
  }

  // Trips are created as Draft by default; dispatch rules are enforced on dispatch
  const trip = await Trip.create({
    ...tripData,
    status: tripData.status || TRIP_STATUS.DRAFT,
  });

  return await Trip.findById(trip._id).populate("driver").populate("vehicle");
};

const dispatchTrip = async (trip) => {
  const driver = await Driver.findById(trip.driver);

  if (!driver) {
    throw new ApiError(404, "Driver not found");
  }

  const vehicle = await Vehicle.findById(trip.vehicle);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  // Retired or In Shop vehicles must never appear in dispatch selection
  if (
    vehicle.status === VEHICLE_STATUS.RETIRED ||
    vehicle.status === VEHICLE_STATUS.IN_SHOP
  ) {
    throw new ApiError(
      409,
      `Vehicle is ${vehicle.status} and cannot be dispatched`,
    );
  }

  // A vehicle already On Trip cannot be assigned to another trip
  if (vehicle.status === VEHICLE_STATUS.ON_TRIP) {
    throw new ApiError(409, "Vehicle is already on a trip");
  }

  // Drivers with expired licenses or Suspended status cannot be assigned to trips
  if (driver.status === DRIVER_STATUS.SUSPENDED) {
    throw new ApiError(409, "Driver is suspended and cannot be assigned");
  }

  if (
    driver.licenseExpiryDate &&
    new Date(driver.licenseExpiryDate) < new Date()
  ) {
    throw new ApiError(409, "Driver license has expired");
  }

  // A driver already On Trip cannot be assigned to another trip
  if (driver.status === DRIVER_STATUS.ON_TRIP) {
    throw new ApiError(409, "Driver is already on a trip");
  }

  // Cargo weight must not exceed the vehicle's max load capacity
  if (trip.cargoWeight && trip.cargoWeight > vehicle.maxLoadCapacity) {
    throw new ApiError(
      400,
      `Cargo weight (${trip.cargoWeight}) exceeds vehicle max load capacity (${vehicle.maxLoadCapacity})`,
    );
  }

  // Dispatching a trip auto-changes both vehicle and driver status to On Trip
  driver.status = DRIVER_STATUS.ON_TRIP;
  driver.assignedVehicle = vehicle._id;

  vehicle.status = VEHICLE_STATUS.ON_TRIP;

  await driver.save();
  await vehicle.save();
};

const getAllTrips = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  sortBy = "createdAt",
  order = "desc",
}) => {
  const query = {};

  if (search) {
    query.$or = [
      { tripCode: { $regex: search, $options: "i" } },
      { origin: { $regex: search, $options: "i" } },
      { destination: { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  const sort = {
    [sortBy]: order === "asc" ? 1 : -1,
  };

  const trips = await Trip.find(query)
    .populate("driver")
    .populate("vehicle")
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Trip.countDocuments(query);

  return {
    trips,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

const getTripById = async (id) => {
  const trip = await Trip.findById(id).populate("driver").populate("vehicle");

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  return trip;
};

const updateTrip = async (id, updateData) => {
  const trip = await Trip.findById(id);

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  if (updateData.tripCode && updateData.tripCode !== trip.tripCode) {
    const existing = await Trip.findOne({
      tripCode: updateData.tripCode,
    });

    if (existing) {
      throw new ApiError(409, "Trip code already exists");
    }
  }

  const previousStatus = trip.status;
  const newStatus = updateData.status || previousStatus;

  // If dispatching, enforce all dispatch rules and update driver/vehicle status
  if (
    previousStatus !== TRIP_STATUS.DISPATCHED &&
    newStatus === TRIP_STATUS.DISPATCHED
  ) {
    await dispatchTrip(trip);
  }

  const updatedTrip = await Trip.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("driver")
    .populate("vehicle");

  // Completing a trip auto-changes both back to Available
  if (
    previousStatus !== TRIP_STATUS.COMPLETED &&
    updatedTrip.status === TRIP_STATUS.COMPLETED
  ) {
    await Driver.findByIdAndUpdate(updatedTrip.driver._id, {
      status: DRIVER_STATUS.AVAILABLE,
      assignedVehicle: null,
    });

    await Vehicle.findByIdAndUpdate(updatedTrip.vehicle._id, {
      status: VEHICLE_STATUS.AVAILABLE,
    });
  }

  // Cancelling a dispatched trip restores vehicle and driver to Available
  if (
    previousStatus !== TRIP_STATUS.CANCELLED &&
    updatedTrip.status === TRIP_STATUS.CANCELLED
  ) {
    await Driver.findByIdAndUpdate(updatedTrip.driver._id, {
      status: DRIVER_STATUS.AVAILABLE,
      assignedVehicle: null,
    });

    await Vehicle.findByIdAndUpdate(updatedTrip.vehicle._id, {
      status: VEHICLE_STATUS.AVAILABLE,
    });
  }

  return updatedTrip;
};

const deleteTrip = async (id) => {
  const trip = await Trip.findById(id);

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  // Only restore driver/vehicle if the trip was dispatched
  if (trip.status === TRIP_STATUS.DISPATCHED) {
    await Driver.findByIdAndUpdate(trip.driver, {
      status: DRIVER_STATUS.AVAILABLE,
      assignedVehicle: null,
    });

    await Vehicle.findByIdAndUpdate(trip.vehicle, {
      status: VEHICLE_STATUS.AVAILABLE,
    });
  }

  await Trip.findByIdAndDelete(id);

  return {
    message: "Trip deleted successfully",
  };
};

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};
