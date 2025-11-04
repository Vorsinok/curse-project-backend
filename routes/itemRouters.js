import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { createItem, updateItem, deleteItem, getItems } from "../controllers/itemController.js";
import { canEditInventory } from "../middleware/canEditInventory.js";

const router = Router();

router.get("/:inventoryId", authenticateToken, getItems);

router.post("/:inventoryId", authenticateToken, canEditInventory, createItem);

router.patch("/:inventoryId/:itemId", authenticateToken, canEditInventory, updateItem);

router.delete("/:inventoryId/:itemId", authenticateToken, canEditInventory, deleteItem);


export default router;
