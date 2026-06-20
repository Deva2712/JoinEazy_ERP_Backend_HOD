import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  getPendingApprovals,
  getLeaveApprovals,
  getFinanceApprovals,
  getResearchApprovals,
  processApproval
} from "./approvals-controller.js";

const router = express.Router();

// Ensure all approval routes are protected and restricted to HOD or Admin
router.use(protect);
router.use(authorize("hod", "admin"));

// Specific routes
router.get("/", getPendingApprovals);
router.get("/leave", getLeaveApprovals);
router.get("/finance", getFinanceApprovals);
router.get("/research", getResearchApprovals);

// Parameterised routes (must be defined AFTER specific routes)
router.put("/:type/:id", processApproval);

export default router;
