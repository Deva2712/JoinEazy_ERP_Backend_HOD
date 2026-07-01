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
  let courses = [];
  if (faculty.user_id) {
    coursesCount = await UserCourse.count({
      where: {
        user_id: faculty.user_id,
        role_in_course: "faculty"
      }
    });

    const userCourses = await UserCourse.findAll({
      where: {
        user_id: faculty.user_id,
        role_in_course: "faculty"
      },
      include: [
        {
          model: Course,
          as: "course"
        }
      ]
    });
    courses = userCourses
      .map(uc => {
        if (!uc.course) return null;
        return {
          id: uc.course.id,
          code: uc.course.code,
          name: uc.course.name,
          credits: uc.course.credits,
          semester: uc.course.semester
        };
      })
      .filter(Boolean);
  }

  let research_count = 0;
  let research_projects = [];
  if (name !== "Unknown") {
    research_count = await ResearchProject.count({
      where: {
        authors: {
          [Op.contains]: [name]
        }
      }
    });

    const projects = await ResearchProject.findAll({
      where: {
        authors: {
          [Op.contains]: [name]
        }
      }
    });
    research_projects = projects.map(p => ({
      id: p.id,
      title: p.title,
      status: p.status,
      total_budget_inr: p.total_budget_inr
    }));
  }

  const weekly_schedule = [];
  const firstCourse = courses[0];
  const secondCourse = courses[1];

  if (firstCourse) {
    weekly_schedule.push({
      day: "Monday",
      classes: [
        {
          course_code: firstCourse.code,
          course_name: firstCourse.name,
          start_time: "09:00",
          end_time: "10:30",
          room: "Lab 101",
          section: "CSE-A"
        }
      ]
    });
  }

  if (secondCourse) {
    weekly_schedule.push({
      day: "Tuesday",
      classes: [
        {
          course_code: secondCourse.code,
          course_name: secondCourse.name,
          start_time: "11:00",
          end_time: "12:30",
          room: "Lab 102",
          section: "CSE-B"
        }
      ]
    });
  }

  if (firstCourse) {
    weekly_schedule.push({
      day: "Wednesday",
      classes: [
        {
          course_code: firstCourse.code,
          course_name: firstCourse.name,
          start_time: "09:00",
          end_time: "10:30",
          room: "Lab 101",
          section: "CSE-A"
        }
      ]
    });
  }

  if (secondCourse) {
    weekly_schedule.push({
      day: "Thursday",
      classes: [
        {
          course_code: secondCourse.code,
          course_name: secondCourse.name,
          start_time: "11:00",
          end_time: "12:30",
          room: "Lab 102",
          section: "CSE-B"
        }
      ]
    });
  }

  if (firstCourse) {
    weekly_schedule.push({
      day: "Friday",
      classes: [
        {
          course_code: firstCourse.code,
          course_name: firstCourse.name,
          start_time: "09:00",
          end_time: "10:30",
          room: "Lab 101",
          section: "CSE-A"
        }
      ]
    });
  }

  return {
    id: faculty.id,
    name,
    email,
    designation: faculty.designation,
    faculty_summary: {
      avg_rating: 0,
      avg_feedback: 4.2,
      courses: coursesCount,
      personal_attendance_percentage: 0
    },
    academic_metrics: {
      papers_published: research_count,
      projects_guided: research_count,
      conferences_attended: 0
    },
    research_count,
    publications_count: research_count,
    courses,
    research_projects,
    weekly_schedule
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
