import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT || 3000),

  DB_URL: process.env.DB_URL,

  JWT_SECRET: process.env.JWT_SECRET || "dev_secret",

  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  FRONTEND_URL: process.env.FRONTEND_URL,
};
