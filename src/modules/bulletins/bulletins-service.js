// src/modules/bulletins/bulletins-service.js

import { Op } from "sequelize";
import Bulletin from "./bulletins-model.js";

// ─── Helper: shape bulletin for frontend ─────────────────────────────────────
const transform = (b) => {
  const json = b.toJSON ? b.toJSON() : b;
  return {
    id:          json.id,
    title:       json.title,
    content:     json.content,
    level:       json.level,
    priority:    json.priority,
    is_pinned:   json.is_pinned,
    pinned:      json.is_pinned,
    cohortId:    json.cohort_id || null,
    cohort_id:   json.cohort_id || null,
    department:  json.department || null,
    author:      json.author_name,
    author_id:   json.author_id,
    attachments: json.attachments || [],  
    createdAt:  json.createdAt || json.created_at || new Date().toISOString(),
    created_at: json.createdAt || json.created_at || new Date().toISOString(),
    date:       json.createdAt || json.created_at || new Date().toISOString(),
    facultyOnly:  json.faculty_only || false,
    faculty_only: json.faculty_only || false,
    batch:       json.batch || null,
    year:        json.year || null,
    courseName:  json.course_name || null,
  };
};

// ─── GET bulletins (with optional filters) ───────────────────────────────────
export const getBulletins = async (query = {}) => {
  const where = {};

  if (query.level     && query.level !== "all")     where.level    = query.level;
  if (query.priority  && query.priority !== "all")  where.priority = query.priority;
  if (query.cohort_id)                              where.cohort_id = query.cohort_id;
  if (query.department)                             where.department = query.department;

  const bulletins = await Bulletin.findAll({
    where,
    order: [
      ["is_pinned", "DESC"],
      ["created_at", "DESC"],
    ],
  });

  return bulletins.map(transform);
};

// ─── CREATE bulletin ──────────────────────────────────────────────────────────
export const createBulletin = async (data, author) => {
  // attachment from frontend is a single file object { name, url }
  // We store it as an array for consistency with the frontend shape
  let attachments = [];
  if (data.attachment) {
    attachments = [{ name: data.attachment.name || "Attachment", url: data.attachment.url || "" }];
  }
  if (data.attachments && Array.isArray(data.attachments)) {
    attachments = data.attachments;
  }

  const bulletin = await Bulletin.create({
    author_id:    author.id,
    author_name:  author.name,
    title:        data.title.trim(),
    content:      data.content.trim(),
    level:        data.level       || "institution",
    priority:     data.priority    || "Normal",
    is_pinned:    data.is_pinned   || false,
    cohort_id:    data.courseId    || data.cohortId || data.cohort_id || null,
    department:   data.department  || null,
    faculty_only: data.faculty_only || false,
    batch:        data.batch || null,
    year:         data.year || null,
    course_name:  data.courseName || null,
    attachments,
  });

  return transform(bulletin);
};

// ─── TOGGLE PIN bulletin ──────────────────────────────────────────────────────
export const togglePin = async (bulletinId, isPinned) => {
  const bulletin = await Bulletin.findByPk(bulletinId);
  if (!bulletin) {
    const e = new Error("Bulletin not found");
    e.statusCode = 404;
    throw e;
  }

  if (isPinned) {
    // Unpin all other bulletins
    await Bulletin.update({ is_pinned: false }, { where: {} });
  }

  await bulletin.update({ is_pinned: isPinned });
  return transform(bulletin);
};

// ─── DELETE bulletin ──────────────────────────────────────────────────────────
export const deleteBulletin = async (bulletinId, userId, userRole) => {
  const bulletin = await Bulletin.findByPk(bulletinId);
  if (!bulletin) {
    const e = new Error("Bulletin not found");
    e.statusCode = 404;
    throw e;
  }

  // Only author, admin, or HOD can delete
  if (bulletin.author_id !== userId && userRole !== "admin" && userRole !== "professor" && userRole !== "hod") {
    const e = new Error("Not authorized to delete this bulletin");
    e.statusCode = 403;
    throw e;
  }

  await bulletin.destroy();
  return { deleted: true };
};
