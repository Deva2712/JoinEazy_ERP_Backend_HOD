import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  getPerformanceTrends,
  getComparison,
  getPredictions
} from "./analytics-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("hod", "admin"));

router.get("/performance-trends", getPerformanceTrends);
router.get("/comparison", getComparison);
router.get("/predictions", getPredictions);

export default router;
