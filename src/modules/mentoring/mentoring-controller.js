import * as svc from "./mentoring-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

// stdFac controller handlers
export const dashboard = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, ...(await svc.getDashboard(req.user.id)) });
});

export const meetingRequest = asyncHandler(async (req, res) => {
  const { mentee_id, ...data } = req.body;
  res.status(201).json({ success: true, ...(await svc.requestMeeting(req.user.id, mentee_id, data)) });
});

export const feedback = asyncHandler(async (req, res) => {
  const { mentee_id, ...data } = req.body;
  res.status(201).json({ success: true, ...(await svc.submitFeedback(req.user.id, mentee_id, data)) });
});

// Frontend mentoring controllers
export const getMentees = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: await svc.getAssignedMentees(req.user.id) });
});

export const updateAttendance = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: await svc.updateMeetingAttendance(req.params.id, req.body.hasAttended) });
});

export const saveNotes = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: await svc.submitMeetingNotes(req.params.id, req.body) });
});
