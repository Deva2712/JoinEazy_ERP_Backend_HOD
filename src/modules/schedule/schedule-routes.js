import express from "express";

const router = express.Router();

router.get("/overview", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      schedule: { timetable: [] },
      scheduledMeetings: [],
    },
  });
});

export default router;
