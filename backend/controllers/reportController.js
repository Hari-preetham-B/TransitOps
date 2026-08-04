const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const {
  buildReport,
  toCSV,
  getVehicleOperationalCost,
} = require("../services/reportService");

const VALID_REPORT_TYPES = [
  "fuelEfficiency",
  "fleetUtilization",
  "operationalCost",
  "vehicleRoi",
];

const getReport = asyncHandler(async (req, res) => {
  const { type, export: exportFlag } = req.query;

  if (!VALID_REPORT_TYPES.includes(type)) {
    throw new ApiError(
      400,
      `Invalid report type. Valid: ${VALID_REPORT_TYPES.join(", ")}`,
    );
  }

  const result = await buildReport(type, req.query);

  if (String(exportFlag).toLowerCase() === "csv") {
    const csv = toCSV(result.rows || []);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${type}-report.csv`,
    );
    return res.status(200).send(csv);
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});

const getVehicleCost = asyncHandler(async (req, res) => {
  const cost = await getVehicleOperationalCost(req.params.id);

  res.status(200).json({
    success: true,
    data: cost,
  });
});

module.exports = {
  getReport,
  getVehicleCost,
  VALID_REPORT_TYPES,
};
