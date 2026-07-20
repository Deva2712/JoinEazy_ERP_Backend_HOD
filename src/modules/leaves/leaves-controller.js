import { asyncHandler } from "../../middleware/error.middleware.js";
import {
  getIncomingLeaveRequests,
  approveLeaveRequest,
  getLeaveApplications,
  createLeaveRequest,
  getUserLeaveApplications,
  cancelLeaveRequest,
  updateLeaveRequest,
} from "./leaves-service.js";

export const getIncomingRequests = asyncHandler(async (req, res) => {
  const data = await getIncomingLeaveRequests();
  res.status(200).json({ success: true, data });
});

export const updateApprovalStatus = asyncHandler(async (req, res) => {
  const updated = await approveLeaveRequest(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Leave request not found" });
  }
  res.status(200).json({ success: true });
});

export const getApplications = asyncHandler(async (req, res) => {
  const data = await getLeaveApplications();
  res.status(200).json({ success: true, data });
});

export const applyLeave = asyncHandler(async (req, res) => {
  const data = await createLeaveRequest(req.user.id, req.body);
  res.status(201).json({ success: true, data });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const data = await getUserLeaveApplications(req.user.id);
  res.status(200).json({ success: true, data: { applications: data } });
});

export const cancelLeave = asyncHandler(async (req, res) => {
  await cancelLeaveRequest(req.params.id, req.user.id);
  res.status(200).json({ success: true, message: "Leave request cancelled successfully" });
});

export const updateLeave = asyncHandler(async (req, res) => {
  const data = await updateLeaveRequest(req.params.id, req.user.id, req.body);
  res.status(200).json({ success: true, data });
});
