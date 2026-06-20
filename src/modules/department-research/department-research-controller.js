import {
  getAllResearch as getAllResearchService,
  getGrantRequests as getGrantRequestsService,
  getResearchExpenses as getResearchExpensesService,
  getAllocationBreakdown as getAllocationBreakdownService,
  approveGrant as approveGrantService
} from "./department-research-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

export const getAllResearch = asyncHandler(async (req, res) => {
  const result = await getAllResearchService();
  res.status(200).json({ success: true, data: result });
});

export const getGrantRequests = asyncHandler(async (req, res) => {
  const result = await getGrantRequestsService();
  res.status(200).json({ success: true, data: result });
});

export const getResearchExpenses = asyncHandler(async (req, res) => {
  const result = await getResearchExpensesService();
  res.status(200).json({ success: true, data: result });
});

export const getAllocationBreakdown = asyncHandler(async (req, res) => {
  const result = await getAllocationBreakdownService();
  res.status(200).json({ success: true, data: result });
});

export const approveGrant = asyncHandler(async (req, res) => {
  const result = await approveGrantService(req.params.id, req.body.action);
  if (!result) {
    return res.status(404).json({ success: false, message: "Grant not found" });
  }
  res.status(200).json({ success: true, data: result });
});

export const updateGrantStatus = asyncHandler(async (req, res) => {
  const { requestId, status } = req.body;
  let action;
  if (status === "Approved") {
    action = "approve";
  } else if (status === "Rejected") {
    action = "reject";
  }
  const result = await approveGrantService(requestId, action);
  if (!result) {
    return res.status(404).json({ success: false, message: "Grant not found" });
  }
  res.status(200).json({ success: true, data: result });
});

export default {};
