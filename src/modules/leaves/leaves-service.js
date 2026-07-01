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
  return [
    {
      id: "leave-hod-001",
      type: "leave",
      leave_type: "Conference Leave",
      status: "Approved",
      start_date: "2026-07-10",
      end_date: "2026-07-12",
      reason: "Attending IEEE Conference on AI",
      requested_at: "2026-06-20"
    },
    {
      id: "leave-hod-002",
      type: "leave",
      leave_type: "Medical Leave",
      status: "Pending",
      start_date: "2026-06-30",
      end_date: "2026-06-30",
      reason: "Medical appointment",
      requested_at: "2026-06-23"
    }
  ];
};
