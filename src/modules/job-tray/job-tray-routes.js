import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import { getPendingJobs } from "./job-tray-controller.js";

const router = express.Router();
router.use(protect);
router.use(authorize("professor", "admin", "hod"));
router.get("/", getPendingJobs);

export default router;
