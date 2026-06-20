// Realistic Mock Data for Approvals

const leaveApprovals = [
  {
    id: "leave-001",
    type: "leave",
    status: "Pending",
    requested_by: "Dr. Alan Turing",
    leave_type: "Medical Leave",
    start_date: "2026-06-20",
    end_date: "2026-06-25",
    replacement: "Dr. Jane Smith",
    requested_at: "2026-06-19T10:00:00.000Z",
    updated_at: "2026-06-19T10:00:00.000Z",
    reason: ""
  },
  {
    id: "leave-002",
    type: "leave",
    status: "Pending",
    requested_by: "Dr. Jane Smith",
    leave_type: "Personal Leave",
    start_date: "2026-06-22",
    end_date: "2026-06-23",
    replacement: "Dr. Alan Turing",
    requested_at: "2026-06-19T11:00:00.000Z",
    updated_at: "2026-06-19T11:00:00.000Z",
    reason: ""
  },
  {
    id: "leave-003",
    type: "leave",
    status: "Approved",
    requested_by: "Dr. Priya Sharma",
    leave_type: "Conference Leave",
    start_date: "2026-05-10",
    end_date: "2026-05-15",
    replacement: null,
    requested_at: "2026-05-09T09:00:00.000Z",
    updated_at: "2026-05-09T09:00:00.000Z",
    reason: ""
  }
];

const financeApprovals = [
  {
    id: "finance-001",
    type: "finance",
    status: "Pending",
    requested_by: "Dr. Alan Turing",
    title: "Lab Equipment Purchase",
    amount: 45000,
    category: "Equipment",
    requested_at: "2026-06-19T08:00:00.000Z",
    updated_at: "2026-06-19T08:00:00.000Z",
    reason: ""
  },
  {
    id: "finance-002",
    type: "finance",
    status: "Pending",
    requested_by: "Dr. Jane Smith",
    title: "Conference Registration Fee",
    amount: 8500,
    category: "Travel",
    requested_at: "2026-06-19T09:30:00.000Z",
    updated_at: "2026-06-19T09:30:00.000Z",
    reason: ""
  },
  {
    id: "finance-003",
    type: "finance",
    status: "Approved",
    requested_by: "Dr. Priya Sharma",
    title: "Research Software License",
    amount: 12000,
    category: "Software",
    requested_at: "2026-05-08T14:00:00.000Z",
    updated_at: "2026-05-08T14:00:00.000Z",
    reason: ""
  }
];

const courseApprovals = [
  {
    id: "course-001",
    type: "course",
    status: "Pending",
    requested_by: "Dr. Alan Turing",
    title: "CS301 Syllabus Update",
    change_type: "Syllabus",
    requested_at: "2026-06-18T10:00:00.000Z",
    updated_at: "2026-06-18T10:00:00.000Z",
    reason: ""
  },
  {
    id: "course-002",
    type: "course",
    status: "Approved",
    requested_by: "Dr. Jane Smith",
    title: "CS201 Credit Change (3→4 credits)",
    change_type: "Credits",
    requested_at: "2026-05-15T09:00:00.000Z",
    updated_at: "2026-05-15T09:00:00.000Z",
    reason: ""
  }
];

/**
 * Returns all pending approvals (leave + finance + course combined)
 */
export const getPendingApprovals = async () => {
  const pendingLeave = leaveApprovals.filter(item => item.status === "Pending");
  const pendingFinance = financeApprovals.filter(item => item.status === "Pending");
  const pendingCourse = courseApprovals.filter(item => item.status === "Pending");
  
  const total_pending = pendingLeave.length + pendingFinance.length + pendingCourse.length;
  
  return {
    leave: pendingLeave,
    finance: pendingFinance,
    course: pendingCourse,
    total_pending
  };
};

/**
 * Returns array of leave requests with status Pending/Approved/Rejected
 */
export const getLeaveApprovals = async () => {
  return leaveApprovals;
};

/**
 * Returns array of finance requests
 */
export const getFinanceApprovals = async () => {
  return financeApprovals;
};

/**
 * Returns a redirection note for research grant approvals
 */
export const getResearchApprovals = async () => {
  return {
    message: "Research grant approvals are managed via /api/v1/department/research/grant-requests",
    data: []
  };
};

/**
 * Process approval: updates status, reason, and updated_at in memory.
 * Returns updated item, or null if not found. Throws error if type is invalid.
 */
export const processApproval = async (type, id, decision) => {
  const validTypes = ["leave", "finance", "course"];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid approval type: ${type}`);
  }

  let item;
  if (type === "leave") {
    item = leaveApprovals.find(l => l.id === id);
  } else if (type === "finance") {
    item = financeApprovals.find(f => f.id === id);
  } else if (type === "course") {
    item = courseApprovals.find(c => c.id === id);
  }

  if (!item) {
    return null;
  }

  const { action, reason } = decision;
  if (action === "approve") {
    item.status = "Approved";
  } else if (action === "reject") {
    item.status = "Rejected";
  }

  item.reason = reason || "";
  item.updated_at = new Date().toISOString();

  return item;
};
