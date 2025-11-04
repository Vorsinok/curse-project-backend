import asyncHandler from "express-async-handler";
import { User } from "../models/index.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "username", "email", "role", "blocked", "provider"]
  });
  res.json(users);
});

export const setRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await User.unscoped().findByPk(id);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.role = role === "ADMIN" ? "ADMIN" : "USER";
  await user.save();
  res.json({ id: user.id, role: user.role });
});

export const setBlocked = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { blocked } = req.body;
  const user = await User.unscoped().findByPk(id);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.blocked = !!blocked;
  await user.save();
  res.json({ id: user.id, blocked: user.blocked });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id, {
    attributes: ["id", "username", "email", "role", "blocked", "provider"],
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
});

export const listUsersForAccess = asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const users = await User.findAll({
    attributes: ["id", "username", "email", "role"],
  });
  res.json(users);
});
