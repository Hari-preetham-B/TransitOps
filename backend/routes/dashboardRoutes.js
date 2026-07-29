const express = require("express");
const router = express.Router();

const {
  dashboardStats,
  regions,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, dashboardStats);
router.get("/regions", protect, regions);
module.exports = router;
