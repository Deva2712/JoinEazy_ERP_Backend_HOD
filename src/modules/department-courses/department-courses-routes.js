import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  getAllCourses,
  getCourseDetails,
  getCourseDocuments,
  updateCourse,
  createCourse,
} from "./department-courses-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("hod", "admin"));

router.get("/", getAllCourses);
router.post("/", createCourse);
router.get("/:id", getCourseDetails);
router.get("/:id/documents", getCourseDocuments);
router.put("/:id", updateCourse);

export default router;
