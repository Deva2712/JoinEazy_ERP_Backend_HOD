import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import * as ctrl from "./session-planning-controller.js";

const router = express.Router();

router.use(protect);

router.get("/schedules", ctrl.schedules);
router.get("/today", ctrl.today);
router.get("/reflections", ctrl.getReflections);
router.post("/reflections", ctrl.createReflection);
router.get("/documents/:courseId", ctrl.documents);
router.post("/documents/:courseId/bulk", authorize("professor", "admin", "hod"), ctrl.bulkDocuments);

export default router;
