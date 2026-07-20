import * as service from "./job-tray-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

export const getPendingJobs = asyncHandler(async (req, res) => {
  const result = await service.getJobTray(req.user.id, req.user.role);
  res.status(200).json({ success: true, data: result.jobs });
});
