import express from "express";
import cors from "cors";
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
import departmentResearchRoutes from "./modules/department-research/department-research-routes.js";
import analyticsRoutes from "./modules/analytics/analytics-routes.js";
import reportsRoutes from "./modules/reports/reports-routes.js";
import approvalsRoutes from "./modules/approvals/approvals-routes.js";
import notificationsRoutes from "./modules/notifications/notifications-routes.js";

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
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/department", departmentRoutes);
app.use("/api/v1/department/overview", departmentOverviewRoutes);
app.use("/api/v1/department/courses", departmentCoursesRoutes);
app.use("/api/v1/department/faculty", departmentFacultyRoutes);
app.use("/api/v1/department/students", departmentStudentsRoutes);
app.use("/api/v1/department/placements", departmentPlacementsRoutes);
app.use("/api/v1/department/research", departmentResearchRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/reports", reportsRoutes);
app.use("/api/v1/approvals", approvalsRoutes);
app.use("/api/v1/notifications", notificationsRoutes);

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
