import { asyncHandler } from "../../middleware/error.middleware.js";
import {
  getHodActiveDrives as getHodActiveDrivesService,
  getHodCurrentStudents as getHodCurrentStudentsService,
  getHodPlacementOverview as getHodPlacementOverviewService,
  parseBranchQuery,
} from "./placement-hod-service.js";

export const getHodPlacementOverview = asyncHandler(async (req, res) => {
  const data = await getHodPlacementOverviewService(parseBranchQuery(req.query));
  res.status(200).json({ success: true, data });
});

export const getHodCurrentStudents = asyncHandler(async (req, res) => {
  const data = await getHodCurrentStudentsService(parseBranchQuery(req.query));
  res.status(200).json({ success: true, data });
});

export const getHodActiveDrives = asyncHandler(async (req, res) => {
  const data = await getHodActiveDrivesService(parseBranchQuery(req.query));
  res.status(200).json({ success: true, data });
});
