import { asyncHandler } from "../../middleware/error.middleware.js";
import {
  getIncomingLeaveRequests,
  approveLeaveRequest,
  getLeaveApplications,
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
