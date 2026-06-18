import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  generateFacultyReport,
  generateStudentReport,
  generatePlacementReport,
  generateResearchReport,
  generateCustomReport
} from "./reports-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("hod", "admin"));

router.post("/faculty/:id", generateFacultyReport);
router.post("/student/:id", generateStudentReport);
router.post("/placement", generatePlacementReport);
router.post("/research", generateResearchReport);
router.post("/custom", generateCustomReport);

export default router;
