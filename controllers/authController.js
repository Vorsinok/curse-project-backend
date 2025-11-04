import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import { signToken } from "../middleware/jwt.js";

export const register = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: "username, email, password are required" });
  }

  const exists = await User.unscoped().findOne({ where: { email } });
  if (exists) return res.status(409).json({ error: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.unscoped().create({
    email,
    username,
    passwordHash,
    role: "USER",
    provider: "local"
  });

  const token = signToken(user);
  res.status(201).json({ token, user: await User.findByPk(user.id) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.unscoped().findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  if (user.blocked) return res.status(403).json({ error: "User is blocked" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(user);
  res.json({ token, user: await User.findByPk(user.id) });
});

export const profile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.json({ user });
});

export const oauthSuccess = asyncHandler(async (req, res) => {
  const token = signToken(req.user);
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
  res.redirect(`${FRONTEND_URL}/oauth-callback?token=${encodeURIComponent(token)}`);
});
