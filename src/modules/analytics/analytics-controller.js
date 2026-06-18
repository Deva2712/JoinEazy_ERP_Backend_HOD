import {
  getPerformanceTrends as getPerformanceTrendsService,
  getComparison as getComparisonService,
  getPredictions as getPredictionsService
} from "./analytics-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

export const getPerformanceTrends = asyncHandler(async (req, res) => {
  const data = await getPerformanceTrendsService();
  res.status(200).json({ success: true, data });
});

export const getComparison = asyncHandler(async (req, res) => {
  const data = await getComparisonService();
  res.status(200).json({ success: true, data });
});

export const getPredictions = asyncHandler(async (req, res) => {
  const data = await getPredictionsService();
  res.status(200).json({ success: true, data });
});

export default {};
