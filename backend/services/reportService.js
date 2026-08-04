const mongoose = require("mongoose");
const FuelLog = require("../models/FuelLog");
const Expense = require("../models/Expense");
const Maintenance = require("../models/Maintenance");
const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const ApiError = require("../utils/ApiError");
const { VEHICLE_STATUS, TRIP_STATUS } = require("../utils/constants");

const toObjectId = (value) =>
  mongoose.Types.ObjectId.isValid(value)
    ? mongoose.Types.ObjectId(value)
    : null;

const buildVehicleFilter = (filters = {}) => {
  const { region, vehicleType, vehicle } = filters;
  const f = {};
  if (region) f.region = region;
  if (vehicleType) f.vehicleType = vehicleType;
  const vid = toObjectId(vehicle);
  if (vid) f._id = vid;
  return f;
};

const vehicleMatchStage = (filters = {}) => {
  const vid = toObjectId(filters.vehicle);
  return vid ? { vehicle: vid } : {};
};

const sumBy = (arr, key) =>
  arr.reduce((acc, doc) => acc + Number(doc[key] || 0), 0);

const sumMap = (arr) => {
  const map = {};
  arr.forEach((doc) => {
    map[doc._id.toString()] = Number(doc.total || 0);
  });
  return map;
};

const getVehicleOperationalCost = async (vehicleId) => {
  const vid = toObjectId(vehicleId);
  if (!vid) {
    throw new ApiError(400, "Invalid vehicle ID");
  }

  const vehicle = await Vehicle.findById(vid, "vehicleNumber");
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  const match = { vehicle: vid };

  const [fuelAgg, maintAgg] = await Promise.all([
    FuelLog.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: "$cost" } } },
    ]),
    Maintenance.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: "$cost" } } },
    ]),
  ]);

  const fuelCost = Number(fuelAgg[0]?.total || 0);
  const maintenanceCost = Number(maintAgg[0]?.total || 0);

  return {
    vehicle: vehicle._id,
    vehicleNumber: vehicle.vehicleNumber,
    fuelCost,
    maintenanceCost,
    operationalCost: Number((fuelCost + maintenanceCost).toFixed(2)),
  };
};

const fuelEfficiencyReport = async (filters = {}) => {
  const vehicles = await Vehicle.find(
    buildVehicleFilter(filters),
    "vehicleNumber vehicleType region acquisitionCost status",
  );

  const fuelAgg = await FuelLog.aggregate([
    { $match: vehicleMatchStage(filters) },
    {
      $group: {
        _id: "$vehicle",
        totalLiters: { $sum: "$liters" },
        totalFuelCost: { $sum: "$cost" },
      },
    },
  ]);

  const tripAgg = await Trip.aggregate([
    {
      $match: {
        status: TRIP_STATUS.COMPLETED,
        ...vehicleMatchStage(filters),
      },
    },
    {
      $group: {
        _id: "$vehicle",
        totalDistance: { $sum: "$distance" },
      },
    },
  ]);

  const fuelMap = {};
  fuelAgg.forEach((f) => {
    fuelMap[f._id.toString()] = {
      totalLiters: Number(f.totalLiters),
      totalFuelCost: Number(f.totalFuelCost),
    };
  });

  const tripMap = {};
  tripAgg.forEach((t) => {
    tripMap[t._id.toString()] = Number(t.totalDistance);
  });

  let totalDistance = 0;
  let totalLiters = 0;
  let totalFuelCost = 0;

  const rows = vehicles.map((v) => {
    const f = fuelMap[v._id.toString()] || { totalLiters: 0, totalFuelCost: 0 };
    const distance = tripMap[v._id.toString()] || 0;
    totalDistance += distance;
    totalLiters += f.totalLiters;
    totalFuelCost += f.totalFuelCost;
    const fuelEfficiency =
      f.totalLiters > 0 ? Number((distance / f.totalLiters).toFixed(2)) : 0;

    return {
      vehicle: v._id,
      vehicleNumber: v.vehicleNumber,
      vehicleType: v.vehicleType,
      region: v.region,
      status: v.status,
      totalDistance: Number(distance.toFixed(2)),
      totalLiters: Number(f.totalLiters.toFixed(2)),
      totalFuelCost: Number(f.totalFuelCost.toFixed(2)),
      fuelEfficiency,
    };
  });

  return {
    summary: {
      totalVehicles: vehicles.length,
      totalDistance: Number(totalDistance.toFixed(2)),
      totalLiters: Number(totalLiters.toFixed(2)),
      totalFuelCost: Number(totalFuelCost.toFixed(2)),
      avgFuelEfficiency:
        totalLiters > 0 ? Number((totalDistance / totalLiters).toFixed(2)) : 0,
    },
    rows,
  };
};

const fleetUtilizationReport = async (filters = {}) => {
  const vehicles = await Vehicle.find(
    buildVehicleFilter(filters),
    "vehicleNumber vehicleType region status acquisitionCost",
  );

  const totalVehicles = vehicles.length;
  const byStatus = {};

  vehicles.forEach((v) => {
    byStatus[v.status] = (byStatus[v.status] || 0) + 1;
  });

  const activeVehicles = byStatus[VEHICLE_STATUS.ON_TRIP] || 0;
  const utilization =
    totalVehicles === 0
      ? 0
      : Number(((activeVehicles / totalVehicles) * 100).toFixed(2));

  return {
    summary: {
      totalVehicles,
      activeVehicles,
      availableVehicles: byStatus[VEHICLE_STATUS.AVAILABLE] || 0,
      vehiclesInMaintenance: byStatus[VEHICLE_STATUS.IN_SHOP] || 0,
      retiredVehicles: byStatus[VEHICLE_STATUS.RETIRED] || 0,
      fleetUtilization: utilization,
    },
    rows: vehicles.map((v) => ({
      vehicle: v._id,
      vehicleNumber: v.vehicleNumber,
      vehicleType: v.vehicleType,
      region: v.region,
      status: v.status,
    })),
  };
};

const operationalCostReport = async (filters = {}) => {
  const vehicles = await Vehicle.find(
    buildVehicleFilter(filters),
    "vehicleNumber vehicleType region acquisitionCost status",
  );

  const match = vehicleMatchStage(filters);

  const [fuelAgg, maintAgg, expAgg] = await Promise.all([
    FuelLog.aggregate([
      { $match: match },
      { $group: { _id: "$vehicle", total: { $sum: "$cost" } } },
    ]),
    Maintenance.aggregate([
      { $match: match },
      { $group: { _id: "$vehicle", total: { $sum: "$cost" } } },
    ]),
    Expense.aggregate([
      { $match: match },
      { $group: { _id: "$vehicle", total: { $sum: "$amount" } } },
    ]),
  ]);

  const fuelMap = sumMap(fuelAgg);
  const maintMap = sumMap(maintAgg);
  const expMap = sumMap(expAgg);

  let totalFuelCost = 0;
  let totalMaintenanceCost = 0;
  let totalOtherExpense = 0;

  const rows = vehicles.map((v) => {
    const id = v._id.toString();
    const fuelCost = fuelMap[id] || 0;
    const maintenanceCost = maintMap[id] || 0;
    const otherExpense = expMap[id] || 0;
    const operationalCost = Number((fuelCost + maintenanceCost).toFixed(2));

    totalFuelCost += fuelCost;
    totalMaintenanceCost += maintenanceCost;
    totalOtherExpense += otherExpense;

    return {
      vehicle: v._id,
      vehicleNumber: v.vehicleNumber,
      vehicleType: v.vehicleType,
      region: v.region,
      status: v.status,
      acquisitionCost: v.acquisitionCost || 0,
      fuelCost: Number(fuelCost.toFixed(2)),
      maintenanceCost: Number(maintenanceCost.toFixed(2)),
      operationalCost,
      otherExpenseCost: Number(otherExpense.toFixed(2)),
    };
  });

  const totalOperationalCost = Number((totalFuelCost + totalMaintenanceCost).toFixed(2));

  return {
    summary: {
      totalVehicles: vehicles.length,
      totalFuelCost: Number(totalFuelCost.toFixed(2)),
      totalMaintenanceCost: Number(totalMaintenanceCost.toFixed(2)),
      totalOperationalCost,
      totalOtherExpense: Number(totalOtherExpense.toFixed(2)),
      totalExpenses: Number((totalOperationalCost + totalOtherExpense).toFixed(2)),
    },
    rows,
  };
};

const vehicleRoiReport = async (filters = {}) => {
  const costReport = await operationalCostReport(filters);

  const tripAgg = await Trip.aggregate([
    {
      $match: {
        status: TRIP_STATUS.COMPLETED,
        ...vehicleMatchStage(filters),
      },
    },
    {
      $group: {
        _id: "$vehicle",
        estimatedRevenue: {
          $sum: { $multiply: ["$cargoWeight", "$distance"] },
        },
      },
    },
  ]);

  const revenueMap = {};
  tripAgg.forEach((t) => {
    revenueMap[t._id.toString()] = Number(t.estimatedRevenue || 0);
  });

  let totalOperationalCost = 0;
  let totalEstimatedRevenue = 0;
  let totalAcquisitionCost = 0;

  const rows = costReport.rows.map((row) => {
    const revenue = revenueMap[row.vehicle.toString()] || 0;
    const roi =
      row.acquisitionCost > 0 && revenue
        ? Number(((revenue - row.operationalCost) / row.acquisitionCost).toFixed(4))
        : 0;

    totalOperationalCost += row.operationalCost;
    totalEstimatedRevenue += revenue;
    totalAcquisitionCost += row.acquisitionCost;

    return {
      vehicle: row.vehicle,
      vehicleNumber: row.vehicleNumber,
      acquisitionCost: row.acquisitionCost,
      operationalCost: row.operationalCost,
      fuelCost: row.fuelCost,
      maintenanceCost: row.maintenanceCost,
      estimatedRevenue: Number(revenue.toFixed(2)),
      roi,
    };
  });

  return {
    summary: {
      totalVehicles: rows.length,
      totalAcquisitionCost: Number(totalAcquisitionCost.toFixed(2)),
      totalOperationalCost: Number(totalOperationalCost.toFixed(2)),
      totalEstimatedRevenue: Number(totalEstimatedRevenue.toFixed(2)),
      avgRoi:
        totalAcquisitionCost > 0
          ? Number((totalEstimatedRevenue / totalAcquisitionCost).toFixed(4))
          : 0,
    },
    rows,
  };
};

const REPORT_HANDLERS = {
  fuelEfficiency: fuelEfficiencyReport,
  fleetUtilization: fleetUtilizationReport,
  operationalCost: operationalCostReport,
  vehicleRoi: vehicleRoiReport,
};

const buildReport = async (type, filters) => {
  const handler = REPORT_HANDLERS[type];
  if (!handler) {
    throw new ApiError(
      400,
      `Invalid report type. Valid: ${Object.keys(REPORT_HANDLERS).join(", ")}`,
    );
  }
  return handler(filters);
};

const toCSV = (rows = []) => {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    const str = String(value == null ? "" : value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  });
  return lines.join("\n");
};

module.exports = {
  getVehicleOperationalCost,
  fuelEfficiencyReport,
  fleetUtilizationReport,
  operationalCostReport,
  vehicleRoiReport,
  buildReport,
  toCSV,
};
