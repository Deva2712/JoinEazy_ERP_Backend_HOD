import {
  getAllStudents as getAllStudentsService,
  getStudentsByBatch as getStudentsByBatchService,
  getStudentDetails as getStudentDetailsService,
  getStudentPerformance as getStudentPerformanceService
} from "./department-students-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

export const getAllStudents = asyncHandler(async (req, res) => {
  const result = await getAllStudentsService();
  res.status(200).json({ success: true, data: result });
});

export const getStudentsByBatch = asyncHandler(async (req, res) => {
  const result = await getStudentsByBatchService(req.params.year);
  if (!result) {
    return res.status(404).json({ success: false, message: "No students found for this batch" });
  }
  res.status(200).json({ success: true, data: result });
});

export const getStudentDetails = asyncHandler(async (req, res) => {
  const result = await getStudentDetailsService(req.params.id);
  if (!result) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }
  res.status(200).json({ success: true, data: result });
});

export const getStudentPerformance = asyncHandler(async (req, res) => {
  const result = await getStudentPerformanceService(req.params.id);
  if (!result) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }
  res.status(200).json({ success: true, data: result });
});

export default {};
