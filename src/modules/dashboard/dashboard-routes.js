import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import { getHODDashboard } from "./dashboard-controller.js";

const router = express.Router();

router.get("/", protect, authorize("hod", "admin"), getHODDashboard);

export default router;
