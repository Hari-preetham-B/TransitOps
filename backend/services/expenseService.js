const Expense = require("../models/Expense");
const Vehicle = require("../models/Vehicle");
const ApiError = require("../utils/ApiError");

const createExpense = async (data) => {
  const vehicle = await Vehicle.findById(data.vehicle);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  const expense = await Expense.create(data);

  return await expense
    .populate("vehicle", "vehicleNumber vehicleType status region")
    .exec();
};

const getAllExpenses = async ({
  page = 1,
  limit = 10,
  search = "",
  vehicle,
  expenseType,
  sortBy = "createdAt",
  order = "desc",
}) => {
  const query = {};

  if (vehicle) {
    query.vehicle = vehicle;
  }

  if (expenseType) {
    query.type = expenseType;
  }

  if (search) {
    query.$or = [
      { type: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sort = {
    [sortBy]: order === "asc" ? 1 : -1,
  };

  const expenses = await Expense.find(query)
    .populate("vehicle", "vehicleNumber vehicleType status region")
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Expense.countDocuments(query);

  return {
    expenses,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

const getExpenseById = async (id) => {
  const expense = await Expense.findById(id).populate(
    "vehicle",
    "vehicleNumber vehicleType status region",
  );

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return expense;
};

const updateExpense = async (id, updateData) => {
  const expense = await Expense.findById(id);

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return await Expense.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("vehicle", "vehicleNumber vehicleType status region")
    .exec();
};

const deleteExpense = async (id) => {
  const expense = await Expense.findById(id);

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  await Expense.findByIdAndDelete(id);

  return {
    message: "Expense deleted successfully",
  };
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
