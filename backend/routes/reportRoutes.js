const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");
const { getReport, getVehicleCost } = require("../controllers/reportController");

router.get(
  "/operational-cost/:id",
  protect,
  authorize("reports", "read"),
  getVehicleCost,
);

router.get("/", protect, authorize("reports", "read"), getReport);

module.exports = router;
