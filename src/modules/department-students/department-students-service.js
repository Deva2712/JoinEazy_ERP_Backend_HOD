import Student from "./department-students-model.js";
import { Op, fn, col } from "sequelize";

export const getAllStudents = async () => {
  const results = await Student.findAll({
    attributes: [
      "batch",
      [fn("COUNT", col("id")), "students_enrolled"],
      [fn("COUNT", fn("DISTINCT", col("section"))), "sections_count"],
      [fn("AVG", col("cgpa")), "avg_cgpa"],
      [fn("AVG", col("attendance_percentage")), "attendance_percentage"]
    ],
    group: ["batch"]
  });

  return results.map(r => {
    const raw = r.get({ plain: true });
    return {
      batch: raw.batch,
      sections_count: parseInt(raw.sections_count || 0, 10),
      students_enrolled: parseInt(raw.students_enrolled || 0, 10),
      avg_cgpa: raw.avg_cgpa ? Number(parseFloat(raw.avg_cgpa).toFixed(2)) : 0,
      attendance_percentage: raw.attendance_percentage ? Math.round(parseFloat(raw.attendance_percentage)) : 0
    };
  });
};

export const getStudentsByBatch = async (year) => {
  const students = await Student.findAll({
    where: { batch: year }
  });
  if (students.length === 0) return null;
  return {
    batch: year,
    total: students.length,
    students: students.map(s => ({
      id: s.id,
      name: s.name,
      roll_number: s.roll_number,
      cgpa: s.cgpa,
      attendance_percentage: s.attendance_percentage,
      section: s.section,
      semester: s.semester,
      batch: s.batch,
      backlogs: s.backlogs
    }))
  };
};

export const getStudentDetails = async (id) => {
  const student = await Student.findByPk(id);
  if (!student) return null;
  return {
    id: student.id,
    name: student.name,
    roll_number: student.roll_number,
    email: student.email,
    phone: student.phone,
    batch: student.batch,
    section: student.section,
    semester: student.semester,
    cgpa: student.cgpa,
    attendance_percentage: student.attendance_percentage,
    backlogs: student.backlogs,
    student_summary: {
      section: student.section,
      semester: student.semester,
      overall_attendance_percentage: student.attendance_percentage
    },
    semester_performance: [],
    placement_and_internships: [],
    research_work: [],
    mentoring_history: []
  };
};

export const getStudentPerformance = async (id) => {
  const student = await Student.findByPk(id);
  if (!student) return null;
  return {
    id: student.id,
    name: student.name,
    cgpa: student.cgpa,
    attendance_percentage: student.attendance_percentage,
    semester_performance: [],
    backlogs: student.backlogs,
    student_summary: {
      section: student.section,
      semester: student.semester,
      overall_attendance_percentage: student.attendance_percentage
    }
  };
};
