import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from "./department-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("hod", "admin"));

router.get("/", getDepartment);
router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
