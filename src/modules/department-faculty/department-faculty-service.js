import Faculty from "./department-faculty-model.js";
import User from "../auth/auth-model.js";
import UserCourse from "../department-courses/user-course-model.js";
import Course from "../department-courses/department-courses-model.js";
import { Op } from "sequelize";

export const getAllFaculty = async () => {
  const faculties = await Faculty.findAll();

  const userIds = [...new Set(faculties.map(f => f.user_id).filter(id => id !== null))];

  const users = await User.findAll({
    where: {
      id: {
        [Op.in]: userIds
      }
    },
    attributes: ["id", "name"]
  });

  const userMap = new Map(users.map(u => [u.id, u.name]));

  const results = [];
  for (const faculty of faculties) {
    const name = faculty.user_id ? (userMap.get(faculty.user_id) || "Unknown") : "Unknown";

    let courses_count = 0;
    if (faculty.user_id) {
      courses_count = await UserCourse.count({
        where: {
          user_id: faculty.user_id,
          role_in_course: "faculty"
        }
      });
    }

    // hours_per_week is hardcoded to 0 for now because no class duration data exists yet
    results.push({
      id: faculty.id,
      name,
      designation: faculty.designation,
      courses_count,
      hours_per_week: 0
    });
  }

  return results;
};

export const getFacultyDetails = async (id) => {
  const faculty = await Faculty.findByPk(id);
  if (!faculty) return null;

  let name = "Unknown";
  let email = "";
  if (faculty.user_id) {
    const user = await User.findByPk(faculty.user_id, {
      attributes: ["name", "email"]
    });
    if (user) {
      name = user.name;
      email = user.email;
    }
  }

  let coursesCount = 0;
  if (faculty.user_id) {
    coursesCount = await UserCourse.count({
      where: {
        user_id: faculty.user_id,
        role_in_course: "faculty"
      }
    });
  }

  // Note: avg_rating, personal_attendance_percentage, and all academic_metrics stay 0 for now
  // because faculty_feedback and research_members tables do not exist yet.
  return {
    id: faculty.id,
    name,
    email,
    designation: faculty.designation,
    faculty_summary: {
      avg_rating: 0,
      courses: coursesCount,
      personal_attendance_percentage: 0
    },
    academic_metrics: {
      papers_published: 0,
      projects_guided: 0,
      conferences_attended: 0
    }
  };
};

export const getFacultyWorkload = async (id) => {
  const faculty = await Faculty.findByPk(id);
  if (!faculty) return null;

  let name = "Unknown";
  if (faculty.user_id) {
    const user = await User.findByPk(faculty.user_id, {
      attributes: ["name"]
    });
    if (user) {
      name = user.name;
    }
  }

  const courses = [];
  if (faculty.user_id) {
    const userCourses = await UserCourse.findAll({
      where: {
        user_id: faculty.user_id,
        role_in_course: "faculty"
      }
    });

    for (const uc of userCourses) {
      const course = await Course.findByPk(uc.course_id);
      if (course) {
        // Note: section and schedule stay placeholder because no schedule table exists yet
        courses.push({
          course_name: course.name,
          course_code: course.code,
          section: "N/A",
          schedule: []
        });
      }
    }
  }

  return {
    id: faculty.id,
    name,
    teaching_load: {
      hours_per_week: 0,
      courses
    }
  };
};

export const getFacultyPerformance = async (id) => {
  const faculty = await Faculty.findByPk(id);
  if (!faculty) return null;

  let name = "Unknown";
  if (faculty.user_id) {
    const user = await User.findByPk(faculty.user_id, {
      attributes: ["name"]
    });
    if (user) {
      name = user.name;
    }
  }

  // Note: research, conferences, and feedback stay empty for now
  // because research_members and faculty_feedback tables do not exist yet.
  return {
    id: faculty.id,
    name,
    research: {
      active_projects: [],
      active_publications: []
    },
    conferences: [],
    feedback: []
  };
};
