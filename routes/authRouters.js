import { Router } from "express";
import passport from "passport";
import { register, login, profile, oauthSuccess } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateToken, profile);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/auth/failed" }),
  oauthSuccess
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/api/auth/failed" }),
  oauthSuccess
);

router.get("/failed", (req, res) => res.status(401).json({ error: "OAuth failed" }));

export default router;
