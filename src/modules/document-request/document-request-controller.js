import * as svc from "./document-request-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

// stdFac controllers compatibility
export const getOverview = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await svc.getOverview(req.user.id) });
});

export const getRequests = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await svc.getRequests(req.user.id) });
});

export const createRequest = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await svc.createRequest(req.user.id, req.body) });
});

export const cancelRequest = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await svc.cancelRequest(req.params.requestId, req.user.id) });
});

export const getLorRequests = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await svc.getLorRequests(req.user.id) });
});

export const createLorRequest = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await svc.createLorRequest(req.user.id, req.body) });
});

export const cancelLorRequest = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await svc.cancelLorRequest(req.params.requestId, req.user.id) });
});

export const scheduleLorMeeting = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await svc.scheduleLorMeeting(req.params.requestId, req.user.id, req.body.meetingTime) });
});

// Frontend document-requests controllers
export const getAllDocuments = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await svc.getAllDocuments(req.user.id) });
});

export const respondToStudentRequest = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await svc.respondToStudentRequest(req.params.requestId, req.body.status, req.body.reason) });
});

export const submitToRegistrar = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await svc.submitToRegistrar(req.body) });
});

export const registrarUploadApproved = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await svc.registrarUploadApproved(req.params.lorId, req.body.approvedDocument) });
});

export const dispatchToStudent = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await svc.dispatchToStudent(req.params.lorId) });
});
