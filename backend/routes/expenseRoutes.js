const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  createExpenseValidator,
  updateExpenseValidator,
} = require("../validators/expenseValidator");

const {
  addExpense,
  getExpenses,
  getExpense,
  editExpense,
  removeExpense,
} = require("../controllers/expenseController");

router
  .route("/")
  .get(protect, authorize("expenses", "read"), getExpenses)
  .post(
    protect,
    authorize("expenses", "write"),
    createExpenseValidator,
    validate,
    addExpense,
  );

router
  .route("/:id")
  .get(protect, authorize("expenses", "read"), getExpense)
  .put(
    protect,
    authorize("expenses", "write"),
    updateExpenseValidator,
    validate,
    editExpense,
  )
  .delete(protect, authorize("expenses", "write"), removeExpense);

module.exports = router;
