import {
  getPendingApprovals as getPendingApprovalsService,
  getLeaveApprovals as getLeaveApprovalsService,
  getFinanceApprovals as getFinanceApprovalsService,
  getResearchApprovals as getResearchApprovalsService,
  processApproval as processApprovalService
} from "./approvals-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

export const getPendingApprovals = asyncHandler(async (req, res) => {
  const result = await getPendingApprovalsService();
  res.status(200).json({ success: true, data: result });
});

export const getLeaveApprovals = asyncHandler(async (req, res) => {
  const result = await getLeaveApprovalsService();
  res.status(200).json({ success: true, data: result });
});

export const getFinanceApprovals = asyncHandler(async (req, res) => {
  const result = await getFinanceApprovalsService();
  res.status(200).json({ success: true, data: result });
});

export const getResearchApprovals = asyncHandler(async (req, res) => {
  const result = await getResearchApprovalsService();
  res.status(200).json({
    success: true,
    message: result.message,
    data: result.data
  });
});

export const processApproval = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const { action, reason } = req.body;

  if (!action || !["approve", "reject"].includes(action)) {
    return res.status(400).json({
      success: false,
      message: "Action is required and must be either 'approve' or 'reject'"
    });
  }

  try {
    const result = await processApprovalService(type, id, { action, reason });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} approval request not found`
      });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default {};
