import {
  generateFacultyReport as generateFacultyReportService,
  generateStudentReport as generateStudentReportService,
  generatePlacementReport as generatePlacementReportService,
  generateResearchReport as generateResearchReportService,
  generateCustomReport as generateCustomReportService
} from "./reports-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

export const generateFacultyReport = asyncHandler(async (req, res) => {
  const result = await generateFacultyReportService(req.params.id);
  if (!result) {
    return res.status(404).json({ success: false, message: "Faculty not found" });
  }
  res.status(200).json({ success: true, data: result });
});

export const generateStudentReport = asyncHandler(async (req, res) => {
  const result = await generateStudentReportService(req.params.id);
  if (!result) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }
  res.status(200).json({ success: true, data: result });
});

export const generatePlacementReport = asyncHandler(async (req, res) => {
  const result = await generatePlacementReportService();
  res.status(200).json({ success: true, data: result });
});

export const generateResearchReport = asyncHandler(async (req, res) => {
  const result = await generateResearchReportService();
  res.status(200).json({ success: true, data: result });
});

export const generateCustomReport = asyncHandler(async (req, res) => {
  const result = await generateCustomReportService(req.body);
  res.status(200).json({ success: true, data: result });
});

export default {};
