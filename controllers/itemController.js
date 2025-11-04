import asyncHandler from "express-async-handler";
import { Item } from "../models/index.js";

export const getItems = asyncHandler(async (req, res) => {
  const { inventoryId } = req.params;
  const items = await Item.findAll({ where: { inventoryId } });
  res.json(items);
});

export const createItem = asyncHandler(async (req, res) => {
  const inventoryId = req.params.inventoryId || req.body.inventoryId;
  const { name, description, customId } = req.body;

  if (!inventoryId || !name || !customId) {
    return res.status(400).json({ error: "inventoryId, name, customId required" });
  }

  const item = await Item.create({
    inventoryId,
    name,
    description,
    customId,
    version: 1,
    likedBy: [],
  });

  res.status(201).json(item);
});

export const updateItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const item = await Item.findByPk(itemId);
  if (!item) return res.status(404).json({ error: "Item not found" });

  item.version += 1;
  Object.assign(item, req.body);
  await item.save();

  res.json(item);
});


export const deleteItem = asyncHandler(async (req, res) => {
  const { itemId, inventoryId } = req.params;

  const item = await Item.findOne({
    where: { id: itemId, inventoryId },
  });

  if (!item) return res.status(404).json({ error: "Item not found" });

  await item.destroy();
  res.json({ message: "Item deleted successfully" });
});
