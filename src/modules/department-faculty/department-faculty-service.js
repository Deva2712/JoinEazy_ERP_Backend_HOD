import Faculty from "./department-faculty-model.js";
import User from "../auth/auth-model.js";
import UserCourse from "../department-courses/user-course-model.js";
import Course from "../department-courses/department-courses-model.js";
import { Op } from "sequelize";
import ResearchProject from "../department-research/research-project-model.js";

export const getAllFaculty = async () => {
  const faculties = await Faculty.findAll({
    include: [
      {
        model: User,
        as: "user",
        required: false,
        include: [
          {
            model: UserCourse,
            as: "userCourses",
            where: { role_in_course: "faculty" },
            required: false,
            include: [
              {
                model: Course,
                as: "course",
                required: false
              }
            ]
          }
        ]
      }
    ]
  });

  return faculties.map(f => {
    const name = f.user?.name || "Unknown";
    const userCourses = f.user?.userCourses || [];
    const courses_count = userCourses.length;

    let hours_per_week = 0;
    for (const uc of userCourses) {
      if (uc.course && uc.course.credits) {
        hours_per_week += uc.course.credits;
      }
    }

    return {
      id: f.id,
      name,
      designation: f.designation,
      courses_count,
      hours_per_week
    };
  });
};

export const getFacultyById = async (id) => {
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

  let research_count = 0;
  if (name !== "Unknown") {
    research_count = await ResearchProject.count({
      where: {
        authors: {
          [Op.contains]: [name]
        }
      }
    });
  }

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
      papers_published: research_count,
      projects_guided: research_count,
      conferences_attended: 0
    },
    research_count,
    publications_count: research_count
  };
};

export const getFacultyDetails = getFacultyById;

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
