import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  getAllFaculty,
  getFacultyDetails,
  getFacultyWorkload,
  getFacultyPerformance,
} from "./department-faculty-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("hod", "admin"));

router.get("/", getAllFaculty);
router.get("/:id", getFacultyDetails);
router.get("/:id/workload", getFacultyWorkload);
router.get("/:id/performance", getFacultyPerformance);

export default router;
