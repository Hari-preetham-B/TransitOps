const asyncHandler = require("../middleware/asyncHandler");
const { getDashboardStats } = require("../services/dashboardService");

const dashboardStats = asyncHandler(async (req, res) => {
  const filters = {
    region: req.query.region,
    vehicleType: req.query.vehicleType,
  };

  const stats = await getDashboardStats(filters);

  res.status(200).json({
    success: true,
    message: "Dashboard statistics fetched successfully",
    data: stats,
  });
});

module.exports = {
  dashboardStats,
};
