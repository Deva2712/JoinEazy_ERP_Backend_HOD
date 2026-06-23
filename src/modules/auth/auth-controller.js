import { registerUser, loginUser } from "./auth-service.js";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { protect } from "../../middleware/auth.middleware.js";
import User from "./auth-model.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // development — not HTTPS
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const result = await registerUser({ name, email, password, role });
  res.cookie("token", result.token, COOKIE_OPTIONS);
  res.status(201).json({ success: true, ...result });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });
  res.cookie("token", result.token, COOKIE_OPTIONS);
  res.status(200).json({ success: true, user: result.user });
});

export const status = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  res.status(200).json({ success: true, user: user.toJSON() });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});
