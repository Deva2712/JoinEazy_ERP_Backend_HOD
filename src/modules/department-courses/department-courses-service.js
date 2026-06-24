import Course from "./department-courses-model.js";
import UserCourse from "./user-course-model.js";
import AttendanceRecord from "./attendance-record-model.js";
import { Op } from "sequelize";
import User from "../auth/auth-model.js";

export const getAllCourses = async () => {
  const courses = await Course.findAll({
    include: [
      {
        model: UserCourse,
        as: "userCourses",
        where: { role_in_course: "faculty" },
        required: false,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name"]
          }
        ]
      }
    ]
  });

  return courses.map(course => {
    const faculty_names = (course.userCourses || [])
      .map(uc => uc.user?.name)
      .filter(Boolean);

    return {
      id: course.id,
      code: course.code,
      name: course.name,
      semester: course.semester,
      faculty_names
    };
  });
};

export const getCourseDetails = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) return null;

  const studentsCount = await UserCourse.count({
    where: {
      course_id: id,
      role_in_course: "student"
    }
  });

  // Query faculty user courses
  // TODO: join with User model once association is set up to get faculty names
  const facultyUserCourses = await UserCourse.findAll({
    where: {
      course_id: id,
      role_in_course: "faculty"
    }
  });

  const allUserCourses = await UserCourse.findAll({
    where: { course_id: id }
  });
  const userCourseIds = allUserCourses.map(uc => uc.id);

  let attendance_history = [];
  if (userCourseIds.length > 0) {
    const attendanceRecords = await AttendanceRecord.findAll({
      where: {
        user_course_id: {
          [Op.in]: userCourseIds
        }
      }
    });

    const groupedByDate = {};
    for (const record of attendanceRecords) {
      const date = record.date;
      if (!groupedByDate[date]) {
        groupedByDate[date] = { presentCount: 0, totalCount: 0 };
      }
      groupedByDate[date].totalCount += 1;
      if (record.status === "present") {
        groupedByDate[date].presentCount += 1;
      }
    }

    attendance_history = Object.entries(groupedByDate).map(([date, counts]) => {
      const percentage = counts.totalCount > 0
        ? (counts.presentCount / counts.totalCount) * 100
        : 0;
      return { date, percentage };
    });

    attendance_history.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  let attendance_percentage = 0;
  if (attendance_history.length > 0) {
    const sum = attendance_history.reduce((acc, curr) => acc + curr.percentage, 0);
    attendance_percentage = sum / attendance_history.length;
  }

  return {
    id: course.id,
    code: course.code,
    name: course.name,
    semester: course.semester,
    credits: course.credits,
    status: course.status,
    faculty_names: [],
    attendance_history,
    grading_status: {
      assignments: { total: 0, completed: 0, ongoing: 0 },
      projects: { total: 0, completed: 0, ongoing: 0 }
    },
    documents: [],
    reflections: [],
    course_summary: {
      class_size: studentsCount,
      credits: course.credits,
      syllabus_coverage_percentage: 0,
      attendance_percentage
    }
  };
};

export const getCourseDocuments = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) return null;
  return [];
};

export const updateCourse = async (id, data) => {
  const course = await Course.findByPk(id);
  if (!course) return null;

  const allowedFields = ["name", "code", "credits", "semester", "status", "department_id"];
  const updateData = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  await course.update(updateData);
  return course;
};

export const createCourse = async (data) => {
  return await Course.create({
    name: data.name,
    code: data.code,
    credits: data.credits,
    semester: data.semester,
    department_id: data.department_id,
    status: data.status || "active"
  });
};

