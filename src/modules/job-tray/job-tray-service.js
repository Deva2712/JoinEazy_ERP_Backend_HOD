import RevaluationRequest from "../revaluation/revaluation-model.js";
import { Schedule, MeetingRequest } from "../schedule/schedule-model.js";
import { AttendanceLog } from "../cohort-attendance/cohort-attendance-model.js";
import GrantRequest from "../department-research/grant-request-model.js";
import { AssetRequest } from "../asset-request/asset-request-model.js";

export const getJobTray = async (userId, userRole) => {
  let revalJobs = [];
  try {
    const requests = await RevaluationRequest.findAll({
      where: {
        professor_id: userId,
        status: ["Pending", "UnderReview"]
      }
    });
    revalJobs = requests.map(r => {
      const description = `Revaluation application for ${r.subject_name}. Reason: ${r.reason || "N/A"}`;
      const dueContext = `Original marks: ${r.original_marks}/${r.max_marks || 100}`;
      return {
        id: r.id,
        type: "REVALUATION",
        title: `Revaluation Request: ${r.subject_code}`,
        description,
        dueContext,
        statusNote: `${description} | ${dueContext}`,
        link: "/revaluation",
        createdAt: r.createdAt || r.created_at,
      };
    });
  } catch (err) {
    console.warn("Job Tray - Failed to fetch Revaluation requests:", err.message);
  }

  let meetingJobs = [];
  try {
    const requests = await MeetingRequest.findAll({
      where: {
        professor_id: userId,
        status: "pending",
        initiated_by: "student"
      }
    });
    meetingJobs = requests.map(r => {
      const description = r.message || `Proposed meeting with student.`;
      const dueContext = r.proposed_time ? `Proposed: ${new Date(r.proposed_time).toLocaleString()}` : "Pending confirmation";
      return {
        id: r.id,
        type: "MEETING_REQUEST",
        title: `Meeting Request: ${r.title}`,
        description,
        dueContext,
        statusNote: `${description} | ${dueContext}`,
        link: "/schedule/requests",
        createdAt: r.createdAt || r.created_at,
      };
    });
  } catch (err) {
    console.warn("Job Tray - Failed to fetch Meeting requests:", err.message);
  }

  let attendanceJobs = [];
  try {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayDayName = days[new Date().getDay()];
    
    const schedules = await Schedule.findAll({
      where: {
        professor_id: userId,
        type: "class",
        day: todayDayName
      }
    });

    if (schedules.length > 0) {
      const localDate = new Date();
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      const cohortIds = [...new Set(schedules.map(s => s.cohort_id).filter(Boolean))];
      const logs = await AttendanceLog.findAll({
        where: {
          cohort_id: cohortIds,
          date: todayStr
        }
      });
      const loggedCohortIds = new Set(logs.map(l => l.cohort_id));

      const processedCohorts = new Set();
      schedules.forEach(s => {
        if (s.cohort_id && !loggedCohortIds.has(s.cohort_id) && !processedCohorts.has(s.cohort_id)) {
          processedCohorts.add(s.cohort_id);
          const description = `Attendance is not marked yet for class today.`;
          const dueContext = `Class: ${s.start_time} - ${s.end_time}`;
          attendanceJobs.push({
            id: s.id,
            type: "ATTENDANCE",
            title: `Mark Attendance: ${s.title}`,
            description,
            dueContext,
            statusNote: `${description} | ${dueContext}`,
            link: `/attendance-management/mark/${s.cohort_id}`,
            createdAt: s.createdAt || s.created_at || new Date(),
          });
        }
      });
    }
  } catch (err) {
    console.warn("Job Tray - Failed to fetch Attendance jobs:", err.message);
  }

  let grantJobs = [];
  if (userRole === "hod" || userRole === "admin") {
    try {
      const requests = await GrantRequest.findAll({
        where: {
          status: "Pending"
        }
      });
      grantJobs = requests.map(r => {
        const description = `Pending research funding approval. Justification: ${r.justification || "N/A"}`;
        const dueContext = `Amount: INR ${r.amount_inr?.toLocaleString()}`;
        return {
          id: r.id,
          type: "RESEARCH_GRANT",
          title: `Research Grant: ${r.title}`,
          description,
          dueContext,
          statusNote: `${description} | ${dueContext}`,
          link: "/research-publications/grants",
          createdAt: r.createdAt || r.created_at || r.requested_at,
        };
      });
    } catch (err) {
      console.warn("Job Tray - Failed to fetch Grant requests:", err.message);
    }
  }

  let assetJobs = [];
  if (userRole === "hod" || userRole === "admin") {
    try {
      const requests = await AssetRequest.findAll({
        where: {
          status: "Pending"
        }
      });
      assetJobs = requests.map(r => {
        const description = `Requested by ${r.requester_name}. Reason: ${r.reason || "N/A"}`;
        const dueContext = r.date ? `Date: ${r.date} (${r.start_time} - ${r.end_time})` : "Pending duration";
        return {
          id: r.id,
          type: "ASSET_REQUEST",
          title: `Asset Booking: ${r.asset_name || r.type}`,
          description,
          dueContext,
          statusNote: `${description} | ${dueContext}`,
          link: "/asset-requests",
          createdAt: r.createdAt || r.created_at || r.posted_at,
        };
      });
    } catch (err) {
      console.warn("Job Tray - Failed to fetch Asset requests:", err.message);
    }
  }

  const combined = [
    ...revalJobs,
    ...meetingJobs,
    ...attendanceJobs,
    ...grantJobs,
    ...assetJobs
  ];

  combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return {
    total: combined.length,
    jobs: combined
  };
};
