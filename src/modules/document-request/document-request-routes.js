import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import * as ctrl from "./document-request-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("professor", "admin", "hod"));

// Frontend document-requests routes
router.get("/all", ctrl.getAllDocuments);
router.post("/status/:requestId", ctrl.respondToStudentRequest);
router.post("/registrar/process", ctrl.submitToRegistrar);
router.post("/registrar/upload/:lorId", ctrl.registrarUploadApproved);
router.post("/registrar/send/:lorId", ctrl.dispatchToStudent);

// stdFac compatibility routes
router.get("/overview", ctrl.getOverview);
router.get("/requests", ctrl.getRequests);
router.post("/requests", ctrl.createRequest);
router.delete("/requests/:requestId", ctrl.cancelRequest);
router.get("/lor", ctrl.getLorRequests);
router.post("/lor", ctrl.createLorRequest);
router.delete("/lor/:requestId", ctrl.cancelLorRequest);
router.post("/lor/:requestId/meeting", ctrl.scheduleLorMeeting);

export default router;
