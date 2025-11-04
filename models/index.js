import {User} from "./User.js";
import {Inventory} from "./Inventory.js";
import {InventoryAccess} from "./InventoryAccess.js";
import {Item} from "./Item.js";

User.hasMany(InventoryAccess, { foreignKey: "userId" });
InventoryAccess.belongsTo(User, { foreignKey: "userId" });

Inventory.hasMany(InventoryAccess, { foreignKey: "inventoryId" });
InventoryAccess.belongsTo(Inventory, { foreignKey: "inventoryId" });

Inventory.hasMany(Item, { foreignKey: "inventoryId" });
Item.belongsTo(Inventory, { foreignKey: "inventoryId" });

export { User, Inventory, InventoryAccess, Item };
