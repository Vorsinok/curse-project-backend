import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import { User } from "./User.js";
import { Inventory } from "./Inventory.js";

export const InventoryAccess = sequelize.define("InventoryAccess", {
  canEdit: { type: DataTypes.BOOLEAN, defaultValue: true }
});

User.belongsToMany(Inventory, {
  through: InventoryAccess,
  as: "accessibleInventories",
  foreignKey: "userId",
});
Inventory.belongsToMany(User, {
  through: InventoryAccess,
  as: "sharedUsers",
  foreignKey: "inventoryId",
});
