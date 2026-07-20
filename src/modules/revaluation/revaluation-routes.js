import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import * as ctrl from "./revaluation-controller.js";

// Professor router
const professorRouter = express.Router();
professorRouter.use(protect);
professorRouter.use(authorize("professor", "admin", "hod"));

professorRouter.get("/revaluation/overview", ctrl.profOverview);
professorRouter.get("/revaluation/requests", ctrl.profRequests);
professorRouter.post("/revaluation/requests/:requestId/accept", ctrl.accept);
professorRouter.post("/revaluation/requests/:requestId/reject", ctrl.reject);
professorRouter.post("/revaluation/requests/:requestId/result", ctrl.result);
professorRouter.delete("/revaluation/requests/:requestId", ctrl.deleteRequest);

// Student router
const studentRouter = express.Router();
studentRouter.use(protect);

studentRouter.get("/revaluation/overview", ctrl.studentOverview);
studentRouter.get("/revaluation/requests", ctrl.studentRequests);
studentRouter.get("/revaluation/subjects", ctrl.subjects);
studentRouter.post("/revaluation/requests", ctrl.createRequest);
studentRouter.delete("/revaluation/requests/:requestId", ctrl.cancelRequest);

export { professorRouter, studentRouter };
