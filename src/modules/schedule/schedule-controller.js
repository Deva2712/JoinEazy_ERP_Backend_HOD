import { asyncHandler } from "../../middleware/error.middleware.js";
import { 
  getProfessorSchedule, 
  upsertSchedule, 
  getMeetingRequests, 
  updateMeetingStatus,
  addManualEvent,
  createDirectMeeting,
  createOutgoingRequest
} from "./schedule-service.js";

export const getSchedule = asyncHandler(async (req, res) => {
  const data = await getProfessorSchedule(req.user.id);
  res.json({ success: true, data });
});

export const addSchedule = asyncHandler(async (req, res) => {
  const data = await upsertSchedule(req.user.id, req.body);
  res.json({ success: true, data });
});

export const getMeetings = asyncHandler(async (req, res) => {
  const data = await getMeetingRequests(req.user.id);
  res.json({ success: true, data });
});

export const acceptMeeting = asyncHandler(async (req, res) => {
  const data = await updateMeetingStatus(req.params.requestId, "accepted");
  res.json({ success: true, data });
});

export const rejectMeeting = asyncHandler(async (req, res) => {
  const data = await updateMeetingStatus(req.params.requestId, "rejected");
  res.json({ success: true, data });
});

export const rescheduleMeeting = asyncHandler(async (req, res) => {
  const data = await updateMeetingStatus(req.params.requestId, "rescheduled", req.body.newDateTime);
  res.json({ success: true, data });
});

export const addManualEventHandler = asyncHandler(async (req, res) => {
  const result = await addManualEvent(req.user.id, req.body);
  res.status(201).json({ success: true, data: result });
});

export const createDirectMeetingHandler = asyncHandler(async (req, res) => {
  const result = await createDirectMeeting(req.user.id, req.body);
  res.status(201).json({ success: true, data: result });
});

export const createOutgoingRequestHandler = asyncHandler(async (req, res) => {
  const result = await createOutgoingRequest(req.user.id, req.body);
  res.status(201).json({ success: true, data: result });
});
