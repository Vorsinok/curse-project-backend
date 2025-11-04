import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { Inventory } from "./Inventory.js";

export const Item = sequelize.define(
  "Item",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    customId: { type: DataTypes.STRING, allowNull: false },
    likedBy: { type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: [] },
    version: { type: DataTypes.INTEGER, defaultValue: 0 }
  },
  { indexes: [{ unique: true, fields: ["inventoryId", "customId"] }] }
);

Item.belongsTo(Inventory, { as: "inventory", foreignKey: "inventoryId" });
Inventory.hasMany(Item, { as: "items", foreignKey: "inventoryId" });
