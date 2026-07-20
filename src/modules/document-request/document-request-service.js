import { RegistrarRequest, LorRequest, RegistrarProcess } from "./document-request-model.js";
import Student from "../department-students/department-students-model.js";

// stdFac compatibility functions
export const getOverview = async (userId) => {
  const requests = await RegistrarRequest.findAll({ where: { student_id: userId } });
  const pending = requests.filter(r => r.status === "pending").length;
  const ready = requests.filter(r => r.status === "ready").length;
  return { overview: { total: requests.length, pending, ready }, requests, adminSubmittedDocs: [] };
};

export const getRequests = async (userId) => {
  const requests = await RegistrarRequest.findAll({ where: { student_id: userId }, order: [["createdAt","DESC"]] });
  return { requests };
};

export const createRequest = async (userId, data) => {
  const request = await RegistrarRequest.create({ student_id: userId, ...data });
  return { request };
};

export const cancelRequest = async (requestId, userId) => {
  const request = await RegistrarRequest.findOne({ where: { id: requestId, student_id: userId } });
  if (!request) { const err = new Error("Request not found"); err.statusCode = 404; throw err; }
  await request.update({ status: "rejected" });
  return { request };
};

export const getLorRequests = async (userId) => {
  const requests = await LorRequest.findAll({ 
    where: { student_id: userId }, 
    order: [["createdAt","DESC"]] 
  });
  return requests.map(r => r.toJSON());
};

export const createLorRequest = async (userId, data) => {
  const request = await LorRequest.create({ student_id: userId, ...data });
  return request.toJSON();
};

export const cancelLorRequest = async (requestId, userId) => {
  const request = await LorRequest.findOne({ where: { id: requestId, student_id: userId } });
  if (!request) { const err = new Error("LOR request not found"); err.statusCode = 404; throw err; }
  await request.destroy();
  return { message: "LOR request cancelled" };
};

export const scheduleLorMeeting = async (requestId, userId, meetingTime) => {
  const request = await LorRequest.findOne({ where: { id: requestId, student_id: userId } });
  if (!request) { const err = new Error("LOR request not found"); err.statusCode = 404; throw err; }
  await request.update({ meeting_time: meetingTime });
  return request.toJSON();
};

// Frontend document-requests module workflow endpoints
export const getAllDocuments = async (professorId) => {
  const requests = await LorRequest.findAll({
    where: {},
    order: [["createdAt", "DESC"]]
  });

  const studentRequests = [];
  for (const r of requests) {
    const student = await Student.findOne({ where: { user_id: r.student_id } });
    studentRequests.push({
      id: r.id,
      student: {
        name: student?.name || "Student",
        rollNumber: student?.roll_number || "ST21BTECH",
        email: student?.email || "student@university.edu"
      },
      application: {
        purpose: r.purpose || "",
        lorDocument: r.lor_document || null,
        supportingDocs: r.supporting_docs || []
      },
      status: r.status || "Pending",
      requestDate: r.createdAt.toISOString().split("T")[0]
    });
  }

  const queueItems = await RegistrarProcess.findAll({ order: [["createdAt", "DESC"]] });
  const processingQueue = queueItems.map(q => ({
    lorId: q.lor_id,
    studentName: q.student_name,
    rollNumber: q.roll_number,
    originalRequestId: q.original_request_id,
    signedDocument: q.signed_document,
    supportingDocs: q.supporting_docs,
    approvedDocument: q.approved_document,
    noteToRegistrar: q.note_to_registrar,
    sentDate: q.sent_date,
    status: q.status
  }));

  const admins = [
    {
      name: "Registrar Office",
      email: "registrar.office@mahindrauniversity.edu.in",
      phone: "+91 99999 88888",
      role: "Main Registrar Liaison",
    },
    {
      name: "Dean of Research Office",
      email: "research.dean@mahindrauniversity.edu.in",
      phone: "+91 99999 77777",
    }
  ];

  return { studentRequests, processingQueue, admins };
};

export const respondToStudentRequest = async (requestId, status, reason) => {
  const request = await LorRequest.findByPk(requestId);
  if (!request) { const err = new Error("LOR request not found"); err.statusCode = 404; throw err; }
  await request.update({
    status,
    remarks: reason || request.remarks
  });
  return { success: true };
};

export const submitToRegistrar = async (data) => {
  const originalReq = await LorRequest.findByPk(data.studentInfo.requestId);
  if (!originalReq) { const err = new Error("Original LOR request not found"); err.statusCode = 404; throw err; }
  
  const student = await Student.findOne({ where: { user_id: originalReq.student_id } });

  await RegistrarProcess.create({
    lor_id: `LOR-PROC-${Math.floor(1000 + Math.random() * 9000)}`,
    original_request_id: data.studentInfo.requestId,
    student_name: student?.name || "Student",
    roll_number: student?.roll_number || "ST21BTECH",
    signed_document: data.signedDocument,
    supporting_docs: data.supportingDocs || [],
    note_to_registrar: data.registrarNote,
    status: "Pending",
    sent_date: new Date().toISOString().split("T")[0]
  });

  await originalReq.update({ status: "Under Review" });
  return { success: true };
};

export const registrarUploadApproved = async (lorId, approvedDocument) => {
  const flow = await RegistrarProcess.findOne({ where: { lor_id: lorId } });
  if (!flow) { const err = new Error("Registrar process flow not found"); err.statusCode = 404; throw err; }
  await flow.update({
    approved_document: approvedDocument,
    status: "Approved",
    approved_date: new Date().toISOString().split("T")[0]
  });
  return { success: true };
};

export const dispatchToStudent = async (lorId) => {
  const flow = await RegistrarProcess.findOne({ where: { lor_id: lorId } });
  if (!flow) { const err = new Error("Registrar process flow not found"); err.statusCode = 404; throw err; }
  
  await flow.update({
    status: "Dispatched",
    sent_to_student_date: new Date().toISOString().split("T")[0]
  });

  const originalReq = await LorRequest.findByPk(flow.original_request_id);
  if (originalReq) {
    await originalReq.update({ status: "Dispatched" });
  }
  return { success: true };
};
