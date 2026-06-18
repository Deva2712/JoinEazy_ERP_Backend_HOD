import {
  getNotifications as getNotificationsService,
  getNotificationById as getNotificationByIdService,
  markAsRead as markAsReadService,
  markAllAsRead as markAllAsReadService,
  getUnreadCount as getUnreadCountService
} from "./notifications-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const { scope, category, priority } = req.query;
  let is_read;
  if (req.query.is_read === "true") {
    is_read = true;
  } else if (req.query.is_read === "false") {
    is_read = false;
  }

  const result = await getNotificationsService({ scope, category, priority, is_read });
  res.status(200).json({ success: true, data: result });
});

export const getNotificationById = asyncHandler(async (req, res) => {
  const result = await getNotificationByIdService(req.params.id);
  if (!result) {
    return res.status(404).json({ success: false, message: "Notification not found" });
  }
  res.status(200).json({ success: true, data: result });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const result = await markAsReadService(req.params.id);
  if (!result) {
    return res.status(404).json({ success: false, message: "Notification not found" });
  }
  res.status(200).json({ success: true, data: result });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const { scope } = req.query;
  const result = await markAllAsReadService({ scope });
  res.status(200).json({ success: true, data: result });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const { scope } = req.query;
  const result = await getUnreadCountService({ scope });
  res.status(200).json({ success: true, data: result });
});

export default {};
