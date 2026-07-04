// src/modules/cohort-attendance/cohort-attendance-service.js

import { Op } from "sequelize";
import { AttendanceLog, AttendanceRecord } from "./cohort-attendance-model.js";
import { Cohort } from "../cohort/cohort-model.js";
import CohortMember from "../cohort-members/cohort-members-model.js";

// ─── GET /attendance/logs/:cohortId ──────────────────────────────────────────
export const getAttendanceLogs = async (cohortId) => {
  const logs = await AttendanceLog.findAll({
    where: { cohort_id: cohortId },
    include: [{ model: AttendanceRecord, as: "records" }],
    order: [["date", "DESC"]],
  });

  const logsMap = { "A": {} };
  let isFinal = false;
  const todayStr = new Date().toISOString().split("T")[0];

  logs.forEach((log) => {
    const presentIds = log.records
      .filter((r) => r.is_present)
      .map((r) => r.student_id);
    logsMap["A"][log.date] = presentIds;

    if (log.date === todayStr && log.status === "final") {
      isFinal = true;
    }
  });

  // Query CohortMember where cohort_id = cohortId AND role = "student"
  const members = await CohortMember.findAll({
    where: {
      cohort_id: cohortId,
      role: "student",
    },
  });

  // Collect existing rollNumber and department from past records for enrichment
  const recordDetailsMap = new Map();
  logs.forEach((log) => {
    log.records.forEach((r) => {
      if (r.roll_number || r.department) {
        recordDetailsMap.set(r.student_id, {
          rollNumber: r.roll_number,
          department: r.department,
        });
      }
    });
  });

  // Map each member to: { id, name, rollNumber, department, section: "A" }
  const students = members.map((member) => {
    const enriched = recordDetailsMap.get(member.user_id) || {};
    return {
      id:         member.user_id,
      name:       member.name,
      rollNumber: enriched.rollNumber || "",
      department: enriched.department || member.department || null,
      section:    "A",
    };
  });

  return {
    status: "success",
    data: {
      students,
      logs:     logsMap,
      isFinal,
    },
  };
};

// ─── GET /professor/logs ──────────────────────────────────────────────────────
export const getProfessorLogs = async (professorId) => {
  const logs = await AttendanceLog.findAll({
    where: { professor_id: professorId },
    order: [["date", "DESC"]],
    limit: 30,
  });

  return {
    status: "success",
    data: logs.map((log) => ({
      id:        log.id,
      date:      log.date,
      courseId:  log.course_id,
      cohortId:  log.cohort_id,
      status:    log.status,
      createdAt: log.created_at,
    })),
  };
};

// ─── POST /courses/:courseId/attendance ───────────────────────────────────────
// Frontend sends: { studentIds: [...], date: "2026-06-06", status: "final" }
// FIX: allStudents fetch from previous attendance records for this cohort
//      so we dont need frontend to send allStudents
export const markAttendance = async (courseId, data, professor, cohortId) => {
  const { studentIds: presentIds = [], date, status = "final" } = data;

  // FIX: Fetch all known students for this cohort from past attendance records
  // This avoids needing frontend to send allStudents in body
  const logs = await AttendanceLog.findAll({
    where: { cohort_id: cohortId },
    attributes: ["id"],
  });
  const logIds = logs.map((l) => l.id);

  const existingRecords = logIds.length > 0
    ? await AttendanceRecord.findAll({
        where: { log_id: { [Op.in]: logIds } },
        attributes: ["student_id", "student_name", "roll_number", "department"],
        group: ["student_id", "student_name", "roll_number", "department"],
      })
    : [];

  // Also include any new presentIds that may not be in past records
  const knownStudentMap = new Map();
  existingRecords.forEach((r) => {
    knownStudentMap.set(r.student_id, {
      id:          r.student_id,
      name:        r.student_name,
      roll_number: r.roll_number,
      department:  r.department,
    });
  });

  // If no known students, use presentIds as the full list (first time marking)
  const allStudents = knownStudentMap.size > 0
    ? Array.from(knownStudentMap.values())
    : presentIds.map((id) => ({ id, name: "Unknown", roll_number: null, department: null }));

  // Check if a log already exists for this course and date
  const existingLog = await AttendanceLog.findOne({
    where: { course_id: courseId, date }
  });

  let log;
  if (existingLog) {
    await existingLog.update({
      professor_id: professor.id,
      professor_name: professor.name,
      status,
    });
    log = existingLog;
  } else {
    log = await AttendanceLog.create({
      cohort_id: cohortId,
      course_id: courseId,
      professor_id: professor.id,
      professor_name: professor.name,
      date,
      status,
    });
  }

  // Delete and recreate records — cleanest approach
  await AttendanceRecord.destroy({ where: { log_id: log.id } });

  const records = allStudents.map((student) => ({
    log_id:       log.id,
    student_id:   student.id,
    student_name: student.name,
    roll_number:  student.roll_number || null,
    department:   student.department || null,
    is_present:   presentIds.includes(student.id),
  }));

  if (records.length > 0) {
    await AttendanceRecord.bulkCreate(records);
  }

  return {
    status: "success",
    data: {
      logId:        log.id,
      date:         log.date,
      courseId,
      presentCount: presentIds.length,
      totalCount:   allStudents.length,
      status:       log.status,
    },
  };
};
