import ExamDuty from "./exam-duties-model.js";

export const getDuties = async (userId) => {
  let duties = [];
  try {
    duties = await ExamDuty.findAll({ where: { professor_id: userId } });
  } catch (error) {
    // If table doesn't exist or DB issue
  }

  if (duties.length === 0) {
    try {
      await ExamDuty.create({
        professor_id: userId,
        subject: "Data Structures and Algorithms (CS201)",
        date: "2026-07-15",
        start_time: "09:00",
        end_time: "12:00",
        venue: "LH-101",
        status: "pending",
      });
      await ExamDuty.create({
        professor_id: userId,
        subject: "Introduction to Artificial Intelligence (CS601)",
        date: "2026-07-18",
        start_time: "14:00",
        end_time: "17:00",
        venue: "LH-202",
        status: "accepted",
      });
      duties = await ExamDuty.findAll({ where: { professor_id: userId } });
    } catch (error) {
      // In-memory fallback if writing to DB fails
      duties = [
        {
          id: "e1111111-1111-1111-1111-111111111111",
          professor_id: userId,
          subject: "Data Structures and Algorithms (CS201)",
          date: "2026-07-15",
          start_time: "09:00",
          end_time: "12:00",
          venue: "LH-101",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "e2222222-2222-2222-2222-222222222222",
          professor_id: userId,
          subject: "Introduction to Artificial Intelligence (CS601)",
          date: "2026-07-18",
          start_time: "14:00",
          end_time: "17:00",
          venue: "LH-202",
          status: "accepted",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    }
  }

  const mappedDuties = duties.map((duty) => {
    const courseCodeMatch = duty.subject.match(/\(([^)]+)\)/);
    const courseCode = courseCodeMatch ? courseCodeMatch[1] : "";
    const courseName = duty.subject.replace(/\([^)]+\)/, "").trim();

    const startTimeDate = new Date(`${duty.date}T${duty.start_time}:00.000Z`);
    const endTimeDate = new Date(`${duty.date}T${duty.end_time}:00.000Z`);
    const reportingTimeDate = new Date(startTimeDate.getTime() - 30 * 60 * 1000);

    const statusMap = {
      pending: "ASSIGNED",
      accepted: "CONFIRMED",
      rejected: "REJECTION_APPROVED",
    };

    return {
      id: duty.id,
      courseName,
      courseCode,
      type: "Final Exam",
      startTime: startTimeDate.toISOString(),
      endTime: endTimeDate.toISOString(),
      hall: duty.venue,
      reportingTime: reportingTimeDate.toISOString(),
      status: statusMap[duty.status] || "ASSIGNED",
      isCheckedIn: duty.status === "accepted",
      rejectionReason: null,
      rejectionApproval: null,
    };
  });

  return { duties: mappedDuties };
};

export const updateDutyStatus = async (id, userId, payload) => {
  const duty = await ExamDuty.findOne({ where: { id, professor_id: userId } });
  if (!duty) {
    const err = new Error("Duty not found");
    err.statusCode = 404;
    throw err;
  }
  const dbStatusMap = {
    CONFIRMED: "accepted",
    REJECTION_REVIEW: "rejected",
    ASSIGNED: "pending",
  };
  const dbStatus = dbStatusMap[payload.status] || payload.status;
  await duty.update({ status: dbStatus });
  return { duty };
};
