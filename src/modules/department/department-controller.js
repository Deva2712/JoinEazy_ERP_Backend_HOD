import {
  getDepartment as getDepartmentService,
  createDepartment as createDepartmentService,
  updateDepartment as updateDepartmentService,
  deleteDepartment as deleteDepartmentService
} from "./department-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

export const getDepartment = asyncHandler(async (req, res) => {
  const data = await getDepartmentService();
  res.status(200).json({ success: true, data });
});

export const createDepartment = asyncHandler(async (req, res) => {
  const data = await createDepartmentService(req.body);
  res.status(201).json({ success: true, data });
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const data = await updateDepartmentService(req.params.id, req.body);
  if (!data) {
    return res.status(404).json({ success: false, message: "Department not found" });
  }
  res.status(200).json({ success: true, data });
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const data = await deleteDepartmentService(req.params.id);
  if (!data) {
    return res.status(404).json({ success: false, message: "Department not found" });
  }
  res.status(200).json({ success: true, data });
});

export default {};
