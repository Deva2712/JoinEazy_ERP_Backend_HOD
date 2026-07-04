// src/modules/cohort-resources/cohort-resources-routes.js
import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import * as ctrl from "./cohort-resources-controller.js";

const router = express.Router({ mergeParams: true });
router.use(protect);

router.get("/", ctrl.getResources);   // GET  /cohort/:cohortId/resources
router.post("/week", authorize("professor", "admin", "hod"), ctrl.createWeek);     // POST /resources/week
router.put("/week/:weekId", authorize("professor", "admin", "hod"), ctrl.updateWeek);     // PUT  /resources/week/:weekId
router.delete("/week/:weekId", authorize("professor", "admin", "hod"), ctrl.deleteWeek);     // DELETE
router.post("/week/:weekId", authorize("professor", "admin", "hod"), ctrl.createResource); // POST /resources/week/:weekId (add resource to week)
router.put("/:resourceId", authorize("professor", "admin", "hod"), ctrl.updateResource); // PUT  /resources/:resourceId
router.delete("/:resourceId", authorize("professor", "admin", "hod"), ctrl.deleteResource); // DELETE

export default router;
