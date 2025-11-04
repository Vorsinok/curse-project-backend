import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/index.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const username = profile.displayName || email?.split("@")[0] || `google_${profile.id}`;

        let user = await User.unscoped().findOne({ where: { email } });
        if (!user) {
          user = await User.unscoped().create({
            email,
            username,
            provider: "google",
            passwordHash: "oauth"
          });
        }
        return done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: `${BACKEND_URL}/api/auth/github/callback`,
      scope: ["user:email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value ||
          `${profile.username || "gh"}@users.noreply.github.com`;
        const username = profile.username || `github_${profile.id}`;

        let user = await User.unscoped().findOne({ where: { email } });
        if (!user) {
          user = await User.unscoped().create({
            email,
            username,
            provider: "github",
            passwordHash: "oauth"
          });
        }
        return done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});
