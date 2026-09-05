import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

// Route imports
import authRoutes from "./modules/auth/auth-routes.js";
import userRoutes from "./modules/user/user-routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard-routes.js";
import departmentRoutes from "./modules/department/department-routes.js";
import departmentOverviewRoutes from "./modules/department-overview/department-overview-routes.js";
import departmentCoursesRoutes from "./modules/department-courses/department-courses-routes.js";
import departmentFacultyRoutes from "./modules/department-faculty/department-faculty-routes.js";
import departmentStudentsRoutes from "./modules/department-students/department-students-routes.js";
import departmentPlacementsRoutes from "./modules/department-placements/department-placements-routes.js";
import placementHodRoutes from "./modules/placement-hod/placement-hod-routes.js";
import departmentResearchRoutes from "./modules/department-research/department-research-routes.js";
import analyticsRoutes from "./modules/analytics/analytics-routes.js";
import reportsRoutes from "./modules/reports/reports-routes.js";
import approvalsRoutes from "./modules/approvals/approvals-routes.js";
import notificationsRoutes from "./modules/notifications/notifications-routes.js";
import bulletinsRoutes from "./modules/bulletins/bulletins-routes.js";
import scheduleRoutes from "./modules/schedule/schedule-routes.js";
import sessionPlanningRoutes from "./modules/session-planning/session-planning-routes.js";
import leavesRoutes from "./modules/leaves/leaves-routes.js";
import jobTrayRoutes from "./modules/job-tray/job-tray-routes.js";
import examDutiesRoutes from "./modules/exam-duties/exam-duties-routes.js";
import libraryRoutes from "./modules/library/library-routes.js";
import researchRoutes from "./modules/research/research-routes.js";
import mentoringRoutes from "./modules/mentoring/mentoring-routes.js";
import documentRequestRoutes from "./modules/document-request/document-request-routes.js";
import assetRequestRoutes from "./modules/asset-request/asset-request-routes.js";
import maintenanceRoutes from "./modules/maintenance/maintenance-routes.js";
import expensesRoutes from "./modules/expenses/expenses-routes.js";
import advancesRoutes from "./modules/advances/advances-routes.js";
import payrollRoutes from "./modules/payroll/payroll-routes.js";
import calendarRoutes from "./modules/calendar/calendar-routes.js";
import { professorRouter as revalProfRoutes, studentRouter as revalStudentRoutes } from "./modules/revaluation/revaluation-routes.js";

// Cohort imports
import cohortRoutes from "./modules/cohort/cohort-routes.js";
import cohortAssignmentsRoutes from "./modules/cohort-assignments/cohort-assignments-routes.js";
import cohortAssignmentsGradeRoutes from "./modules/cohort-assignments/cohort-assignments-grade-routes.js";
import cohortAttendanceRoutes from "./modules/cohort-attendance/cohort-attendance-routes.js";
import cohortMembersRoutes from "./modules/cohort-members/cohort-members-routes.js";
import cohortResourcesRoutes from "./modules/cohort-resources/cohort-resources-routes.js";

// Middleware imports
import { errorHandler } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/logger.middleware.js";

const app = express();

// ─── Core Middleware ───────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/user/dashboard-overview", dashboardRoutes);
app.use("/api/v1/department", departmentRoutes);
app.use("/api/v1/department/overview", departmentOverviewRoutes);
app.use("/api/v1/department/courses", departmentCoursesRoutes);
app.use("/api/v1/department/faculty", departmentFacultyRoutes);
app.use("/api/v1/department/students", departmentStudentsRoutes);
app.use("/api/v1/department/placements", departmentPlacementsRoutes);
app.use("/api/v1/placement/hod", placementHodRoutes);
app.use("/api/v1/department/research", departmentResearchRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/reports", reportsRoutes);
app.use("/api/v1/approvals", approvalsRoutes);
app.use("/api/v1/notifications", notificationsRoutes);
app.use("/api/v1/bulletins", bulletinsRoutes);
app.use("/api/v1/sessions", sessionPlanningRoutes);
app.use("/api/v1/professor", scheduleRoutes);
app.use("/api/v1/leaves", leavesRoutes);
app.use("/api/v1/job-tray", jobTrayRoutes);
app.use("/api/v1/exams", examDutiesRoutes);
app.use("/api/v1/exam-duties", examDutiesRoutes);
app.use("/api/v1/library", libraryRoutes);
app.use("/api/v1/research", researchRoutes);
app.use("/api/v1/mentoring", mentoringRoutes);
app.use("/api/v1/documents", documentRequestRoutes);
app.use("/api/v1/assets", assetRequestRoutes);
app.use("/api/v1/maintenance", maintenanceRoutes);
app.use("/api/v1/finance/expenses", expensesRoutes);
app.use("/api/v1/finance/advances", advancesRoutes);
app.use("/api/v1/payroll", payrollRoutes);
app.use("/api/v1/calendar", calendarRoutes);
app.use("/api/v1/professor", revalProfRoutes);
app.use("/api/v1/student",   revalStudentRoutes);

app.use("/api/v1/cohort/assignments", cohortAssignmentsGradeRoutes);
app.use("/api/v1/cohort/:cohortId/assignments", cohortAssignmentsRoutes);
app.use("/api/v1/cohort/:cohortId/members", cohortMembersRoutes);
app.use("/api/v1/cohort/:cohortId/resources", cohortResourcesRoutes);
app.use("/api/v1/cohort", cohortRoutes);
app.use("/api/v1", cohortAttendanceRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    service: "HOD Backend",
    timestamp: new Date().toISOString() 
  });
});

// ─── Error Handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

export default app;
