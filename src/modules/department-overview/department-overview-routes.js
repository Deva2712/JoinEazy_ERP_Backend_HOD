import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  getOverview,
  getCohortDistribution,
  getFacultyAttendance,
  getPlacements,
  getResearch
} from "./department-overview-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("hod", "admin"));

router.get("/", getOverview);
router.get("/cohort-distribution", getCohortDistribution);
router.get("/faculty-attendance", getFacultyAttendance);
router.get("/placements", getPlacements);
router.get("/research", getResearch);

export default router;
