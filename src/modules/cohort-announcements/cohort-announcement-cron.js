// src/modules/cohort-announcements/cohort-announcements-cron.js

import cron from "node-cron";
import { autoArchiveOldAnnouncements } from "./cohort-announcements-service.js";
import { CohortAnnouncement } from "./cohort-announcements-model.js";
import { Cohort } from "../cohort/cohort-model.js";

// Runs every day at midnight — auto-archives announcements older than 2 days
cron.schedule("0 0 * * *", async () => {
  try {
    const announcements = await CohortAnnouncement.findAll({
      where: { is_archived: false },
      attributes: ["cohort_id"],
      group: ["cohort_id"]
    });
    const cohortIds = announcements.map(a => a.cohort_id);

    for (const cohortId of cohortIds) {
      await autoArchiveOldAnnouncements(cohortId);
    }
    console.log("[CRON] Auto-archive announcements: done");
  } catch (err) {
    console.error("[CRON] Auto-archive announcements failed:", err.message);
  }
});
