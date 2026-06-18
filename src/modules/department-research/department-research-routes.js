import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  getAllResearch,
  getGrantRequests,
  getResearchExpenses,
  getAllocationBreakdown,
  approveGrant
} from "./department-research-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("hod", "admin"));

router.get("/", getAllResearch);
router.get("/grant-requests", getGrantRequests);
router.get("/expenses", getResearchExpenses);
router.get("/allocation", getAllocationBreakdown);
router.put("/grant-requests/:id", approveGrant);

export default router;
