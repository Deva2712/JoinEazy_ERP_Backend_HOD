import { Op } from "sequelize";
import User from "../auth/auth-model.js";
import Faculty from "../department-faculty/department-faculty-model.js";
import Student from "../department-students/department-students-model.js";
import Approval from "../approvals/approvals-model.js";
import CohortMember from "../cohort-members/cohort-members-model.js";
import { CohortAssignment } from "../cohort-assignments/cohort-assignments-model.js";

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

  let createdCohorts = [];
  try {
    const { Cohort } = await import("../cohort/cohort-model.js");
    const cohorts = await Cohort.findAll({
      where: {
        creator_id: userId,
        visibility: {
          [Op.ne]: "Archived",
        },
      },
    });
    createdCohorts = await Promise.all(
      cohorts.map(async (c) => {
        const json = c.toJSON ? c.toJSON() : c;
        const [member_count, assignment_count] = await Promise.all([
          CohortMember.count({ where: { cohort_id: json.id } }),
          CohortAssignment.count({ where: { cohort_id: json.id } }),
        ]);
        return {
          id: json.id,
          cohort_name: json.cohort_name,
          name: json.cohort_name,
          cohort_description: json.cohort_description,
          status: json.status,
          creator_id: json.creator_id,
          is_admin: true,
          user_type: 1,
          start_date: json.start_date,
          end_date: json.end_date,
          created_at: json.created_at || json.createdAt,
          member_count,
          assignment_count,
        };
      })
    );
  } catch (error) {
    createdCohorts = [];
  }

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
      createdCohorts,
      joinedCohorts: [],
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

