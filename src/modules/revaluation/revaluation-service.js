import RevaluationRequest from "./revaluation-model.js";
import User from "../auth/auth-model.js";
import Student from "../department-students/department-students-model.js";

const includeStudent = [
  {
    model: User,
    as: "student",
    attributes: ["id", "name", "email"],
    include: [
      {
        model: Student,
        as: "studentProfile",
        attributes: ["roll_number"],
      }
    ]
  }
];

const fmt = (req) => {
  if (!req) return null;
  const data = req.toJSON ? req.toJSON() : req;
  return {
    id: data.id,
    studentId: data.student_id,
    studentName: req.student?.name || "Student",
    enrollmentNo: req.student?.studentProfile?.roll_number || "STU-REG",
    professorId: data.professor_id,
    subjectCode: data.subject_code,
    subjectName: data.subject_name,
    semester: data.semester,
    examType: data.exam_type,
    priority: data.priority || "Mid",
    reason: data.reason,
    originalMarks: data.original_marks,
    maxMarks: data.max_marks || 100,
    originalGrade: data.original_grade,
    revisedMarks: data.revised_marks,
    revisedGrade: data.revised_grade,
    status: data.status,
    professorRemarks: data.professor_remarks,
    remarks: data.professor_remarks,
    submittedAt: data.created_at || data.createdAt,
    createdAt: data.created_at || data.createdAt,
    updatedAt: data.updated_at || data.updatedAt,
  };
};

export const getProfOverview = async (professorId) => {
  const requests = await RevaluationRequest.findAll({
    where: { professor_id: professorId },
    include: includeStudent,
    order: [["created_at", "DESC"]],
  });
  const formatted = requests.map(fmt);
  const pending = formatted.filter(r => r.status === "Pending").length;
  const underReview = formatted.filter(r => r.status === "UnderReview").length;
  const resolved = formatted.filter(r => r.status === "Approved" || r.status === "Rejected").length;
  return {
    overview: { total: formatted.length, pending, under_review: underReview, resolved },
    requests: formatted,
  };
};

export const getProfRequests = async (professorId, status) => {
  const where = { professor_id: professorId };
  if (status) {
    if (status.toLowerCase() === "pending") {
      where.status = ["Pending", "UnderReview"];
    } else if (status.toLowerCase() === "resolved") {
      where.status = ["Approved", "Rejected"];
    } else {
      where.status = status;
    }
  }
  const requests = await RevaluationRequest.findAll({
    where,
    include: includeStudent,
    order: [["created_at", "DESC"]],
  });
  return requests.map(fmt);
};

export const acceptRequest = async (requestId) => {
  const req = await RevaluationRequest.findByPk(requestId, { include: includeStudent });
  if (!req) {
    const err = new Error("Request not found");
    err.statusCode = 404;
    throw err;
  }
  await req.update({ status: "UnderReview" });
  return fmt(req);
};

export const rejectRequest = async (requestId, reason) => {
  const req = await RevaluationRequest.findByPk(requestId, { include: includeStudent });
  if (!req) {
    const err = new Error("Request not found");
    err.statusCode = 404;
    throw err;
  }
  await req.update({ status: "Rejected", professor_remarks: reason });
  return fmt(req);
};

export const updateResult = async (requestId, revisedMarks, revisedGrade, remarks) => {
  const req = await RevaluationRequest.findByPk(requestId, { include: includeStudent });
  if (!req) {
    const err = new Error("Request not found");
    err.statusCode = 404;
    throw err;
  }
  await req.update({
    revised_marks: revisedMarks,
    revised_grade: revisedGrade,
    status: "Approved",
    professor_remarks: remarks
  });
  return fmt(req);
};

export const getStudentOverview = async (studentId) => {
  const requests = await RevaluationRequest.findAll({
    where: { student_id: studentId },
    include: includeStudent,
    order: [["created_at", "DESC"]],
  });
  const formatted = requests.map(fmt);
  return {
    overview: { total: formatted.length },
    requests: formatted,
  };
};

export const getStudentRequests = async (studentId) => {
  const requests = await RevaluationRequest.findAll({
    where: { student_id: studentId },
    include: includeStudent,
    order: [["created_at", "DESC"]],
  });
  return requests.map(fmt);
};

export const getSubjects = async () => {
  return [];
};

export const createStudentRequest = async (studentId, data) => {
  const request = await RevaluationRequest.create({
    student_id: studentId,
    professor_id: data.professorId || data.professor_id,
    subject_code: data.subjectCode || data.subject_code,
    subject_name: data.subjectName || data.subject_name,
    semester: data.semester,
    exam_type: data.examType || data.exam_type,
    priority: data.priority || "Mid",
    reason: data.reason,
    original_marks: data.originalMarks || data.original_marks,
    max_marks: data.maxMarks || data.max_marks || 100,
    original_grade: data.originalGrade || data.original_grade,
    status: "Pending",
  });
  const reloaded = await RevaluationRequest.findByPk(request.id, { include: includeStudent });
  return fmt(reloaded);
};

export const cancelStudentRequest = async (requestId, studentId) => {
  const req = await RevaluationRequest.findOne({ where: { id: requestId, student_id: studentId } });
  if (!req) {
    const err = new Error("Request not found");
    err.statusCode = 404;
    throw err;
  }
  await req.destroy();
  return { message: "Request cancelled" };
};

export const deleteRequest = async (requestId) => {
  const req = await RevaluationRequest.findByPk(requestId);
  if (!req) {
    const err = new Error("Request not found");
    err.statusCode = 404;
    throw err;
  }
  await req.destroy();
  return { message: "Request deleted" };
};

