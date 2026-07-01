import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import * as ctrl from "./schedule-controller.js";

const router = express.Router();
router.use(protect);
router.use(authorize("professor", "admin", "hod"));

// Schedule overview (timetable + office hours + meetings)
router.get("/schedule", ctrl.getSchedule);
router.put("/schedule", ctrl.addSchedule);

// Meeting requests
router.post("/schedule/meetings/direct", ctrl.createDirectMeetingHandler);
router.post("/schedule/meetings", ctrl.addManualEventHandler);
router.get("/schedule/meetings", ctrl.getMeetings);
router.post("/schedule/meetings/:requestId/accept", ctrl.acceptMeeting);
router.post("/schedule/meetings/:requestId/reject", ctrl.rejectMeeting);
router.post("/schedule/meetings/:requestId/reschedule", ctrl.rescheduleMeeting);
router.post("/schedule/requests/outgoing", ctrl.createOutgoingRequestHandler);

// STUB ROUTE PRESERVATION
router.get("/schedules", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      schedules: [],
      timetable: []
    }
  });
});

export default router;
