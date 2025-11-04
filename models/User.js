import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

export const User = sequelize.define(
  "User",
  {
    username: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true }
    },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("USER", "ADMIN"),
      defaultValue: "USER"
    },
    blocked: { type: DataTypes.BOOLEAN, defaultValue: false },
    provider: {
      type: DataTypes.ENUM("local", "google", "github"),
      defaultValue: "local"
    }
  },
  {
    defaultScope: { attributes: { exclude: ["passwordHash"] } },
    scopes: { withSecret: {} }
  }
);
