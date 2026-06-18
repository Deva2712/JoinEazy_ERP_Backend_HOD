import {
  getAllFaculty as getAllFacultyService,
  getFacultyDetails as getFacultyDetailsService,
  getFacultyWorkload as getFacultyWorkloadService,
  getFacultyPerformance as getFacultyPerformanceService,
} from "./department-faculty-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

export const getAllFaculty = asyncHandler(async (req, res) => {
  const faculty = await getAllFacultyService();
  res.status(200).json({ success: true, data: faculty });
});

export const getFacultyDetails = asyncHandler(async (req, res) => {
  const details = await getFacultyDetailsService(req.params.id);
  if (!details) {
    return res.status(404).json({ success: false, message: "Faculty not found" });
  }
  res.status(200).json({ success: true, data: details });
});

export const getFacultyWorkload = asyncHandler(async (req, res) => {
  const workload = await getFacultyWorkloadService(req.params.id);
  if (!workload) {
    return res.status(404).json({ success: false, message: "Faculty not found" });
  }
  res.status(200).json({ success: true, data: workload });
});

export const getFacultyPerformance = asyncHandler(async (req, res) => {
  const performance = await getFacultyPerformanceService(req.params.id);
  if (!performance) {
    return res.status(404).json({ success: false, message: "Faculty not found" });
  }
  res.status(200).json({ success: true, data: performance });
});

export default {};


// feedback will be sourced from a student feedback module in a later phase