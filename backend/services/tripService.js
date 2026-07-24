const Trip = require("../models/Trip");
const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");

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
    throw new Error("Trip code already exists");
  }

  const driver = await Driver.findById(tripData.driver);

  if (!driver) {
    throw new Error("Driver not found");
  }

  const vehicle = await Vehicle.findById(tripData.vehicle);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  if (driver.status !== DRIVER_STATUS.AVAILABLE) {
    throw new Error("Driver is not available");
  }

  if (vehicle.status !== VEHICLE_STATUS.AVAILABLE) {
    throw new Error("Vehicle is not available");
  }

  const trip = await Trip.create(tripData);

  driver.status = DRIVER_STATUS.ON_DUTY;
  driver.assignedVehicle = vehicle._id;

  vehicle.status = VEHICLE_STATUS.IN_USE;

  await driver.save();
  await vehicle.save();

  return await Trip.findById(trip._id).populate("driver").populate("vehicle");
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
    throw new Error("Trip not found");
  }

  return trip;
};

const updateTrip = async (id, updateData) => {
  const trip = await Trip.findById(id);

  if (!trip) {
    throw new Error("Trip not found");
  }

  if (updateData.tripCode && updateData.tripCode !== trip.tripCode) {
    const existing = await Trip.findOne({
      tripCode: updateData.tripCode,
    });

    if (existing) {
      throw new Error("Trip code already exists");
    }
  }

  const previousStatus = trip.status;

  const updatedTrip = await Trip.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("driver")
    .populate("vehicle");

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
    throw new Error("Trip not found");
  }

  await Driver.findByIdAndUpdate(trip.driver, {
    status: DRIVER_STATUS.AVAILABLE,
    assignedVehicle: null,
  });

  await Vehicle.findByIdAndUpdate(trip.vehicle, {
    status: VEHICLE_STATUS.AVAILABLE,
  });

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
