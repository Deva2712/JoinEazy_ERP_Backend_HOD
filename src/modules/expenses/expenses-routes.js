import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import * as ctrl from "./expenses-controller.js";

const router = express.Router();
router.use(protect);
router.use(authorize("professor", "admin", "hod"));

router.get("/list",              ctrl.getExpenses);
router.post("/create",           ctrl.createExpense);
router.patch("/:expenseId/update", ctrl.updateExpense);
router.delete("/:expenseId",     ctrl.deleteExpense);

export default router;
