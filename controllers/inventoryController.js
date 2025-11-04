import asyncHandler from "express-async-handler";
import { Inventory, Item, InventoryAccess } from "../models/index.js";

export const searchInventories = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  if (!q) return res.json([]);

  const all = await Inventory.findAll({
    include: [{ association: "owner", attributes: ["id", "username"] }],
    order: [["createdAt", "DESC"]],
    limit: 50,
  });

  const result = all.filter(
    (x) =>
      x.title.toLowerCase().includes(q) ||
      (x.description || "").toLowerCase().includes(q)
  );

  res.json(result);
});

export const createInventory = asyncHandler(async (req, res) => {
  const { title, description, isPublic, categoryId } = req.body;
  const inv = await Inventory.create({
    title,
    description,
    isPublic: !!isPublic,
    categoryId: categoryId ?? null,
    userId: req.user.id,
  });
  res.status(201).json(inv);
});

export const getInventory = asyncHandler(async (req, res) => {
  const inv = await Inventory.findByPk(req.params.id, {
    include: [{ model: Item, as: "items" }],
  });

  if (!inv) return res.status(404).json({ error: "Inventory not found" });

  const isOwner = inv.userId === req.user.id;
  const isAdmin = req.user.role === "ADMIN";

  const hasAccess = await InventoryAccess.findOne({
    where: {
      inventoryId: inv.id,
      userId: req.user.id,
    },
  });

  if (!isOwner && !isAdmin && !hasAccess) {
    return res.status(403).json({ error: "Access denied" });
  }

  res.json(inv);
});

export const getUserInventories = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.user.role !== "ADMIN" && req.user.id !== parseInt(userId)) {
    return res.status(403).json({ error: "Access denied" });
  }

  const owned = await Inventory.findAll({
    where: { userId },
    include: [{ model: Item, as: "items" }],
  });

  const shared = await Inventory.findAll({
    include: [
      {
        model: InventoryAccess,
        where: { userId },
      },
      { model: Item, as: "items" },
    ],
  });

  const all = [...owned, ...shared].filter(
    (v, i, arr) => arr.findIndex((x) => x.id === v.id) === i
  );

  res.json(all);
});

export const deleteInventory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const inv = await Inventory.findByPk(id);

  if (!inv) {
    return res.status(404).json({ error: "Inventory not found" });
  }

  if (req.user.role !== "ADMIN" && inv.userId !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }

  await inv.destroy();
  res.json({ message: "Inventory deleted successfully" });
});


export const updateInventory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const inv = await Inventory.findByPk(id);
  if (!inv) return res.status(404).json({ error: "Inventory not found" });

  if (req.user.role !== "ADMIN" && inv.userId !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }

  inv.title = title ?? inv.title;
  inv.description = description ?? inv.description;
  await inv.save();

  res.json(inv);
});
