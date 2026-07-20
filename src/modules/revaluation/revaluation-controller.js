import * as service from "./revaluation-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

// Professor / HOD
export const profOverview = asyncHandler(async (req, res) => {
  const data = await service.getProfOverview(req.user.id);
  res.status(200).json({ success: true, data });
});

export const profRequests = asyncHandler(async (req, res) => {
  const data = await service.getProfRequests(req.user.id, req.query.status);
  res.status(200).json({ success: true, data });
});

export const accept = asyncHandler(async (req, res) => {
  const data = await service.acceptRequest(req.params.requestId);
  res.status(200).json({ success: true, data });
});

export const reject = asyncHandler(async (req, res) => {
  const reason = req.body.reason || req.body.remarks || req.body.professorRemarks;
  const data = await service.rejectRequest(req.params.requestId, reason);
  res.status(200).json({ success: true, data });
});

export const result = asyncHandler(async (req, res) => {
  const revisedMarks = req.body.revisedMarks !== undefined ? req.body.revisedMarks : req.body.revised_marks;
  const revisedGrade = req.body.revisedGrade !== undefined ? req.body.revisedGrade : req.body.revised_grade;
  const remarks = req.body.remarks || req.body.professorRemarks;
  const data = await service.updateResult(req.params.requestId, revisedMarks, revisedGrade, remarks);
  res.status(200).json({ success: true, data });
});

// Student
export const studentOverview = asyncHandler(async (req, res) => {
  const data = await service.getStudentOverview(req.user.id);
  res.status(200).json({ success: true, data });
});

export const studentRequests = asyncHandler(async (req, res) => {
  const data = await service.getStudentRequests(req.user.id);
  res.status(200).json({ success: true, data });
});

export const subjects = asyncHandler(async (req, res) => {
  const data = await service.getSubjects();
  res.status(200).json({ success: true, data });
});

export const createRequest = asyncHandler(async (req, res) => {
  const data = await service.createStudentRequest(req.user.id, req.body);
  res.status(201).json({ success: true, data });
});

export const cancelRequest = asyncHandler(async (req, res) => {
  const data = await service.cancelStudentRequest(req.params.requestId, req.user.id);
  res.status(200).json({ success: true, data });
});

export const deleteRequest = asyncHandler(async (req, res) => {
  const data = await service.deleteRequest(req.params.requestId);
  res.status(200).json({ success: true, data });
});

