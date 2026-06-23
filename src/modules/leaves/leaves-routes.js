import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  getIncomingRequests,
  updateApprovalStatus,
  getApplications,
} from "./leaves-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("hod", "admin"));

router.get("/incoming-requests", getIncomingRequests);
router.post("/approve/:id", updateApprovalStatus);
router.get("/applications", getApplications);

export default router;
