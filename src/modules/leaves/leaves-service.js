let mockLeaveRequests = [
  {
    id: "leave-001",
    category: "Medical Leave",
    title: "Medical Leave Request",
    fromDate: "2026-06-20",
    toDate: "2026-06-25",
    reason: "Hospitalization",
    status: "Pending",
    requestedBy: "Dr. Alan Turing",
    leaveApproval: {
      HoD: { status: "Pending", remark: "" },
      HR: { status: "Pending", remark: "" },
    },
    substitutionDetails: {
      name: "Dr. Jane Smith",
      email: "jane@mahindrauniversity.edu.in",
    },
  },
];

export const getIncomingLeaveRequests = async () => {
  return mockLeaveRequests;
};

export const approveLeaveRequest = async (id, payload) => {
  const request = mockLeaveRequests.find((req) => req.id === id);
  if (!request) return null;

  if (request.leaveApproval && request.leaveApproval.HoD) {
    request.leaveApproval.HoD.status = payload.action;
    request.leaveApproval.HoD.remark = payload.remark || "";
  }
  request.status = payload.action;
  return request;
};

export const getLeaveApplications = async () => {
  return [];
};
