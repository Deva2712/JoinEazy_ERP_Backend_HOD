import Notification from "./notifications-model.js";

export const getNotifications = async ({ scope, category, priority, is_read }) => {
  const where = {};
  if (scope !== undefined && scope !== null && scope !== "all" && scope !== "") {
    where.scope = scope;
  }
  if (category !== undefined && category !== null && category !== "") {
    where.category = category;
  }
  if (priority !== undefined && priority !== null && priority !== "") {
    where.priority = priority;
  }
  if (is_read !== undefined && is_read !== null) {
    where.is_read = is_read;
  }

  const result = await Notification.findAll({
    where,
    order: [["createdAt", "DESC"]]
  });

  const total = result.length;
  const unread_count = result.filter(n => !n.is_read).length;

  return {
    total,
    unread_count,
    notifications: result
  };
};

export const getNotificationById = async (id) => {
  const notif = await Notification.findByPk(id);
  return notif || null;
};

export const markAsRead = async (id) => {
  const notif = await Notification.findByPk(id);
  if (!notif) return null;
  
  notif.is_read = true;
  await notif.save();
  return notif;
};

export const markAllAsRead = async ({ scope }) => {
  const where = { is_read: false };
  if (scope !== undefined && scope !== null && scope !== "all" && scope !== "") {
    where.scope = scope;
  }

  const matchingRows = await Notification.findAll({ where });
  const updated_count = matchingRows.length;

  if (updated_count > 0) {
    await Notification.update({ is_read: true }, { where });
  }

  return { updated_count };
};

export const getUnreadCount = async ({ scope }) => {
  const where = { is_read: false };
  if (scope !== undefined && scope !== null && scope !== "all" && scope !== "") {
    where.scope = scope;
  }

  const unreadList = await Notification.findAll({ where });
  const total_unread = unreadList.length;

  const by_category = {};
  for (const notif of unreadList) {
    const cat = notif.category;
    if (cat) {
      by_category[cat] = (by_category[cat] || 0) + 1;
    }
  }

  return {
    total_unread,
    by_category
  };
};
