const asyncHandler = require("express-async-handler");

const {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../services/tripService");

const addTrip = asyncHandler(async (req, res) => {
  const trip = await createTrip(req.body);

  res.status(201).json({
    success: true,
    data: trip,
  });
});

const getTrips = asyncHandler(async (req, res) => {
  const result = await getAllTrips(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

const getTrip = asyncHandler(async (req, res) => {
  const trip = await getTripById(req.params.id);

  res.status(200).json({
    success: true,
    data: trip,
  });
});

const editTrip = asyncHandler(async (req, res) => {
  const trip = await updateTrip(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: trip,
  });
});

const removeTrip = asyncHandler(async (req, res) => {
  const result = await deleteTrip(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

module.exports = {
  addTrip,
  getTrips,
  getTrip,
  editTrip,
  removeTrip,
};
