import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import { payrollHistory, payrollBreakdown, downloadSlip } from "./payroll-controller.js";

const router = express.Router();
router.use(protect);
router.use(authorize("professor", "admin", "hod"));

router.get("/history", payrollHistory);
router.get("/breakdown", payrollBreakdown);
router.get("/download/:id", downloadSlip);

export default router;
