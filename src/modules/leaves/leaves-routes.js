import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  getIncomingRequests,
  updateApprovalStatus,
  getApplications,
  applyLeave,
  getMyApplications,
  cancelLeave,
  updateLeave,
} from "./leaves-controller.js";

const router = express.Router();

router.use(protect);

// Faculty apply endpoints (accessible by professor, hod, admin)
router.post("/apply", authorize("professor", "hod", "admin"), applyLeave);
router.get("/applications", authorize("professor", "hod", "admin"), getMyApplications);
router.get("/my-applications", authorize("professor", "hod", "admin"), getMyApplications);
router.delete("/my-applications/:id", authorize("professor", "hod", "admin"), cancelLeave);
router.patch("/my-applications/:id", authorize("professor", "hod", "admin"), updateLeave);

// HOD approval endpoints (accessible only by hod, admin)
router.get("/incoming-requests", authorize("hod", "admin"), getIncomingRequests);
router.post("/approve/:id", authorize("hod", "admin"), updateApprovalStatus);

export default router;
