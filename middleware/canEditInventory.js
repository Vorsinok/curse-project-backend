import { Inventory, InventoryAccess } from "../models/index.js";

export const canEditInventory = async (req, res, next) => {
  try {
    const inventoryId = Number(req.body.inventoryId || req.params.inventoryId || req.params.id);
    if (!inventoryId) return res.status(400).json({ error: "inventoryId is required" });

    const inv = await Inventory.findByPk(inventoryId);
    if (!inv) return res.status(404).json({ error: "Inventory not found" });

    if (req.user?.role === "ADMIN") return next();
    if (inv.userId === req.user?.id) return next();

    const access = await InventoryAccess.findOne({
      where: { inventoryId, userId: req.user.id, canEdit: true },
    });
    if (!access) return res.status(403).json({ error: "No edit permission for this inventory" });

    next();
  } catch (e) {
    next(e);
  }
};
