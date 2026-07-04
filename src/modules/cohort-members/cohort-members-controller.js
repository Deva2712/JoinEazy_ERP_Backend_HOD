// src/modules/cohort-members/cohort-members-controller.js
import { asyncHandler } from "../../middleware/error.middleware.js";
import * as svc from "./cohort-members-service.js";

export const getMembers   = asyncHandler(async (req, res) => res.json({ success: true, data: await svc.getMembers(req.params.cohortId, req.query) }));
export const addMember    = asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await svc.addMember(req.params.cohortId, req.body) }));
export const removeMember = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.body.userId || req.query.userId;
  if (!userId) return res.status(400).json({ success: false, message: "userId is required" });
  await svc.removeMember(req.params.cohortId, userId);
  res.json({ success: true, message: "Member removed" });
});
