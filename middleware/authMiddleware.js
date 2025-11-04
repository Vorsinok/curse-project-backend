import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const authenticateToken = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.unscoped().findByPk(decoded.id);
    if (!user || user.blocked) return res.status(403).json({ error: "User blocked or not found" });
    req.user = decoded; 
    next();
  } catch {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ error: "Insufficient rights" });
  next();
};
