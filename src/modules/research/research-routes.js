// src/modules/research/research-routes.js
import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import * as ctrl from "./research-controller.js";

const router = express.Router();
router.use(protect);
router.use(authorize("professor", "admin", "hod"));

// Dashboard
router.get("/",                             ctrl.dashboard);
router.get("/dashboard-sync",           ctrl.dashboard);

// CRUD
router.post("/create",                  ctrl.create);
router.post("/grants/create",           ctrl.createGrantRequest);
router.put("/update/:id",               ctrl.update);

// Roles
router.post("/:researchId/roles/create",             ctrl.createRole);
router.put("/:researchId/roles/update/:roleIndex",   ctrl.updateRole);
router.delete("/:researchId/roles/delete/:roleId",   ctrl.deleteRole);

// Timeline
router.get("/timeline/:researchId",                  ctrl.getTimeline);
router.post("/timeline/:researchId",                 ctrl.addTimelineEvent);
router.put("/timeline/:researchId/:eventId",         ctrl.updateTimelineEvent);
router.delete("/timeline/:researchId/:eventId",      ctrl.deleteTimelineEvent);

// Applications
router.post("/apply/:id",                            ctrl.apply);
router.post("/star/:id",                             ctrl.star);
router.post("/applications/:applicationId/:action",  ctrl.handleApplication);

// Users
router.get("/users",                                 ctrl.getUsers);
router.get("/users/profile/:userId",                 ctrl.getUserProfile);
router.get("/users/:userId",                         ctrl.getUserById);
router.put("/users/profile/update/:userId",          ctrl.updateUserProfile);

router.get("/:id",                                   ctrl.getById);

export default router;
