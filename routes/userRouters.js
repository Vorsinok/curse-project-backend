import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  listUsers,
  listUsersForAccess,
  setRole,
  setBlocked,
  getUserById,
} from "../controllers/userController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();


router.get("/list-for-access", authenticateToken, listUsersForAccess);

router.get("/", authenticateToken, requireAdmin, listUsers);
router.get("/:id", authenticateToken, getUserById);
router.patch("/:id/role", authenticateToken, requireAdmin, setRole);
router.patch("/:id/blocked", authenticateToken, requireAdmin, setBlocked);

export default router;
