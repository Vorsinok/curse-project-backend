import asyncHandler from "express-async-handler";
import { Inventory, InventoryAccess, User } from "../models/index.js";

export const listEditors = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const inv = await Inventory.findByPk(id);
  if (!inv) return res.status(404).json({ error: "Inventory not found" });

  if (req.user.role !== "ADMIN" && inv.userId !== req.user.id)
    return res.status(403).json({ error: "Access denied" });

  const rows = await InventoryAccess.findAll({
    where: { inventoryId: id },
    include: [{ model: User, attributes: ["id", "username", "email"] }],
  });

  res.json(rows.map(r => ({
    userId: r.userId,
    canEdit: r.canEdit,
    user: r.User
  })));
});

export const addEditor = asyncHandler(async (req, res) => {
  const inventoryId = Number(req.params.id);
  const { userId } = req.body;
  const inventory = await Inventory.findByPk(inventoryId);
  if (!inventory) {
    return res.status(404).json({ error: "Inventory not found" });
  }

  if (req.user.role !== "ADMIN" && inventory.userId !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const existingAccess = await InventoryAccess.findOne({
    where: { userId, inventoryId },
  });

  if (existingAccess) {
    return res.status(400).json({ error: "User already has access" });
  }

  const access = await InventoryAccess.create({ userId, inventoryId });
  res.status(201).json({ message: "Access granted", access });
});
export const removeEditor = asyncHandler(async (req, res) => {
  const inventoryId = Number(req.params.id);
  const userId = Number(req.params.userId);

  const inv = await Inventory.findByPk(inventoryId);
  if (!inv) return res.status(404).json({ error: "Inventory not found" });

  if (req.user.role !== "ADMIN" && inv.userId !== req.user.id)
    return res.status(403).json({ error: "Access denied" });

  await InventoryAccess.destroy({ where: { inventoryId, userId } });
  res.json({ success: true });
});
