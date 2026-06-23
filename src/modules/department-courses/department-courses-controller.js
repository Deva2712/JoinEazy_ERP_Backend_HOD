import {
  getAllCourses as getAllCoursesService,
  getCourseDetails as getCourseDetailsService,
  getCourseDocuments as getCourseDocumentsService,
  updateCourse as updateCourseService,
  createCourse as createCourseService
} from "./department-courses-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

export const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await getAllCoursesService();
  res.status(200).json({ success: true, data: courses });
});

export const getCourseDetails = asyncHandler(async (req, res) => {
  const course = await getCourseDetailsService(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: "Course not found" });
  }
  res.status(200).json({ success: true, data: course });
});

export const getCourseDocuments = asyncHandler(async (req, res) => {
  const documents = await getCourseDocumentsService(req.params.id);
  if (!documents) {
    return res.status(404).json({ success: false, message: "Course not found" });
  }
  res.status(200).json({ success: true, data: documents });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const updatedCourse = await updateCourseService(req.params.id, req.body);
  if (!updatedCourse) {
    return res.status(404).json({ success: false, message: "Course not found" });
  }
  res.status(200).json({ success: true, data: updatedCourse });
});

export const createCourse = asyncHandler(async (req, res) => {
  const result = await createCourseService(req.body);
  res.status(201).json({ success: true, data: result });
});

export default {};
