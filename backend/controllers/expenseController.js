const asyncHandler = require("../middleware/asyncHandler");
const {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../services/expenseService");

const addExpense = asyncHandler(async (req, res) => {
  const expense = await createExpense(req.body);

  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    data: expense,
  });
});

const getExpenses = asyncHandler(async (req, res) => {
  const result = await getAllExpenses(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

const getExpense = asyncHandler(async (req, res) => {
  const expense = await getExpenseById(req.params.id);

  res.status(200).json({
    success: true,
    data: expense,
  });
});

const editExpense = asyncHandler(async (req, res) => {
  const expense = await updateExpense(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    data: expense,
  });
});

const removeExpense = asyncHandler(async (req, res) => {
  const result = await deleteExpense(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

module.exports = {
  addExpense,
  getExpenses,
  getExpense,
  editExpense,
  removeExpense,
};
