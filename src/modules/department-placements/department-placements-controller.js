import {
  getAllPlacements as getAllPlacementsService,
  getBatchStats as getBatchStatsService,
  getCompanyList as getCompanyListService,
  getCompanyDetails as getCompanyDetailsService,
  createJobOpening as createJobOpeningService
} from "./department-placements-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

export const getAllPlacements = asyncHandler(async (req, res) => {
  const result = await getAllPlacementsService();
  res.status(200).json({ success: true, data: result });
});

export const getBatchStats = asyncHandler(async (req, res) => {
  const result = await getBatchStatsService();
  res.status(200).json({ success: true, data: result });
});

export const getCompanyList = asyncHandler(async (req, res) => {
  const result = await getCompanyListService();
  res.status(200).json({ success: true, data: result });
});

export const getCompanyDetails = asyncHandler(async (req, res) => {
  const result = await getCompanyDetailsService(req.params.id);
  if (!result) {
    return res.status(404).json({ success: false, message: "Company not found" });
  }
  res.status(200).json({ success: true, data: result });
});

export const createJobOpening = asyncHandler(async (req, res) => {
  const result = await createJobOpeningService(req.body);
  res.status(200).json({ success: true, data: result });
});

export default {};
