// NOTE: In-memory mock mutation is acceptable; this resets on server restart and will be replaced by DB update queries later.

const hodNotifications = [
  {
    id: "notif-001",
    category: "EXAM_DUTY",
    title: "New Exam Duty",
    message: "You have been assigned as an invigilator for Introduction to Computer Science.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-17T13:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-002",
    category: "EXAM_DUTY",
    title: "New Exam Duty",
    message: "You have been assigned as an invigilator for Data Structures & Algorithms.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-17T13:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-003",
    category: "EXAM_DUTY",
    title: "New Exam Duty",
    message: "You have been assigned as an invigilator for Operating Systems.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-17T13:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-004",
    category: "EXAM_DUTY",
    title: "New Exam Duty",
    message: "You have been assigned as an invigilator for Database Management Systems.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-17T13:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-005",
    category: "EXAM_DUTY",
    title: "New Exam Duty",
    message: "You have been assigned as an invigilator for Artificial Intelligence.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-17T13:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-006",
    category: "MAINTENANCE",
    title: "Maintenance Resolved",
    message: "The Plumbing issue at Hostel Block C, Room 204 is now marked as resolved.",
    priority: "LOW",
    is_read: false,
    created_at: "2026-06-17T12:45:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-007",
    category: "MEETING",
    title: "Meeting Scheduled",
    message: "Department heads meeting scheduled for June 20, 2026 at 10:00 AM.",
    priority: "MEDIUM",
    is_read: false,
    created_at: "2026-06-16T09:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-008",
    category: "MEETING",
    title: "Meeting Rescheduled",
    message: "The faculty review meeting has been moved to June 22, 2026.",
    priority: "MEDIUM",
    is_read: true,
    created_at: "2026-06-15T11:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-009",
    category: "MEETING",
    title: "Meeting Reminder",
    message: "Reminder: Academic council meeting tomorrow at 2:00 PM.",
    priority: "MEDIUM",
    is_read: true,
    created_at: "2026-06-14T08:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-010",
    category: "MEETING",
    title: "Meeting Notes Available",
    message: "Notes from the last curriculum review meeting are now available.",
    priority: "LOW",
    is_read: true,
    created_at: "2026-06-13T16:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-011",
    category: "RESEARCH",
    title: "Research Proposal Submitted",
    message: "Dr. Priya Sharma has submitted a new research proposal: Federated Learning for Healthcare.",
    priority: "MEDIUM",
    is_read: false,
    created_at: "2026-06-17T10:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-012",
    category: "RESEARCH",
    title: "Grant Approved",
    message: "Research grant for AI-Driven Climate Modeling has been approved by DST.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-16T14:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-013",
    category: "RESEARCH",
    title: "Publication Accepted",
    message: "Paper on Blockchain for Medical Data Privacy accepted at IEEE conference.",
    priority: "MEDIUM",
    is_read: false,
    created_at: "2026-06-15T09:30:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-014",
    category: "RESEARCH",
    title: "Research Milestone",
    message: "Project Quantum Computing for Cryptography has reached 50% completion.",
    priority: "LOW",
    is_read: true,
    created_at: "2026-06-14T11:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-015",
    category: "RESEARCH",
    title: "Collaboration Request",
    message: "IIT Bombay has requested a research collaboration on NLP systems.",
    priority: "MEDIUM",
    is_read: true,
    created_at: "2026-06-13T10:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-016",
    category: "RESEARCH",
    title: "Research Budget Update",
    message: "Annual research budget utilization is at 68% for AY 2025-2026.",
    priority: "LOW",
    is_read: true,
    created_at: "2026-06-12T15:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-017",
    category: "RESEARCH",
    title: "New Research Student Enrolled",
    message: "John Doe (stu-001) has been enrolled in the AI-Driven Climate Modeling project.",
    priority: "LOW",
    is_read: true,
    created_at: "2026-06-11T09:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-018",
    category: "RESEARCH",
    title: "External Reviewer Assigned",
    message: "An external reviewer has been assigned to evaluate the Blockchain Medical project.",
    priority: "LOW",
    is_read: true,
    created_at: "2026-06-10T13:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-019",
    category: "RESEARCH",
    title: "Research Presentation Scheduled",
    message: "Mid-term research presentations scheduled for June 25, 2026.",
    priority: "MEDIUM",
    is_read: true,
    created_at: "2026-06-09T10:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-020",
    category: "RESEARCH",
    title: "Funding Deadline Reminder",
    message: "Reminder: SERB funding application deadline is June 30, 2026.",
    priority: "HIGH",
    is_read: true,
    created_at: "2026-06-08T08:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-021",
    category: "RESEARCH",
    title: "Research Lab Booking",
    message: "AI Research Lab has been booked for June 19, 2026 from 10 AM to 4 PM.",
    priority: "LOW",
    is_read: true,
    created_at: "2026-06-07T09:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-022",
    category: "LIBRARY",
    title: "Library Book Request",
    message: "Faculty request for 10 copies of 'Deep Learning' by Goodfellow is pending approval.",
    priority: "LOW",
    is_read: false,
    created_at: "2026-06-17T09:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-023",
    category: "LIBRARY",
    title: "Journal Access Renewed",
    message: "IEEE Xplore journal access has been renewed for AY 2026-2027.",
    priority: "LOW",
    is_read: true,
    created_at: "2026-06-16T10:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-024",
    category: "DOCUMENT_REQUEST",
    title: "Document Request",
    message: "Alice Johnson (stu-002) has requested an official transcript.",
    priority: "MEDIUM",
    is_read: false,
    created_at: "2026-06-17T08:30:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-025",
    category: "DOCUMENT_REQUEST",
    title: "Document Ready",
    message: "Bonafide certificate for Michael Chen (stu-003) is ready for sign-off.",
    priority: "MEDIUM",
    is_read: true,
    created_at: "2026-06-16T11:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-026",
    category: "ASSET_REQUEST",
    title: "Asset Request Pending",
    message: "Request for 2 additional projectors for Lab 3 is awaiting approval.",
    priority: "MEDIUM",
    is_read: false,
    created_at: "2026-06-17T07:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-027",
    category: "FINANCE",
    title: "Budget Approval Required",
    message: "Department travel grant request of INR 45,000 requires HoD approval.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-17T06:00:00.000Z",
    scope: "hod"
  },
  {
    id: "notif-028",
    category: "FINANCE",
    title: "Expense Report Submitted",
    message: "Prof. Ramesh Kumar has submitted the lab equipment expense report for May 2026.",
    priority: "LOW",
    is_read: true,
    created_at: "2026-06-15T14:00:00.000Z",
    scope: "hod"
  }
];

const deptNotifications = [
  {
    id: "dept-notif-001",
    category: "ATTENDANCE",
    title: "Attendance Overdue",
    message: "Attendance not marked for CSE-A (CS101) for the last two classes.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-17T13:30:00.000Z",
    scope: "department",
    course_code: "CS101",
    section: "CSE-A"
  },
  {
    id: "dept-notif-002",
    category: "ATTENDANCE",
    title: "Attendance Overdue",
    message: "Attendance not marked for CSE-B (CS101) for the last two classes.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-17T13:30:00.000Z",
    scope: "department",
    course_code: "CS101",
    section: "CSE-B"
  },
  {
    id: "dept-notif-003",
    category: "ATTENDANCE",
    title: "Attendance Overdue",
    message: "Attendance not marked for CSE-A (CS201) for the last two classes.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-17T13:30:00.000Z",
    scope: "department",
    course_code: "CS201",
    section: "CSE-A"
  },
  {
    id: "dept-notif-004",
    category: "ATTENDANCE",
    title: "Attendance Overdue",
    message: "Attendance not marked for CSE-C (CS201) for the last two classes.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-17T13:30:00.000Z",
    scope: "department",
    course_code: "CS201",
    section: "CSE-C"
  },
  {
    id: "dept-notif-005",
    category: "ATTENDANCE",
    title: "Attendance Overdue",
    message: "Attendance not marked for CSE-A (MA101) for the last two classes.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-17T13:30:00.000Z",
    scope: "department",
    course_code: "MA101",
    section: "CSE-A"
  },
  {
    id: "dept-notif-006",
    category: "ATTENDANCE",
    title: "Attendance Overdue",
    message: "Attendance not marked for ECE-B (MATH101) for the last two classes.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-17T13:30:00.000Z",
    scope: "department",
    course_code: "MATH101",
    section: "ECE-B"
  },
  {
    id: "dept-notif-007",
    category: "LOW_ATTENDANCE",
    title: "Low Attendance Alert",
    message: "Alice Johnson (stu-002) has dropped below 75% attendance in CS201.",
    priority: "HIGH",
    is_read: false,
    created_at: "2026-06-16T10:00:00.000Z",
    scope: "department",
    course_code: "CS201",
    section: "CSE-A",
    student_id: "stu-002"
  },
  {
    id: "dept-notif-008",
    category: "BACKLOG_ALERT",
    title: "Backlog Alert",
    message: "Alice Johnson (stu-002) has 2 active backlogs. Mentoring session recommended.",
    priority: "MEDIUM",
    is_read: true,
    created_at: "2026-06-15T09:00:00.000Z",
    scope: "department",
    student_id: "stu-002"
  }
];

const getNotificationsList = (scope) => {
  if (scope === "hod") {
    return [...hodNotifications];
  } else if (scope === "department") {
    return [...deptNotifications];
  } else {
    // "all" or not provided
    return [...hodNotifications, ...deptNotifications];
  }
};

export const getNotifications = async ({ scope, category, priority, is_read }) => {
  let list = getNotificationsList(scope);

  if (category !== undefined) {
    list = list.filter(n => n.category === category);
  }
  if (priority !== undefined) {
    list = list.filter(n => n.priority === priority);
  }
  if (is_read !== undefined) {
    list = list.filter(n => n.is_read === is_read);
  }

  const total = list.length;
  const unread_count = list.filter(n => !n.is_read).length;

  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return {
    total,
    unread_count,
    notifications: list
  };
};

export const getNotificationById = async (id) => {
  const notif = hodNotifications.find(n => n.id === id) || deptNotifications.find(n => n.id === id);
  return notif || null;
};

export const markAsRead = async (id) => {
  const notif = hodNotifications.find(n => n.id === id) || deptNotifications.find(n => n.id === id);
  if (!notif) return null;
  notif.is_read = true;
  return notif;
};

export const markAllAsRead = async ({ scope }) => {
  let list = [];
  if (!scope || scope === "all") {
    list = [...hodNotifications, ...deptNotifications];
  } else if (scope === "hod") {
    list = hodNotifications;
  } else if (scope === "department") {
    list = deptNotifications;
  }

  let updated_count = 0;
  for (const notif of list) {
    if (!notif.is_read) {
      notif.is_read = true;
      updated_count++;
    }
  }

  return { updated_count };
};

export const getUnreadCount = async ({ scope }) => {
  const list = getNotificationsList(scope);
  const unreadList = list.filter(n => !n.is_read);
  const total_unread = unreadList.length;

  const by_category = {};
  for (const notif of unreadList) {
    if (!by_category[notif.category]) {
      by_category[notif.category] = 0;
    }
    by_category[notif.category]++;
  }

  return {
    total_unread,
    by_category
  };
};
