import express from "express";
import cors from "cors";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

import authRoutes from "./routes/authRouters.js";
import userRoutes from "./routes/userRouters.js";
import inventoryRoutes from "./routes/inventoryRouters.js";
import itemRoutes from "./routes/itemRouters.js";

import "./config/passport.js";
import dotenv from "dotenv";

dotenv.config(); 

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN || "http://localhost:3001",
  "http://127.0.0.1:3001",
  "https://curse-project-frontend.vercel.app",
  "https://curse-project-frontend-1tc9mv1zx-vorsinoks-projects.vercel.app", 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); 
      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.warn(`CORS BLOCKED: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
  })
);

app.options("*", cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/inventories", inventoryRoutes);
app.use("/api/items", itemRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running successfully!" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

export default app;
