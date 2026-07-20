// src/modules/library/library-controller.js
import { asyncHandler } from "../../middleware/error.middleware.js";
import * as svc from "./library-service.js";
import User from "../auth/auth-model.js";

export const getLibraryDashboard = asyncHandler(async (req, res) =>
  res.json({ success: true, data: await svc.getLibraryDashboard(req.user.id) })
);

export const requestBook = asyncHandler(async (req, res) => {
  const { bookId, durationDays } = req.body;
  const user = await User.findByPk(req.user.id);
  const name = user ? user.name : "Unknown User";
  res.status(201).json({ success: true, data: await svc.requestBook(bookId, durationDays, { id: req.user.id, name }) });
});

export const cancelRequest = asyncHandler(async (req, res) => {
  await svc.cancelRequest(req.params.requestId, req.user.id);
  res.json({ success: true, message: "Cancelled" });
});

export const returnBook = asyncHandler(async (req, res) =>
  res.json({ success: true, data: await svc.returnBook(req.body.bookId, req.user.id) })
);

export const requestExtension = asyncHandler(async (req, res) => {
  const { bookId, additionalDays } = req.body;
  const user = await User.findByPk(req.user.id);
  const name = user ? user.name : "Unknown User";
  res.status(201).json({ success: true, data: await svc.requestExtension(bookId, additionalDays, { id: req.user.id, name }) });
});

export const approveExtension = asyncHandler(async (req, res) => {
  const { requestId, bookId, additionalDays } = req.body;
  res.json({ success: true, data: await svc.approveExtension(requestId, bookId, additionalDays) });
});
