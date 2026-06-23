import express from "express";
import { register, login, status, logout } from "./auth-controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/status", protect, status);
router.post("/logout", logout);

export default router;
