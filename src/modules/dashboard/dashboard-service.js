import User from "../auth/auth-model.js";
import Faculty from "../department-faculty/department-faculty-model.js";
import Student from "../department-students/department-students-model.js";
import Approval from "../approvals/approvals-model.js";

export const getHODDashboardOverview = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "email", "role", "employeeId"],
  });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const faculty_count = await Faculty.count();
  const student_count = await Student.count();
  const pending_leaves = await Approval.count({
    where: {
      type: "leave",
      status: "Pending",
    },
  });
  
  // Hardcoded — no schedule/session table exists yet
  const upcoming_sessions = 0;

  return {
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        fullName: user.name,
        employeeId: user.employeeId || "HOD-001",
        organization: "Mahindra University",
      },
      upcomingMeetings: [],
      todoAssignments: [],
      stats: {
        pending_leaves,
        faculty_count,
        student_count,
        upcoming_sessions,
      },
    },
  };
};
