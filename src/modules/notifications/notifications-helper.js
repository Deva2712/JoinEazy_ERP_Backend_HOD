import Notification from "./notifications-model.js";

export const notifyHod = async ({ category, title, message, priority = "MEDIUM", scope = "hod" }) => {
  try {
    await Notification.create({ category, title, message, priority, scope, is_read: false });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};
