import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import { User } from "./User.js";

export const Inventory = sequelize.define("Inventory", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: true }
});

Inventory.belongsTo(User, { as: "owner", foreignKey: "userId" });
User.hasMany(Inventory, { as: "inventories", foreignKey: "userId" });
