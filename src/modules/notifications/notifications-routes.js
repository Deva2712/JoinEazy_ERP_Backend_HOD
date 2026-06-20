import express from "express";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import {
  getNotifications,
  getUnreadCount,
  getNotificationById,
  markAsRead,
  markAllAsRead
} from "./notifications-controller.js";

const router = express.Router();

router.use(protect);
router.use(authorize("hod", "admin"));

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/mark-all-read", markAllAsRead);
router.get("/:id", getNotificationById);
router.post("/:id/read", markAsRead);

export default router;
