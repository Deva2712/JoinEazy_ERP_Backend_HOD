import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import * as ctrl from "./mentoring-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("professor", "admin", "hod"));

// stdFac compatibility routes
router.get("/dashboard",       ctrl.dashboard);
router.post("/meetings/request", ctrl.meetingRequest);
router.post("/feedback",        ctrl.feedback);

// Frontend mentoring endpoints
router.get("/mentor/students", ctrl.getMentees);
router.post("/meetings/attendance/:id", ctrl.updateAttendance);
router.post("/meetings/complete/:id", ctrl.saveNotes);

export default router;
