import Approval from "./approvals-model.js";

/**
 * Returns all pending approvals (leave + finance + course combined)
 */
export const getPendingApprovals = async () => {
  const leave = await Approval.findAll({ where: { type: "leave", status: "Pending" } });
  const finance = await Approval.findAll({ where: { type: "finance", status: "Pending" } });
  const course = await Approval.findAll({ where: { type: "course", status: "Pending" } });
  
  const total_pending = leave.length + finance.length + course.length;
  
  return {
    leave,
    finance,
    course,
    total_pending
  };
};

/**
 * Returns array of leave requests with status Pending/Approved/Rejected
 */
export const getLeaveApprovals = async () => {
  return await Approval.findAll({ where: { type: "leave" } });
};

/**
 * Returns array of finance requests
 */
export const getFinanceApprovals = async () => {
  return await Approval.findAll({ where: { type: "finance" } });
};

/**
 * Returns a redirection note for research grant approvals
 */
export const getResearchApprovals = async () => {
  return {
    message: "Research grant approvals are managed via /api/v1/department/research/grant-requests",
    data: [
      {
        id: "res-apr-001",
        type: "research",
        status: "Pending",
        requested_by: "Dr. Alan Turing",
        title: "DST Grant - AI Climate Research",
        amount: 50000,
        category: "Research Grant",
        requested_at: "2026-06-15"
      },
      {
        id: "res-apr-002",
        type: "research",
        status: "Pending",
        requested_by: "Dr. Jane Smith",
        title: "International Travel Grant - HRI 2026",
        amount: 2200,
        category: "Travel Grant",
        requested_at: "2026-06-18"
      }
    ]
  };
};

/**
 * Process approval: updates status, reason, and updated_at in database.
 * Returns updated item, or null if not found. Throws error if type is invalid.
 */
export const processApproval = async (type, id, decision) => {
  const validTypes = ["leave", "finance", "course"];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid approval type: ${type}`);
  }

  const approval = await Approval.findOne({ where: { id, type } });
  if (!approval) {
    return null;
  }

  const { action, reason } = decision;
  if (action === "approve") {
    approval.status = "Approved";
  } else if (action === "reject") {
    approval.status = "Rejected";
  }

  approval.reason = reason || "";
  await approval.save();

  return approval;
};
