import { getHODDashboardOverview } from "./dashboard-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

export const getHODDashboard = asyncHandler(async (req, res) => {
  const data = await getHODDashboardOverview(req.user.id);
  res.status(200).json({ success: true, ...data });
});
