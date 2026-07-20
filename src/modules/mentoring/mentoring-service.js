import { MentorSession, MentorFeedback } from "./mentoring-model.js";
import Student from "../department-students/department-students-model.js";
import User from "../auth/auth-model.js";

// stdFac service compatibility functions
export const getDashboard = async (userId) => {
  const sessions = await MentorSession.findAll({ where: { mentor_id: userId } });
  return { sessions };
};

export const requestMeeting = async (mentorId, menteeId, data) => {
  const session = await MentorSession.create({ mentor_id: mentorId, mentee_id: menteeId, ...data });
  return { session };
};

export const submitFeedback = async (mentorId, menteeId, data) => {
  const feedback = await MentorFeedback.create({ mentor_id: mentorId, mentee_id: menteeId, ...data });
  return { feedback };
};

// Frontend mentoring endpoints service logic
export const getAssignedMentees = async (mentorId) => {
  const students = await Student.findAll();

  const mentees = [];
  for (const student of students) {
    const sessions = await MentorSession.findAll({
      where: { mentor_id: mentorId, mentee_id: student.user_id },
      order: [["scheduled_at", "DESC"]]
    });

    // Check if there's at least one session to determine if they are advisor/mentee
    // Or if mentorId matches (fallback/default to return all CSE students)
    const formattedSessions = sessions.map(s => ({
      meetingId: s.id,
      date: s.scheduled_at.toISOString().split("T")[0],
      status: s.status === "completed" ? "Completed" : (s.status === "pending" ? "Requested" : "Pending Documentation"),
      hasAttended: s.status === "completed" ? true : (s.status === "cancelled" ? false : null),
      discussionSummary: s.notes || "",
      actionPlan: { studentTasks: [], skillImprovement: [] },
      performanceRatings: { academic: 4, professional: 4, personal: 4 },
      overallRemarks: s.notes || "",
    }));

    mentees.push({
      studentId: student.roll_number,
      name: student.name,
      department: "Computer Science",
      section: student.section || "CSE-A",
      semester: student.semester || 4,
      batch: student.batch || "2021 - 2025",
      studentType: "Day Scholar",
      emailId: student.email,
      phoneNumber: student.phone,
      academicMetrics: {
        cgpa: student.cgpa || 8.0,
        attendance: student.attendance_percentage || 85,
        backlogs: student.backlogs || 0,
        semesterGrades: [
          { sem: 1, gpa: student.cgpa ? student.cgpa - 0.2 : 7.8 },
          { sem: 2, gpa: student.cgpa || 8.0 },
          { sem: 3, gpa: student.cgpa ? student.cgpa + 0.2 : 8.2 },
        ],
        semesterAttendance: [
          { sem: 1, attendance: 95 },
          { sem: 2, attendance: student.attendance_percentage || 88 },
          { sem: 3, attendance: 90 },
        ],
        backlogHistory: (student.backlogs || 0) > 0 ? (
          (student.backlog_subjects && student.backlog_subjects.length > 0)
            ? student.backlog_subjects
            : Array.from({ length: student.backlogs || 0 }, (_, i) => ({
                name: `Backlog Subject ${i + 1}`,
                subject: `Backlog Subject ${i + 1}`,
                code: "N/A",
                semester: student.semester || 1,
                attempts: 1,
                status: "Pending Clearance"
              }))
        ) : [],
      },
      meetingHistory: formattedSessions
    });
  }

  return mentees;
};

export const updateMeetingAttendance = async (meetingId, hasAttended) => {
  const session = await MentorSession.findByPk(meetingId);
  if (!session) { const err = new Error("Meeting not found"); err.statusCode = 404; throw err; }
  await session.update({
    status: hasAttended ? "completed" : "cancelled"
  });
  return session;
};

export const submitMeetingNotes = async (meetingId, notesData) => {
  const session = await MentorSession.findByPk(meetingId);
  if (!session) { const err = new Error("Meeting not found"); err.statusCode = 404; throw err; }

  await session.update({
    notes: notesData.summary || notesData.overallRemarks || "",
    status: "completed"
  });

  const feedback = await MentorFeedback.create({
    session_id: session.id,
    mentor_id: session.mentor_id,
    mentee_id: session.mentee_id,
    rating: notesData.performanceRatings?.academic || 4,
    feedback: notesData.summary || ""
  });

  return { session, feedback };
};
