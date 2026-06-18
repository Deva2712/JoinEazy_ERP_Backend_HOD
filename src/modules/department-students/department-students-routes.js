import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  getAllStudents,
  getStudentsByBatch,
  getStudentDetails,
  getStudentPerformance
} from "./department-students-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("hod", "admin"));

router.get("/", getAllStudents);
router.get("/batch/:year", getStudentsByBatch);
router.get("/:id", getStudentDetails);
router.get("/:id/performance", getStudentPerformance);

export default router;
