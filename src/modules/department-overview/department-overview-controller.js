import {
  getOverview as getOverviewService,
  getCohortDistribution as getCohortDistributionService,
  getFacultyAttendance as getFacultyAttendanceService,
  getPlacements as getPlacementsService,
  getResearch as getResearchService
} from "./department-overview-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

export const getOverview = asyncHandler(async (req, res) => {
  const overview = await getOverviewService();
  res.status(200).json({ success: true, data: overview });
});

export const getCohortDistribution = asyncHandler(async (req, res) => {
  const cohortDistribution = await getCohortDistributionService();
  res.status(200).json({ success: true, data: cohortDistribution });
});

export const getFacultyAttendance = asyncHandler(async (req, res) => {
  const facultyAttendance = await getFacultyAttendanceService();
  res.status(200).json({ success: true, data: facultyAttendance });
});

export const getPlacements = asyncHandler(async (req, res) => {
  const placements = await getPlacementsService();
  res.status(200).json({ success: true, data: placements });
});

export const getResearch = asyncHandler(async (req, res) => {
  const research = await getResearchService();
  res.status(200).json({ success: true, data: research });
});

export default {};
