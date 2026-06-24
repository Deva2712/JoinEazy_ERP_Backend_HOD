import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  getAllPlacements,
  getBatchStats,
  getCompanyList,
  getCompanies,
  getCompanyDetails,
  createJobOpening
} from "./department-placements-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("hod", "admin"));

router.get("/", getAllPlacements);
router.get("/batch-stats", getBatchStats);
router.get("/companies", getCompanies);
router.post("/job-openings", createJobOpening);
router.get("/companies/:id", getCompanyDetails);

export default router;
