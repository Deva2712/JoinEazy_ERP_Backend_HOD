import { asyncHandler } from "../../middleware/error.middleware.js";
import * as service from "./session-planning-service.js";

export const schedules = asyncHandler(async (req, res) => {
  const data = await service.getSchedules(req.user.id);
  res.json({ success: true, data });
});

export const today = asyncHandler(async (req, res) => {
  const data = await service.getTodaySessions(req.user.id);
  res.json({ success: true, data });
});

export const getReflections = asyncHandler(async (req, res) => {
  const data = await service.getReflections(req.user.id);
  res.json({ success: true, data });
});

export const createReflection = asyncHandler(async (req, res) => {
  const data = await service.createReflection(req.user.id, req.body);
  res.status(201).json({ success: true, data });
});

export const documents = asyncHandler(async (req, res) => {
  const data = await service.getDocuments(req.params.courseId);
  res.json({ success: true, data });
});

export const bulkDocuments = asyncHandler(async (req, res) => {
  const data = await service.bulkCreateDocuments(
    req.params.courseId,
    req.user.id,
    req.body.documents || req.body.docs || req.body,
    req.body.fileNames || {}
  );
  res.status(201).json({ success: true, data });
});
