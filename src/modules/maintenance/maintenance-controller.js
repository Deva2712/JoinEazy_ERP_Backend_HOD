// src/modules/maintenance/maintenance-controller.js
import { asyncHandler } from "../../middleware/error.middleware.js";
import * as svc from "./maintenance-service.js";
import User from "../auth/auth-model.js";

export const getMyRequests = asyncHandler(async (req, res) =>
  res.json({ success: true, data: await svc.getMyRequests(req.user.id, req.user.role) })
);

export const createRequest = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: ["id", "name"] });
  const data = await svc.createRequest(req.body, { id: req.user.id, name: user?.name || "Unknown" });
  res.status(201).json({ success: true, data });
});

export const updateStatus = asyncHandler(async (req, res) =>
  res.json({ success: true, data: await svc.updateStatus(req.params.requestId, req.body, req.user.id, req.user.role) })
);
