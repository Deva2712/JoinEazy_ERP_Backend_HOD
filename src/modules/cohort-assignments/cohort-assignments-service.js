// src/modules/cohort-assignments/cohort-assignments-service.js
import { Op } from "sequelize";
import { CohortAssignment, AssignmentSubmission } from "./cohort-assignments-model.js";
import { CohortGroupMember, CohortGroup, CohortParticipant } from "../cohort/cohort-model.js";
import User from "../auth/auth-model.js";

// GET /cohort/:cohortId/assignments
export const getAssignments = async (cohortId) => {
  const rows = await CohortAssignment.findAll({
    where: { cohort_id: String(cohortId) },
    include: [{ model: AssignmentSubmission, as: "submissions", attributes: ["id", "student_id", "grade", "submitted_at"] }],
    order: [["deadline", "ASC"]],
  });
  const totalMembers = await CohortParticipant.count({ where: { cohort_id: String(cohortId) } });
  const totalGroups = await CohortGroup.count({ where: { cohort_id: String(cohortId) } });
  return {
    assignments: rows.map((a) => a.toJSON()),
    totalMembers,
    totalGroups
  };
};

// POST /cohort/:cohortId/assignments
export const createAssignment = async (cohortId, body, userId) => {
  const assignment = await CohortAssignment.create({
    cohort_id:       String(cohortId),
    title:           body.name || body.title,
    description:     body.description || null,
    deadline:        body.deadline || null,
    marks:           body.marks || "10",
    type:            body.type || "individual",
    submission_link: body.submissionLink || null,
    created_by:      userId,
  });
  return assignment.toJSON();
};

// PUT /cohort/:cohortId/assignments/:assignmentId
export const updateAssignment = async (cohortId, assignmentId, body) => {
  const assignment = await CohortAssignment.findOne({ where: { id: assignmentId, cohort_id: String(cohortId) } });
  if (!assignment) { const e = new Error("Assignment not found"); e.statusCode = 404; throw e; }
  await assignment.update({
    title:           body.name || body.title || assignment.title,
    description:     body.description ?? assignment.description,
    deadline:        body.deadline ?? assignment.deadline,
    marks:           body.marks ?? assignment.marks,
    type:            body.type ?? assignment.type,
    submission_link: body.submissionLink ?? assignment.submission_link,
  });
  return assignment.toJSON();
};

// DELETE /cohort/:cohortId/assignments/:assignmentId
export const deleteAssignment = async (cohortId, assignmentId) => {
  const assignment = await CohortAssignment.findOne({ where: { id: assignmentId, cohort_id: String(cohortId) } });
  if (!assignment) { const e = new Error("Assignment not found"); e.statusCode = 404; throw e; }
  await assignment.destroy();
  return { deleted: true };
};

// POST /cohort/assignments/:assignmentId/grade
export const gradeSubmission = async (assignmentId, body) => {
  const studentId = body.studentId || body.submissionId;
  let submission = await AssignmentSubmission.findOne({
    where: { student_id: studentId, assignment_id: assignmentId }
  });
  if (!submission) {
    const student = await User.findByPk(studentId);
    const studentName = student ? student.name : "Student";
    submission = await AssignmentSubmission.create({
      assignment_id: assignmentId,
      student_id: studentId,
      student_name: studentName,
      submitted_at: new Date(),
      link: "",
      note: ""
    });
  }
  const gradeVal = body.marksAwarded !== undefined ? body.marksAwarded : body.grade;
  await submission.update({
    grade:         String(gradeVal),
    marks_awarded: Number(gradeVal),
    feedback:      body.comments || body.feedback || null,
  });
  return submission.toJSON();
};

export const gradeGroupAssignment = async (assignmentId, body) => {
  let groupId = body.groupId;
  const assignment = await CohortAssignment.findByPk(assignmentId);
  const cohortId = assignment ? assignment.cohort_id : null;

  if (!groupId && body.leaderId) {
    const leaderGroups = await CohortGroupMember.findAll({ where: { user_id: body.leaderId } });
    for (const lg of leaderGroups) {
      const group = await CohortGroup.findOne({ where: { id: lg.group_id, cohort_id: cohortId } });
      if (group) {
        groupId = group.id;
        break;
      }
    }
  }
  if (!groupId) {
    const e = new Error("Group not found");
    e.statusCode = 404;
    throw e;
  }
  const groupMembers = await CohortGroupMember.findAll({
    where: { group_id: groupId }
  });
  const userIds = groupMembers.map((m) => m.user_id);
  const feedbackVal = body.comments || body.feedback || null;
  const gradeVal = body.marksAwarded !== undefined ? body.marksAwarded : body.grade;

  for (const userId of userIds) {
    let sub = await AssignmentSubmission.findOne({
      where: { assignment_id: assignmentId, student_id: userId }
    });
    if (!sub) {
      const student = await User.findByPk(userId);
      const studentName = student ? student.name : "Student";
      sub = await AssignmentSubmission.create({
        assignment_id: assignmentId,
        student_id: userId,
        student_name: studentName,
        group_id: groupId,
        submitted_at: new Date(),
        link: "",
        note: ""
      });
    }
    await sub.update({
      marks_awarded: Number(gradeVal),
      grade:         String(gradeVal),
      feedback:      feedbackVal,
    });
  }

  return {
    graded_count: userIds.length,
    group_id: groupId,
    marks_awarded: Number(gradeVal)
  };
};

export const getSubmissionStatus = async (cohortId, userId, assignmentIds = null) => {
  const where = { student_id: userId };
  if (assignmentIds) where.assignment_id = assignmentIds;
  const subs = await AssignmentSubmission.findAll({ where, attributes: ["assignment_id","grade","marks_awarded","submitted_at"] });
  return { submissions: subs.map(s => s.toJSON()) };
};
export const getAssignmentSubmissions = async (cohortId, assignmentId) => {
  const submissions = await AssignmentSubmission.findAll({
    where: { assignment_id: assignmentId },
    order: [["submitted_at", "DESC"]],
  });

  const assignment = await CohortAssignment.findByPk(assignmentId);
  if (assignment && assignment.type === "group") {
    const enriched = [];
    for (const sub of submissions) {
      const subJson = sub.toJSON();
      if (subJson.group_id) {
        const group = await CohortGroup.findOne({
          where: { id: subJson.group_id },
          include: [{ model: CohortGroupMember, as: "CohortGroupMembers" }]
        });
        if (group) {
          subJson.group_name = group.group_name;
          const members = [];
          for (const m of group.CohortGroupMembers) {
            const student = await User.findByPk(m.user_id);
            members.push({
              name: student ? student.name : "Student",
              isLeader: m.role === "leader"
            });
          }
          subJson.members = members;
        }
      }
      enriched.push(subJson);
    }
    return enriched;
  }

  return submissions.map((s) => s.toJSON());
};

export const submitAssignment = async (cohortId, assignmentId, student, body = {}) => {
  const [submission, created] = await AssignmentSubmission.findOrCreate({
    where: { assignment_id: assignmentId, student_id: student.id },
    defaults: {
      student_name: student.name,
      link:         body.link || null,
      note:         body.note || null,
      submitted_at: new Date(),
    },
  });
  return { submission: submission.toJSON(), already_submitted: !created };
};

export const unsubmitAssignment = async (cohortId, assignmentId, studentId) => {
  const submission = await AssignmentSubmission.findOne({
    where: { assignment_id: assignmentId, student_id: studentId },
  });
  if (!submission) {
    const e = new Error("Submission not found");
    e.statusCode = 404;
    throw e;
  }
  await submission.destroy();
  return { deleted: true };
};
