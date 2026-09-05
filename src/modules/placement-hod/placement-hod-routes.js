import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  getHodActiveDrives,
  getHodCurrentStudents,
  getHodPlacementOverview,
} from "./placement-hod-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("hod", "admin"));

router.get("/overview", getHodPlacementOverview);
router.get("/current-students", getHodCurrentStudents);
router.get("/active-drives", getHodActiveDrives);

export default router;
