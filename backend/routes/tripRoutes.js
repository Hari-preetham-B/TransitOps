const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  createTripValidator,
  updateTripValidator,
} = require("../validators/tripValidator");

const {
  addTrip,
  getTrips,
  getTrip,
  editTrip,
  removeTrip,
} = require("../controllers/tripController");

router
  .route("/")
  .post(protect, createTripValidator, validate, addTrip)
  .get(protect, getTrips);

router
  .route("/:id")
  .get(protect, getTrip)
  .put(protect, updateTripValidator, validate, editTrip)
  .delete(protect, removeTrip);

module.exports = router;
