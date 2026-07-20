import LeaveApplication from "./leaves-model.js";

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

export const createLeaveRequest = async (userId, data) => {
  const leave = await LeaveApplication.create({
    user_id: userId,
    leave_type: data.leave_type || data.leaveType,
    from_date: data.from_date || data.fromDate,
    to_date: data.to_date || data.toDate,
    reason: data.reason,
    replacement_faculty: data.replacement_faculty || data.replacementFaculty || null,
    status: "pending",
  });
  return leave;
};

export const getUserLeaveApplications = async (userId) => {
  const applications = await LeaveApplication.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
  });
  return applications.map((app) => ({
    id: app.id,
    leaveType: app.leave_type,
    fromDate: app.from_date,
    toDate: app.to_date,
    reason: app.reason,
    replacementFaculty: app.replacement_faculty,
    status: app.status,
    appliedAt: app.createdAt,
  }));
};

export const cancelLeaveRequest = async (id, userId) => {
  const leave = await LeaveApplication.findOne({ where: { id, user_id: userId } });
  if (!leave) {
    const err = new Error("Leave request not found");
    err.statusCode = 404;
    throw err;
  }
  await leave.destroy();
  return true;
};

export const updateLeaveRequest = async (id, userId, data) => {
  const leave = await LeaveApplication.findOne({ where: { id, user_id: userId } });
  if (!leave) {
    const err = new Error("Leave request not found");
    err.statusCode = 404;
    throw err;
  }
  if (leave.status !== "pending") {
    const err = new Error("Only pending leave requests can be updated");
    err.statusCode = 400;
    throw err;
  }
  await leave.update({
    leave_type: data.leave_type,
    from_date: data.from_date,
    to_date: data.to_date,
    reason: data.reason,
    replacement_faculty: data.replacement_faculty,
  });
  return leave;
};
